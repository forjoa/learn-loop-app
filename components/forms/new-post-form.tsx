import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native'
import { Picker } from '@expo/ui'
import { Colors } from '@/constants/Colors'
import Feather from '@expo/vector-icons/Feather'
import { Topic, User } from '@/lib/interfaces'
import { Radius, Spacing, Typography } from '@/constants/Theme'
import { env } from '@/lib/environment'
import { API_URL } from '@/constants/config'
import * as DocumentPicker from 'expo-document-picker'
import SwipeToDeleteItem from '@/components/ui/swipe-delete-item'

interface NewPostFormProps {
    loadingTopics: boolean
    topicsByOwner: Topic[]
    selectedTopic: Topic | null
    setSelectedTopic: (topic: Topic) => void
    setSelectedTopicId: (id: string) => void
    setTitle: (text: string) => void
    setContent: (text: string) => void
    title: string
    content: string
    pickDocuments: () => void
    selectedDocument: DocumentPicker.DocumentPickerAsset
    setSelectedDocument: (document: DocumentPicker.DocumentPickerAsset | null) => void
}

export default function NewPostForm({
                                        loadingTopics,
                                        topicsByOwner,
                                        selectedTopic,
                                        setSelectedTopic,
                                        setSelectedTopicId,
                                        title,
                                        setTitle,
                                        pickDocuments,
                                        content,
                                        setContent,
                                        selectedDocument,
                                        setSelectedDocument
                                    }: NewPostFormProps) {
    const theme = useColorScheme() === 'light' ? 'light' : 'dark'

    const handleDelete = () => {
        setSelectedDocument(null)
    }

    return (
        <View style={styles.form}>
            {loadingTopics ? (
                <ActivityIndicator size="small" color={Colors[theme].primary}/>
            ) : topicsByOwner.length === 0 ? (
                <Text style={{color: Colors[theme].text}}>No hay temas disponibles</Text>
            ) : (
                <>
                    <View style={[styles.pickerWrapper, {
                        backgroundColor: Colors[theme].input,
                        borderColor: Colors[theme].border,
                    }]}>
                        <Picker
                            selectedValue={selectedTopic?.id ?? topicsByOwner[0]?.id}
                            onValueChange={(topicId) => {
                                const topic = topicsByOwner.find((t) => t.id === topicId)
                                if (topic) {
                                    setSelectedTopicId(topic.id)
                                    setSelectedTopic(topic)
                                }
                            }}
                        >
                            {topicsByOwner.map((topic) => (
                                <Picker.Item key={topic.id} label={topic.title} value={topic.id} />
                            ))}
                        </Picker>
                    </View>
                    <TextInput
                        style={[styles.input, {
                            color: Colors[theme].text,
                            backgroundColor: Colors[theme].input,
                            borderColor: Colors[theme].border,
                        }]}
                        placeholder="Título del post"
                        placeholderTextColor={Colors[theme].textSecondary}
                        value={title}
                        onChangeText={setTitle}
                    />
                    <TextInput
                        style={[styles.textarea, {
                            color: Colors[theme].text,
                            backgroundColor: Colors[theme].input,
                            borderColor: Colors[theme].border,
                        }]}
                        placeholder="Contenido del post"
                        placeholderTextColor={Colors[theme].textSecondary}
                        value={content}
                        onChangeText={setContent}
                        multiline
                        numberOfLines={6}
                    />
                    {selectedDocument ? (
                        <SwipeToDeleteItem onDelete={handleDelete}>
                            <View style={[styles.fileContainer, {
                                backgroundColor: Colors[theme].nav.background,
                                borderColor: Colors[theme].nav.border
                            }]}>
                                <View style={[styles.typeContainer, {backgroundColor: Colors[theme].error}]}>
                                    <Text style={[{color: '#fff'}]}>
                                        {selectedDocument.name.split('.')[1]}
                                    </Text>
                                </View>
                                <View>
                                    <Text style={[{color: Colors[theme].text}]}>
                                        {`${selectedDocument.name}`}
                                    </Text>
                                </View>
                            </View>
                        </SwipeToDeleteItem>
                    ) : (
                        <TouchableOpacity style={[styles.selectFile, {
                            backgroundColor: Colors[theme].input || 'transparent',
                            borderColor: Colors[theme].border
                        }]} onPress={pickDocuments}>
                            <Text style={[{color: Colors[theme].text}]}>Adjuntar archivo</Text>
                            <Feather name="file-plus" color={Colors[theme].text} size={16} stroke={1}/>
                        </TouchableOpacity>
                    )}
                </>
            )}
        </View>
    )
}

function getMimeType(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase()
    switch (extension) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg'
        case 'png':
            return 'image/png'
        case 'pdf':
            return 'application/pdf'
        default:
            return 'application/octet-stream'
    }
}

export const createPost = async (title: string, content: string, selectedTopicId: string, setLoading: (loading: boolean) => void, selectedDocument: DocumentPicker.DocumentPickerAsset, token: string, resetForm: () => void, onClose: () => void, user: User) => {
    if (!title || !content || !selectedTopicId) {
        Alert.alert('Error', 'Por favor completa todos los campos')
        return
    }

    try {
        setLoading(true)

        let result

        if (selectedDocument) {
            const file = {
                uri: selectedDocument?.uri,
                name: selectedDocument?.name,
                type: getMimeType(selectedDocument?.name),
            }

            const data = new FormData()
            data.append('file', file as any)
            data.append('upload_preset', 'learn-loop')
            data.append('api_key', env.CLOUDINARY_KEY!)

            const response = await fetch(env.CLOUDINARY_ENDPOINT!, {
                method: 'POST',
                body: data,
            })

            result = await response.json()
        }

        await fetch(`${API_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    content,
                    userId: user?.id,
                    topicId: selectedTopicId,
                    fileUrl: result ? result.secure_url : null,
                    filename: selectedDocument ? selectedDocument.name.split('.')[0] : null,
                    fileType: selectedDocument ? selectedDocument.name.split('.')[1] : null,
                })
            }
        )

        Alert.alert('Éxito', 'Post creado correctamente')
        resetForm()
        onClose()
    } catch (error) {
        console.error('Error creating post:', error)
        Alert.alert('Error', 'No se pudo crear el post')
    } finally {
        setLoading(false)
    }
}

const styles = StyleSheet.create({
    form: {
        marginBottom: Spacing.lg,
        gap: Spacing.sm,
    },
    label: {
        marginBottom: Spacing.sm,
    },
    input: {
        ...Typography.body,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: Radius.md,
        padding: Spacing.base,
    },
    textarea: {
        ...Typography.body,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: Radius.md,
        padding: Spacing.base,
        textAlignVertical: 'top',
    },
    pickerWrapper: {
        minHeight: 52,
        borderRadius: Radius.md,
        borderWidth: StyleSheet.hairlineWidth,
        overflow: 'hidden',
        justifyContent: 'center',
        paddingHorizontal: Spacing.sm,
    },
    selectFile: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: Spacing.xs,
        height: 52,
        borderRadius: Radius.md,
        borderWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: Spacing.base,
    },
    fileContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        padding: Spacing.md,
        borderRadius: Radius.md,
        borderWidth: StyleSheet.hairlineWidth,
    },
    typeContainer: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.xs,
    }
})