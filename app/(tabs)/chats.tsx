import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native'

import { Colors } from '@/constants/Colors'
import { useEffect, useState } from 'react'
import Main from '@/components/ui/main'
import * as SecureStorage from 'expo-secure-store'
import { API_URL } from '@/constants/config'
import { useAuth } from '@/hooks/useAuth'
import { Chat } from '@/lib/interfaces'
import { generateDeterministicHexColorFromUUID } from '@/lib/utils'
import { RelativePathString, router } from 'expo-router'

export default function ChatsScreen() {
  const [chats, setChats] = useState<Chat[]>([])
  const { user } = useAuth()
  const theme = useColorScheme() || 'dark'

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
        chats.map((chat) => {
          return (
            <TouchableOpacity
              onPress={() =>
                router.push(`/chat/${chat.id}` as RelativePathString)
              }
              style={[
                styles.chatContainer,
                {
                  borderColor: Colors[theme].nav.border,
                },
              ]}
              key={chat.id}
            >
              <View
                style={[
                  styles.nameContainer,
                  {
                    backgroundColor: generateDeterministicHexColorFromUUID(
                      chat.id ?? 1
                    ),
                  },
                ]}
              >
                <Text style={[styles.nameAvatar, { color: 'white' }]}>
                  {chat.topicName.substring(0, 2).toUpperCase()}
                </Text>
              </View>
              <View style={styles.messageContent}>
                <View style={{ gap: 5 }}>
                  <Text
                    style={[styles.nameAvatar, { color: Colors[theme].text }]}
                  >
                    {chat.topicName}
                  </Text>
                  <Text style={[{ color: Colors[theme].textSecondary }]}>
                    {chat.lastMessage ?? ''}
                  </Text>
                </View>
                {chat.lastMessage && (
                  <Text style={[{ color: Colors[theme].textSecondary }]}>
                    {new Date(chat.lastMessageDate).toLocaleDateString(
                      'es-ES',
                      {
                        // year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      }
                    )}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )
        })
      ) : (
        <Text style={[{ color: Colors[theme].textSecondary }]}>
          No hay conversaciones
        </Text>
      )}
    </Main>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  title: {
    color: '#fff',
  },
  nameContainer: {
    padding: 10,
    borderRadius: 4,
  },
  nameAvatar: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  chatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderTopWidth: 1.5,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.255,
  },
  messageContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
})
