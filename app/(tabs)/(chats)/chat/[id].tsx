import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  useColorScheme,
  Text,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import { Feather } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import { GlassSurface } from '@/components/ui/glass-view'
import { Motion, Radius, Spacing, Typography } from '@/constants/Theme'
import Constants from 'expo-constants'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import * as Haptics from 'expo-haptics'
import { API_URL } from '@/constants/config'
import { ChatDetail, Message } from '@/lib/interfaces'
import { generateDeterministicHexColorFromUUID } from '@/lib/utils'
import { ScrollView } from 'react-native-gesture-handler'
import { useAuth } from '@/hooks/useAuth'
import { useTabBarVisibility } from '@/contexts/TabBarContext'
import { useCallback } from 'react'
// eslint-disable-next-line import/no-named-as-default
import io, { Socket } from 'socket.io-client'

function MessageBubble({ message, isMine, theme, getInitials }: { message: Message, isMine: boolean, theme: 'light' | 'dark', getInitials: (n: string) => string }) {
  const entrance = useSharedValue(0)

  useEffect(() => {
    entrance.value = withSpring(1, Motion.springSoft)
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: entrance.value,
    transform: [
      { scale: 0.85 + entrance.value * 0.15 },
      { translateY: (1 - entrance.value) * 8 },
    ],
  }))

  return (
    <Animated.View
      style={[
        styles.bubble,
        animatedStyle,
        {
          backgroundColor: isMine ? Colors[theme].primary : Colors[theme].header.background,
          alignSelf: isMine ? 'flex-end' : 'flex-start',
          borderBottomRightRadius: isMine ? Radius.xs : Radius.lg,
          borderBottomLeftRadius: isMine ? Radius.lg : Radius.xs,
        },
      ]}
    >
      {!isMine && (
        <Text style={[styles.sender, { color: Colors[theme].textSecondary }]}>
          {getInitials(message.sender.name!)}
        </Text>
      )}
      <Text style={{ color: isMine ? 'white' : Colors[theme].text, ...Typography.body }}>
        {message.content}
      </Text>
    </Animated.View>
  )
}

export default function ChatScreen() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [chatDetail, setChatDetail] = useState<ChatDetail | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
  const colorScheme = useColorScheme() === 'light' ? 'light' : 'dark'
  const messagesEndRef = useRef<ScrollView>(null)
  const { user } = useAuth()
  const insets = useSafeAreaInsets()
  const sendScale = useSharedValue(1)
  const sendAnimatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: sendScale.value }] }))

  const { id } = useLocalSearchParams()
  const { setIsTabBarHidden } = useTabBarVisibility()

  useFocusEffect(
    useCallback(() => {
      setIsTabBarHidden(true)
      return () => setIsTabBarHidden(false)
    }, [])
  )

  useEffect((): any => {
    const newSocket = io(API_URL)
    setSocket(newSocket)

    return () => newSocket.close()
  }, [])

  useEffect(() => {
    // KeyboardAvoidingView already pushes this view up by the keyboard's height, so
    // the static bottom safe-area inset would just add an extra gap above the
    // keyboard - only apply it while the keyboard is hidden.
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

    const showSub = Keyboard.addListener(showEvent, () => setIsKeyboardVisible(true))
    const hideSub = Keyboard.addListener(hideEvent, () => setIsKeyboardVisible(false))

    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollToEnd({ animated: true })
    }
  }, [messages])

  useEffect(() => {
    const loadMessages = async () => {
      const t = await SecureStore.getItemAsync('authToken')

      const result = await fetch(`${API_URL}/messages/get?chatId=${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${t}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await result.json()
      setMessages(data)
    }

    loadMessages()
  }, [id])

  useEffect(() => {
    const loadChatDetail = async () => {
      const t = await SecureStore.getItemAsync('authToken')

      const result = await fetch(`${API_URL}/chats/chat?id=${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${t}`,
          'Content-Type': 'application/json',
        },
      })

      if (result.ok) {
        setChatDetail(await result.json())
      }
    }

    loadChatDetail()
  }, [id])

  useEffect(() => {
    if (socket && id) {
      socket.emit('joinRoom', id.toString())

      socket.on('chatMessage', (message: Message) => {
        if (message.sender.id !== user?.id) {
          setMessages((prevMessages) => [...prevMessages, message])
        }
      })

      return () => {
        socket.off('chatMessage')
      }
    }
  }, [socket, id, user])

  const getInitials = (name: string) => {
    return name.split(' ')[0]
  }

  const handleMessageSend = async () => {
    if (!message || message.trim() === '') return

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

    if (socket && id && user) {
      const t = await SecureStore.getItemAsync('authToken')

      const result = await fetch(`${API_URL}/messages/send`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${t}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: id,
          content: message,
          senderId: user?.id,
        }),
      })

      const { data } = await result.json()

      setMessages((prevMessages) => [...prevMessages, data])

      socket.emit('chatMessage', {
        room: id.toString(),
        message: data,
      })

      setMessage('')
    }
  }

  const otherMembers = chatDetail?.members.filter((member) => member.id !== user?.id) ?? []
  const participantsLabel =
    otherMembers.length === 0
      ? ''
      : otherMembers.length <= 2
        ? otherMembers.map((member) => member.name).join(', ')
        : `${otherMembers[0].name} y ${otherMembers.length - 1} más`

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <GlassSurface tint={colorScheme} radius={0} style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Feather
            name="arrow-left"
            size={20}
            color={Colors[colorScheme].textSecondary}
          />
        </Pressable>
        {!!chatDetail && (
          <View style={[styles.avatar, { backgroundColor: generateDeterministicHexColorFromUUID(chatDetail.id) }]}>
            <Text style={styles.avatarText}>{chatDetail.topicName.substring(0, 2).toUpperCase()}</Text>
          </View>
        )}
        <View style={styles.headerTexts}>
          <Text style={[Typography.bodyStrong, { color: Colors[colorScheme].text }]} numberOfLines={1}>
            {chatDetail?.topicName ?? ''}
          </Text>
          {!!participantsLabel && (
            <Text style={[Typography.small, { color: Colors[colorScheme].textSecondary }]} numberOfLines={1}>
              {participantsLabel}
            </Text>
          )}
        </View>
      </GlassSurface>

      <ScrollView
        ref={messagesEndRef}
        contentContainerStyle={styles.chatList}
        onContentSizeChange={() =>
          messagesEndRef.current?.scrollToEnd({ animated: true })
        }
        style={styles.chatContainer}
      >
        {messages &&
          user &&
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isMine={message.sender.id === user.id}
              theme={colorScheme}
              getInitials={getInitials}
            />
          ))}
      </ScrollView>

      <GlassSurface
        tint={colorScheme}
        radius={0}
        style={[styles.inputContainer, { paddingBottom: Spacing.base + (isKeyboardVisible ? 0 : insets.bottom) }]}
      >
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: Colors[colorScheme].input,
              color: Colors[colorScheme].text,
            },
          ]}
          placeholder="Escribe un mensaje..."
          placeholderTextColor={Colors[colorScheme].textSecondary}
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <Animated.View style={sendAnimatedStyle}>
          <Pressable
            onPressIn={() => { sendScale.value = withSpring(0.85, Motion.spring) }}
            onPressOut={() => { sendScale.value = withSpring(1, Motion.spring) }}
            style={[styles.sendButton, { backgroundColor: Colors[colorScheme].primary }]}
            onPress={handleMessageSend}
          >
            <Feather name="arrow-up" size={20} color="#fff" />
          </Pressable>
        </Animated.View>
      </GlassSurface>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  chatContainer: { flex: 1, padding: Spacing.md, paddingBottom: Spacing.lg },
  bubble: {
    padding: Spacing.md,
    borderRadius: Radius.lg,
    marginBottom: Spacing.sm,
    maxWidth: '80%',
  },
  sender: {
    ...Typography.label,
    fontWeight: '600',
    textTransform: 'none',
    marginBottom: Spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    gap: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  input: {
    ...Typography.body,
    flex: 1,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    overflow: 'hidden',
    paddingTop: Constants.statusBarHeight + Spacing.sm,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  headerTexts: {
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...Typography.small,
    fontWeight: '700',
    color: '#fff',
  },
  chatList: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
})
