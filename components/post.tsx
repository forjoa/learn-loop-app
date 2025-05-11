import {
    ColorSchemeName,
    ScrollView,
    StyleSheet,
    Text, TouchableOpacity,
    View
} from 'react-native'
import BottomSheet from '@/components/ui/bottom-sheet'
import { Colors } from '@/constants/Colors'
import { useEffect, useState } from 'react'
import { DetailedPost } from '@/lib/interfaces'
import { API_URL } from '@/constants/config'
import * as SecureStore from 'expo-secure-store'
import * as WebBrowser from 'expo-web-browser'

type PostProps = {
    isVisible: boolean
    onClose: () => void
    colorScheme?: ColorSchemeName
    currentPostId: string
}

export default function Post({
                                 isVisible,
                                 onClose,
                                 currentPostId,
                                 colorScheme = 'dark',
                             }: PostProps) {
    const [post, setPost] = useState<DetailedPost>()
    const [token, setToken] = useState('')
    const theme = colorScheme || 'dark'

    useEffect(() => {
        const loadToken = async () => {
            const t = await SecureStore.getItemAsync('authToken')
            setToken(t!)
        }

        loadToken()
    }, [])

    useEffect(() => {
        console.log(currentPostId)
        if (currentPostId) {
            const loadPost = async () => {
                const result = await fetch(`${API_URL}/posts/?id=${currentPostId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                })
                const data = await result.json()

                setPost(data)
                console.log(data)
            }

            loadPost()
        }
    }, [currentPostId, token])

    const handlePressButtonAsync = async (url: string) => {
        await WebBrowser.openBrowserAsync(url)
    }

    return (
        <BottomSheet isVisible={isVisible} onClose={onClose} colorScheme={theme}>
            {post && (
                <View style={styles.contentContainer}>
                    <Text style={[styles.title, {color: Colors[theme].text}]}>
                        {post.title}
                    </Text>

                    <View style={styles.scrollContainer}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                        >
                            <Text style={[{color: Colors[theme].text}]}>{post.content}</Text>

                            <View style={[
                                styles.hr,
                                {backgroundColor: Colors[theme].border}
                            ]}/>

                            {post.file ? (
                                <TouchableOpacity
                                    style={[styles.fileContainer, {
                                        backgroundColor: Colors[theme].nav.background,
                                        borderColor: Colors[theme].nav.border
                                    }]}
                                    onPress={() => handlePressButtonAsync(post?.file.url)}>
                                    <View style={[styles.typeContainer, {backgroundColor: Colors[theme].error}]}>
                                        <Text style={[{color: '#fff'}]}>
                                            {post.file.fileType}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text style={[{color: Colors[theme].text}]}>
                                            {`${post.file.filename}.${post.file.fileType}`}
                                        </Text>
                                        <Text style={[{color: Colors[theme].textSecondary}]}>
                                            Publicado {new Date(post.file.createdAt!).getDay()}/{new Date(post.file.createdAt!).getMonth() + 1}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                <Text style={[{color: Colors[theme].text}]}>No hay archivos disponibles</Text>
                            )}
                        </ScrollView>
                    </View>
                </View>
            )}
        </BottomSheet>
    )
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    scrollContainer: {
        flex: 1,
        height: '100%',
    },
    hr: {
        height: 1,
        marginVertical: 20,
    },
    fileContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 15,
        borderRadius: 15,
        borderTopWidth: 1.5,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
    },
    typeContainer: {
        paddingHorizontal: 10,
        paddingVertical: 13,
        borderRadius: 10,
    }
})