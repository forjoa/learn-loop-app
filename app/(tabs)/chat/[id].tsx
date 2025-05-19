import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  Text,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import Constants from 'expo-constants'
import { router, useLocalSearchParams } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { API_URL } from '@/constants/config'
import { Message } from '@/lib/interfaces'
import { ScrollView } from 'react-native-gesture-handler'
import { useAuth } from '@/hooks/useAuth'
// eslint-disable-next-line import/no-named-as-default
import io, { Socket } from 'socket.io-client'

export default function ChatScreen() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [socket, setSocket] = useState<Socket | null>(null)
  const colorScheme = useColorScheme() || 'dark'
  const messagesEndRef = useRef<ScrollView>(null)
  const { user } = useAuth()

  const { id } = useLocalSearchParams()

  useEffect((): any => {
    const newSocket = io(API_URL)
    setSocket(newSocket)

    return () => newSocket.close()
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: Colors[colorScheme].header.background,
            borderColor: Colors[colorScheme].header.border,
          },
        ]}
      >
        <TouchableOpacity style={styles.title} onPress={() => router.back()}>
          <Feather
            name="arrow-left"
            size={20}
            color={Colors[colorScheme].textSecondary}
          />
          <Text style={[{ color: Colors[colorScheme].text }]}>{id}</Text>
        </TouchableOpacity>
      </View>

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
            <View
              key={message.id}
              style={{
                backgroundColor:
                  message.sender.id === user.id
                    ? Colors[colorScheme].primary
                    : Colors[colorScheme].header.background,
                padding: 10,
                borderRadius: 10,
                marginBottom: 10,
                alignSelf:
                  message.sender.id === user.id ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
              }}
            >
              {/* Mostrar iniciales solo si no es el usuario actual */}
              {message.sender.id !== user.id && (
                <Text
                  style={{
                    color: Colors[colorScheme].textSecondary,
                    fontSize: 12,
                    marginBottom: 4,
                  }}
                >
                  {getInitials(message.sender.name!)}
                </Text>
              )}
              <Text
                style={{
                  color:
                    message.sender.id === user.id
                      ? 'white'
                      : Colors[colorScheme].text,
                }}
              >
                {message.content}
              </Text>
            </View>
          ))}
      </ScrollView>

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: Colors[colorScheme].nav.background,
            borderColor: Colors[colorScheme].nav.border,
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: Colors[colorScheme].background,
              color: Colors[colorScheme].text,
            },
          ]}
          placeholder="Escribe un mensaje..."
          placeholderTextColor={Colors[colorScheme].text + '80'}
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleMessageSend}>
          <Feather name="send" size={24} color={Colors[colorScheme].primary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  chatContainer: { flex: 1, padding: 10, paddingBottom: 20 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: { padding: 10 },
  header: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
    overflow: 'hidden',
    paddingTop: Constants.statusBarHeight,
    padding: 20,
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  chatList: {
    marginTop: 10,
    marginBottom: 14,
  },
})
