import { StyleSheet, Text, useColorScheme, View } from 'react-native'

import { Colors } from '@/constants/Colors'
import Main from '@/components/ui/main'
import { useEffect, useState } from 'react'
import { TopicWithUsers } from '@/lib/interfaces'
import { API_URL } from '@/constants/config'
import { useAuth } from '@/hooks/useAuth'
import * as SecureStore from 'expo-secure-store'
import TopicCard from '@/components/ui/topic-card'

export default function HomeScreen() {
    const [topics, setTopics] = useState<TopicWithUsers[]>()
    const colorScheme = useColorScheme() || 'dark'
    // const textColor = Colors[colorScheme].text
    const {user} = useAuth()

    useEffect(() => {
        if (user) {
            const loadTopics = async () => {
                const t = await SecureStore.getItemAsync('authToken')
                const result = await fetch(`${API_URL}/topics/getAllByUser?userId=${user.id}`, {
                    'method': 'GET',
                    'headers': {
                        'Authorization': `Bearer ${t}`,
                        'Content-Type': 'application/json',
                    }
                })
                const data = await result.json()
                setTopics(data)
            }

            loadTopics()
        }
    }, [user])

    return (
        <Main>
            <Text style={[{color: Colors[colorScheme].textSecondary, marginBottom: 10}]}>Aquí encontrarás todos tus temas.</Text>
            <View>
                {topics && topics.map((topic) => (
                    <View key={topic.id}>
                        <TopicCard
                            topic={topic}
                            isMine={topic.ownerId === user?.id}
                            textColor={'#fff'}
                        />
                    </View>
                ))}
            </View>
        </Main>
    )
}

const styles = StyleSheet.create({})
