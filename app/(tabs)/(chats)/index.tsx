import {
  StyleSheet,
  Text,
  Pressable,
  useColorScheme,
  View,
} from 'react-native'

import { Colors } from '@/constants/Colors'
import { Motion, Radius, Spacing, Typography } from '@/constants/Theme'
import { GlassSurface } from '@/components/ui/glass-view'
import { useEffect, useState } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming, Easing } from 'react-native-reanimated'
import Main from '@/components/ui/main'
import * as SecureStorage from 'expo-secure-store'
import { API_URL } from '@/constants/config'
import { useAuth } from '@/hooks/useAuth'
import { Chat } from '@/lib/interfaces'
import { generateDeterministicHexColorFromUUID } from '@/lib/utils'
import { RelativePathString, router } from 'expo-router'

function ChatRow({ chat, theme, index }: { chat: Chat, theme: 'light' | 'dark', index: number }) {
  const scale = useSharedValue(1)
  const entrance = useSharedValue(0)

  useEffect(() => {
    entrance.value = withDelay(
      Math.min(index, 8) * 50,
      withTiming(1, { duration: Motion.durationBase, easing: Easing.out(Easing.cubic) })
    )
  }, [])

  // No opacity here: wraps a GlassSurface, and animating opacity on a GlassView or
  // its ancestors breaks/crashes native Liquid Glass (expo/expo#50097).
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: (1 - entrance.value) * 12 },
      { scale: scale.value },
    ],
  }))

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPressIn={() => { scale.value = withSpring(0.98, Motion.spring) }}
        onPressOut={() => { scale.value = withSpring(1, Motion.spring) }}
        onPress={() => router.push(`/chat/${chat.id}` as RelativePathString)}
      >
        <GlassSurface tint={theme} radius={Radius.lg} style={styles.chatContainer}>
          <View
            style={[
              styles.nameContainer,
              { backgroundColor: generateDeterministicHexColorFromUUID(chat.id ?? 1) },
            ]}
          >
            <Text style={[styles.nameAvatar, { color: 'white' }]}>
              {chat.topicName.substring(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={styles.messageContent}>
            <View style={{ gap: Spacing.xs, flexShrink: 1 }}>
              <Text style={[styles.chatTitle, { color: Colors[theme].text }]}>
                {chat.topicName}
              </Text>
              <Text style={[styles.preview, { color: Colors[theme].textSecondary }]} numberOfLines={1}>
                {chat.lastMessage ?? ''}
              </Text>
            </View>
            {chat.lastMessage && (
              <Text style={[styles.date, { color: Colors[theme].textSecondary }]}>
                {new Date(chat.lastMessageDate).toLocaleDateString('es-ES', {
                  month: '2-digit',
                  day: '2-digit',
                })}
              </Text>
            )}
          </View>
        </GlassSurface>
      </Pressable>
    </Animated.View>
  )
}

export default function ChatsScreen() {
  const [chats, setChats] = useState<Chat[]>([])
  const { user } = useAuth()
  const theme = useColorScheme() === 'light' ? 'light' : 'dark'

  const loadChats = async () => {
    const token = await SecureStorage.getItemAsync('authToken')
    if (user) {
      const response = await fetch(
        `${API_URL}/chats/getAll?userId=${user?.id as string}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      const result = await response.json()
      setChats(result)
    }
  }

  useEffect(() => {
    loadChats()
  })

  return (
    <Main onLoad={loadChats}>
      {chats?.length > 0 ? (
        chats.map((chat, index) => (
          <ChatRow key={chat.id} chat={chat} theme={theme} index={index} />
        ))
      ) : (
        <Text style={[{ color: Colors[theme].textSecondary }]}>
          No hay conversaciones
        </Text>
      )}
    </Main>
  )
}

const styles = StyleSheet.create({
  nameContainer: {
    width: 48,
    height: 48,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameAvatar: {
    ...Typography.bodyStrong,
  },
  chatTitle: {
    ...Typography.bodyStrong,
  },
  preview: {
    ...Typography.small,
  },
  date: {
    ...Typography.label,
    fontWeight: '400',
    textTransform: 'none',
  },
  chatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  messageContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
})
