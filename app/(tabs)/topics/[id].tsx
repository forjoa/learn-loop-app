import { useLocalSearchParams } from 'expo-router'
import { Text, StyleSheet, useColorScheme, View, Image, ScrollView } from 'react-native'
import Main from '@/components/ui/main'
import { Colors } from '@/constants/Colors'
import { useEffect, useState } from 'react'
import { API_URL } from '@/constants/config'
import * as SecureStore from 'expo-secure-store'
import { DetailedTopic } from '@/lib/interfaces'
import { profileImages } from '@/assets/profile-images'

export default function TopicDetails() {
    const [topic, setTopic] = useState<DetailedTopic>()
    const {id} = useLocalSearchParams()
    const theme = useColorScheme() || 'dark'

    useEffect(() => {
        const loadTopic = async () => {
            const token = await SecureStore.getItemAsync('authToken')
            const result = await fetch(`${API_URL}/topics/topic?id=${id}`, {
                'method': 'GET',
                'headers': {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            })
            const data = await result.json()

            setTopic(data)
        }

        loadTopic()
    }, [id])

    return (
        <Main>
            {topic ? (
                <View style={[styles.container]}>
                    <Text style={[styles.title, {color: Colors[theme].text}]}>{topic?.title}</Text>
                    <Text style={[{color: Colors[theme].text}]}>{topic?.description}</Text>
                    <View style={[
                        styles.hr,
                        {backgroundColor: Colors[theme].border}
                    ]}/>
                    <Text style={[{color: Colors[theme].textSecondary}]}>Miembros</Text>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}
                                style={[styles.profilesContainer]}>
                        {topic.users.map((user, index) => {
                            return (
                                <View key={index} style={[styles.profileImageContainer, {backgroundColor: Colors[theme].primaryBackground, borderColor: Colors[theme].primaryBorder}]}>
                                    <Image
                                        source={profileImages[user.photo]}
                                        style={styles.profileImage}
                                    />
                                </View>
                            )
                        })}
                    </ScrollView>
                    <View style={[
                        styles.hr,
                        {backgroundColor: Colors[theme].border}
                    ]}/>
                    <Text style={[{color: Colors[theme].textSecondary}]}>Contenido</Text>
                </View>
            ) : (
                <Text style={[{color: Colors[theme].text}]}>No hay tema con este ID</Text>
            )}
        </Main>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    hr: {
        height: 1,
        marginVertical: 15,
    },
    profilesContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    profileImageContainer: {
        marginRight: 10,
        borderWidth: 1,
        borderRadius: 100
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    }
})
