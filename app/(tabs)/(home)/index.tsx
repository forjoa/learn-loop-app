import { StyleSheet, Text, useColorScheme, View } from 'react-native'

import { Colors } from '@/constants/Colors'
import { Spacing, Typography } from '@/constants/Theme'
import Main from '@/components/ui/main'
import { useEffect, useState } from 'react'
import { TopicWithUsers } from '@/lib/interfaces'
import { API_URL } from '@/constants/config'
import { useAuth } from '@/hooks/useAuth'
import { useHomeSearch } from '@/contexts/HomeSearchContext'
import * as SecureStore from 'expo-secure-store'
import TopicCard from '@/components/ui/topic-card'

export default function HomeScreen() {
    const [topics, setTopics] = useState<TopicWithUsers[]>()
    const colorScheme = useColorScheme() === 'light' ? 'light' : 'dark'
    const {user} = useAuth()
    const { query } = useHomeSearch()

    const loadTopics = async () => {
        if (!user) return

        const t = await SecureStore.getItemAsync('authToken')
        const result = await fetch(`${API_URL}/topics/getAllByUser?userId=${user.id}`, {
            'method': 'GET',
            'headers': {
                'Authorization': `Bearer ${t}`,
                'Content-Type': 'application/json',
            }
        })
        const data = await result.json()
        setTopics(Array.isArray(data) ? data : [])
    }

    useEffect(() => {
        if (user) {
            loadTopics()
        }
    }, [user])

    const filteredTopics = topics?.filter((topic) =>
        topic.title.toLowerCase().includes(query.toLowerCase())
    )

    return (
        <Main onLoad={loadTopics}>
            <Text style={[styles.subtitle, {color: Colors[colorScheme].textSecondary}]}>Aquí encontrarás todos tus
                temas.</Text>
            <View>
                {filteredTopics && filteredTopics.length > 0 ? (
                    filteredTopics.map((topic, index) => (
                        <View key={topic.id}>
                            <TopicCard
                                topic={topic}
                                isMine={topic.ownerId === user?.id}
                                textColor={'#fff'}
                                index={index}
                            />
                        </View>
                    ))
                ) : topics && topics.length > 0 ? (
                    <Text style={[styles.subtitle, {color: Colors[colorScheme].textSecondary}]}>
                        Sin resultados para &quot;{query}&quot;
                    </Text>
                ) : null}
            </View>
        </Main>
    )
}

const styles = StyleSheet.create({
    subtitle: {
        ...Typography.small,
        marginBottom: Spacing.sm,
    },
})
