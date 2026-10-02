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
import { Colors } from '@/constants/Colors'
import Feather from '@expo/vector-icons/Feather'
import { Topic, User } from '@/lib/interfaces'
import { Radius, Spacing, Typography } from '@/constants/Theme'
import { env } from '@/lib/environment'
import { API_URL } from '@/constants/config'
import * as DocumentPicker from 'expo-document-picker'
import SwipeToDeleteItem from '@/components/ui/swipe-delete-item'
import { SelectField } from '@/components/ui/select-field'

interface NewPostFormProps {
    // When set, the form is locked to this topic and skips the topic fetch/selector
    // entirely - used when opened from within a specific topic's own screen.
    fixedTopic?: Topic
    loadingTopics?: boolean
    topicsByOwner?: Topic[]
    selectedTopic?: Topic | null
    setSelectedTopic?: (topic: Topic) => void
    setSelectedTopicId?: (id: string) => void
    setTitle: (text: string) => void
    setContent: (text: string) => void
    title: string
    content: string
    pickDocuments: () => void
    selectedDocument: DocumentPicker.DocumentPickerAsset
    setSelectedDocument: (document: DocumentPicker.DocumentPickerAsset | null) => void
}

export default function NewPostForm({
                                        fixedTopic,
                                        loadingTopics = false,
                                        topicsByOwner = [],
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

    const hasTopic = !!fixedTopic || topicsByOwner.length > 0

    return (
        <View style={styles.form}>
            {fixedTopic ? (
                <View>
                    <Text style={[styles.label, { color: Colors[theme].textSecondary }]}>Publicando en</Text>
                    <View style={[styles.lockedTopic, {
                        backgroundColor: Colors[theme].input,
                        borderColor: Colors[theme].border,
                    }]}>
                        <Feather name="book-open" size={16} color={Colors[theme].textSecondary} />
                        <Text style={[Typography.body, { color: Colors[theme].text }]} numberOfLines={1}>
                            {fixedTopic.title}
                        </Text>
                    </View>
                </View>
            ) : loadingTopics ? (
                <ActivityIndicator size="small" color={Colors[theme].primary}/>
            ) : topicsByOwner.length === 0 ? (
                <Text style={{color: Colors[theme].text}}>Todavía no tienes temas. Crea uno primero en la pestaña &ldquo;Nuevo tema&rdquo;.</Text>
            ) : (
                <SelectField
                    label="Tema"
                    theme={theme}
                    value={selectedTopic?.id ?? topicsByOwner[0]?.id}
                    options={topicsByOwner.map((topic) => ({ label: topic.title, value: topic.id }))}
                    onChange={(topicId) => {
                        const topic = topicsByOwner.find((t) => t.id === topicId)
                        if (topic) {
                            setSelectedTopicId?.(topic.id)
                            setSelectedTopic?.(topic)
                        }
                    }}
                />
            )}

            {hasTopic && (
                <>
                    <View>
                        <Text style={[styles.label, { color: Colors[theme].textSecondary }]}>Título del post</Text>
                        <TextInput
                            style={[styles.input, {
                                color: Colors[theme].text,
                                backgroundColor: Colors[theme].input,
                                borderColor: Colors[theme].border,
                            }]}
                            placeholder="Ej. Ejercicios de la semana 3"
                            placeholderTextColor={Colors[theme].textSecondary}
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>

                    <View>
                        <Text style={[styles.label, { color: Colors[theme].textSecondary }]}>Contenido</Text>
                        <TextInput
                            style={[styles.textarea, {
                                color: Colors[theme].text,
                                backgroundColor: Colors[theme].input,
                                borderColor: Colors[theme].border,
                            }]}
                            placeholder="Escribe aquí el contenido que verán tus estudiantes"
                            placeholderTextColor={Colors[theme].textSecondary}
                            value={content}
                            onChangeText={setContent}
                            multiline
                            numberOfLines={6}
                        />
                    </View>

                    <View>
                        <Text style={[styles.label, { color: Colors[theme].textSecondary }]}>Archivo adjunto (opcional)</Text>
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
                                <Feather name="file-plus" color={Colors[theme].textSecondary} size={16} stroke={1}/>
                                <Text style={[{color: Colors[theme].textSecondary}]}>Adjuntar un archivo</Text>
                            </TouchableOpacity>
                        )}
                    </View>
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
        gap: Spacing.base,
    },
    label: {
        ...Typography.label,
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
    lockedTopic: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        minHeight: 52,
        borderRadius: Radius.md,
        borderWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: Spacing.base,
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
