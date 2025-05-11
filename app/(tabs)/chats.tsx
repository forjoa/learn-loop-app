import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'

import { Colors } from '@/constants/Colors'
import { useEffect, useState } from 'react'
import Main from '@/components/ui/main'
import * as SecureStorage from 'expo-secure-store'
import { API_URL } from '@/constants/config'
import { useAuth } from '@/hooks/useAuth'
import { Chat } from '@/lib/interfaces'
import { generateDeterministicHexColorFromUUID } from '@/lib/utils'

export default function ChatsScreen() {
    const [chats, setChats] = useState<Chat[]>([])
    const {user} = useAuth()
    const theme = useColorScheme() || 'dark'

    const loadChats = async () => {
        const token = await SecureStorage.getItemAsync('authToken')
        if (user) {
            const response = await fetch(`${API_URL}/chats/getAll?userId=${user?.id as string}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
            const result = await response.json()
            setChats(result)
        }
    }

    useEffect(() => {
        loadChats()
    }, [])

    return (
        <Main onLoad={loadChats}>
            {chats?.length > 0 ? (
                chats.map((chat) => {
                    console.log(chat)
                    return (
                        <TouchableOpacity style={[styles.chatContainer, {
                            borderColor: Colors[theme].nav.border,
                        }]} key={chat.id}>
                            <View
                                style={[styles.nameContainer, {backgroundColor: generateDeterministicHexColorFromUUID(chat.id ?? 1)}]}>
                                <Text style={[{color: Colors[theme].text}]}>
                                    {chat.topicName.substring(0, 2).toUpperCase()}
                                </Text>
                            </View>
                            <Text style={[{color: Colors[theme].text}]}>
                                {chat.topicName}
                            </Text>
                        </TouchableOpacity>
                    )
                })
            ) : (
                <Text style={[{color: Colors[theme].textSecondary}]}>No hay conversaciones</Text>
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
        fontWeight: 'bold'
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
        borderBottomWidth: 0.25
    }
})
