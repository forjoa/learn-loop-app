import { RelativePathString, router, useLocalSearchParams } from 'expo-router'
import { Text, StyleSheet, useColorScheme, View, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import Main from '@/components/ui/main'
import { Colors } from '@/constants/Colors'
import { useEffect, useState } from 'react'
import { API_URL } from '@/constants/config'
import * as SecureStore from 'expo-secure-store'
import { DetailedTopic } from '@/lib/interfaces'
import { profileImages } from '@/assets/profile-images'
import Feather from '@expo/vector-icons/Feather'
import Post from '@/components/post'

const {width} = Dimensions.get('window')

export default function TopicDetails() {
    const [topic, setTopic] = useState<DetailedTopic>()
    const [postIsVisible, setPostIsVisible] = useState(false)
    const [selectedPostId, setSelectedPostId] = useState<number>()
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
        <>
            <Main>
                <View>
                    <TouchableOpacity style={styles.backContainer}
                                      onPress={() => router.push(`/` as RelativePathString)}>
                        <Feather name="arrow-left" style={[{color: Colors[theme].text}]} size={14}/>
                        <Text style={[{color: Colors[theme].text}]}>
                            Volver
                        </Text>
                    </TouchableOpacity>
                </View>
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
                                    <View key={index} style={[styles.profileImageContainer, {
                                        backgroundColor: Colors[theme].primaryBackground,
                                        borderColor: Colors[theme].primaryBorder
                                    }]}>
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
                        <ScrollView showsVerticalScrollIndicator={false}
                                    style={[styles.postsContainer]}>
                            {topic.posts.map((post, index) => {
                                return (
                                    <TouchableOpacity key={index} style={[
                                        styles.postContainer, {
                                            backgroundColor: Colors[theme].nav.background,
                                            borderColor: Colors[theme].nav.border,
                                        }]}
                                                      onPress={() => {
                                                          setSelectedPostId(post.id)
                                                          setPostIsVisible(true)
                                                      }}
                                    >
                                        <View style={[styles.postIconContainer]}>
                                            <Feather name="book-open" color={'#fff'} size={24}/>
                                        </View>
                                        <View style={[styles.postContentContainer]}>
                                            <Text
                                                style={[styles.postTitle, {color: Colors[theme].text}]}>{post.title}</Text>
                                            <Text
                                                style={[{color: Colors[theme].textSecondary}]}>
                                                {new Date(post.createdAt!).getDay()}/{new Date(post.createdAt!).getMonth() + 1} - {new Date(post.createdAt!).getHours()}:{new Date(post.createdAt!).getMinutes()}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    </View>
                ) : (
                    <Text style={[{color: Colors[theme].text}]}>No hay tema con este ID</Text>
                )}
            </Main>

            <Post isVisible={postIsVisible} onClose={() => setPostIsVisible(false)} colorScheme={theme} currentPostId={selectedPostId!}/>
        </>
    )
}

const styles = StyleSheet.create({
    backContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 10
    },
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
    },
    postsContainer: {
        display: 'flex',
        flexDirection: 'column'
    },
    postContainer: {
        width: width * 0.9,
        padding: 10,
        borderRadius: 10,
        borderTopWidth: 1.5,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10
    },
    postIconContainer: {
        backgroundColor: Colors['dark'].primary,
        padding: 10,
        borderRadius: 7
    },
    postContentContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4
    },
    postTitle: {
        fontWeight: 'bold'
    }
})
