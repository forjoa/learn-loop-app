import { useState } from 'react'
import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import * as DocumentPicker from 'expo-document-picker'
import BottomSheet from '@/components/ui/bottom-sheet'
import { Button } from '@/components/ui/button'
import NewPostForm, { createPost } from './new-post-form'
import { Colors } from '@/constants/Colors'
import { Spacing, Typography } from '@/constants/Theme'
import { useAuth } from '@/hooks/useAuth'
import { DetailedTopic } from '@/lib/interfaces'

interface QuickPostSheetProps {
    topic: DetailedTopic
    isVisible: boolean
    onClose: () => void
    onPosted: () => void
}

// A trimmed-down "new post" flow for when the topic is already known (opened from
// within that topic's own screen) - reuses NewPostForm's fixedTopic mode and the
// shared createPost logic instead of duplicating the form UI.
export default function QuickPostSheet({ topic, isVisible, onClose, onPosted }: QuickPostSheetProps) {
    const theme = useColorScheme() === 'light' ? 'light' : 'dark'
    const { user } = useAuth()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [selectedDocument, setSelectedDocument] = useState<DocumentPicker.DocumentPickerAsset | null>(null)
    const [loading, setLoading] = useState(false)

    const resetForm = () => {
        setTitle('')
        setContent('')
        setSelectedDocument(null)
    }

    const pickDocuments = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ multiple: false })
            if (!result.canceled) {
                setSelectedDocument((result as DocumentPicker.DocumentPickerSuccessResult).assets[0])
            }
        } catch (error) {
            console.error('Error picking documents:', error)
        }
    }

    const handleSubmit = async () => {
        const token = await SecureStore.getItemAsync('authToken')
        await createPost(
            title,
            content,
            topic.id,
            setLoading,
            selectedDocument!,
            token!,
            resetForm,
            () => {
                onClose()
                onPosted()
            },
            user!
        )
    }

    return (
        <BottomSheet isVisible={isVisible} onClose={onClose} colorScheme={theme}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: Colors[theme].text }]}>Nuevo post</Text>
                <Text style={[styles.subtitle, { color: Colors[theme].textSecondary }]}>
                    Publica contenido para los estudiantes de este tema.
                </Text>
            </View>

            <NewPostForm
                fixedTopic={topic}
                title={title}
                setTitle={setTitle}
                content={content}
                setContent={setContent}
                pickDocuments={pickDocuments}
                selectedDocument={selectedDocument!}
                setSelectedDocument={setSelectedDocument}
            />

            <Button label="Publicar" onPress={handleSubmit} loading={loading} />
        </BottomSheet>
    )
}

const styles = StyleSheet.create({
    header: {
        marginBottom: Spacing.lg,
    },
    title: {
        ...Typography.title,
        marginBottom: Spacing.xs,
    },
    subtitle: {
        ...Typography.small,
    },
})
