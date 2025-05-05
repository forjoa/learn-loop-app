import {
    ColorSchemeName,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native'
import BottomSheet from '@/components/ui/bottom-sheet'
import { Colors } from '@/constants/Colors'
import { useEffect, useState } from 'react'
import { DetailedPost } from '@/lib/interfaces'
import { API_URL } from '@/constants/config'
import * as SecureStore from 'expo-secure-store'

type PostProps = {
    isVisible: boolean
    onClose: () => void
    colorScheme?: ColorSchemeName
    currentPostId: number
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
                const result = await fetch(`${API_URL}/posts/?id=${Number(currentPostId)}`, {
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

    return (
        <BottomSheet isVisible={isVisible} onClose={onClose} colorScheme={theme}>
            <View style={styles.contentContainer}>
                <Text style={[styles.title, {color: Colors[theme].text}]}>
                    Resumen
                </Text>

                <View style={styles.scrollContainer}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >

                    </ScrollView>
                </View>
            </View>
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
    }
})