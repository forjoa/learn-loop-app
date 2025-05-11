import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    ColorSchemeName,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { Colors } from '@/constants/Colors'
import BottomSheet from '@/components/ui/bottom-sheet'
import { useAuth } from '@/hooks/useAuth'
import * as SecureStore from 'expo-secure-store'
import { API_URL } from '@/constants/config'
import { Topic } from '@/lib/interfaces'
import * as DocumentPicker from 'expo-document-picker'
import NewTopicForm, { createTopic } from '@/components/forms/new-topic-form'
import NewPostForm, { createPost } from '@/components/forms/new-post-form'
import NewEnrollmentForm, { requestEnrollment } from '@/components/forms/new-enrollment-form'

type NewBottomSheetProps = {
    isVisible: boolean
    onClose: () => void
    colorScheme?: ColorSchemeName
}

export default function NewContent({
                                       isVisible,
                                       onClose,
                                       colorScheme = 'dark',
                                   }: NewBottomSheetProps) {
    const theme = colorScheme || 'dark'
    const {user} = useAuth()

    const [formType, setFormType] = useState<'topic' | 'post' | 'enrollment'>('enrollment')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [topicsByOwner, setTopicsByOwner] = useState<Topic[]>([])
    const [topicId, setTopicId] = useState('')
    const [token, setToken] = useState('')
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null)
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
    const [loadingTopics, setLoadingTopics] = useState(false)
    const [selectedDocument, setSelectedDocument] = useState<DocumentPicker.DocumentPickerAsset | null>(null)

    const isTeacher = user?.role === 'TEACHER'

    useEffect(() => {
        const loadToken = async () => {
            const t = await SecureStore.getItemAsync('authToken')
            setToken(t!)
        }

        loadToken()
    }, [])

    useEffect(() => {
        if (isVisible && formType === 'post' && isTeacher) {
            fetchTopicsByOwner()
        }
    }, [isVisible, formType])

    const fetchTopicsByOwner = async () => {
        try {
            setLoadingTopics(true)
            const response = await fetch(`${API_URL}/topics/getAllByOwner?ownerId=${user?.id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            })
            const data = await response.json()
            setTopicsByOwner(data)
            if (data.length > 0) {
                setSelectedTopicId(data[0].id)
            }
        } catch (error) {
            console.error('Error fetching topics:', error)
            Alert.alert('Error', 'No se pudieron cargar los temas disponibles')
        } finally {
            setLoadingTopics(false)
        }
    }

    const pickDocuments = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                multiple: false,
            })

            if (!result.canceled) {
                const successResult = result as DocumentPicker.DocumentPickerSuccessResult

                setSelectedDocument(successResult.assets[0])
            } else {
                console.log('Document selection cancelled.')
            }
        } catch (error) {
            console.log('Error picking documents:', error)
        }
    }

    const resetForm = () => {
        setTitle('')
        setDescription('')
        setContent('')
        setTopicId('')
        setSelectedTopicId(topicsByOwner.length > 0 ? topicsByOwner[0].id : null)
    }

    const handleSubmit = () => {
        if (formType === 'topic') {
            createTopic(
                title,
                description,
                setLoading,
                token,
                resetForm,
                onClose,
                user!
            )
        } else if (formType === 'post') {
            createPost(
                title,
                content,
                selectedTopicId!,
                setLoading,
                selectedDocument!,
                token,
                resetForm,
                onClose,
                user!
            )
        } else if (formType === 'enrollment') {
            requestEnrollment(
                topicId,
                setLoading,
                token,
                resetForm,
                onClose,
                user!
            )
        }
    }

    const renderTeacherTabs = () => (
        <View style={styles.tabs}>
            <TouchableOpacity
                style={[
                    styles.tab,
                    formType === 'topic' && {borderBottomColor: Colors[theme].primary, borderBottomWidth: 2}
                ]}
                onPress={() => setFormType('topic')}
            >
                <Text
                    style={[styles.tabText, {color: formType === 'topic' ? Colors[theme].primary : Colors[theme].text}]}>
                    Nuevo Tema
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.tab,
                    formType === 'post' && {borderBottomColor: Colors[theme].primary, borderBottomWidth: 2}
                ]}
                onPress={() => {
                    setFormType('post')
                    fetchTopicsByOwner()
                }}
            >
                <Text
                    style={[styles.tabText, {color: formType === 'post' ? Colors[theme].primary : Colors[theme].text}]}>
                    Nuevo Post
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.tab,
                    formType === 'enrollment' && {borderBottomColor: Colors[theme].primary, borderBottomWidth: 2}
                ]}
                onPress={() => setFormType('enrollment')}
            >
                <Text
                    style={[styles.tabText, {color: formType === 'enrollment' ? Colors[theme].primary : Colors[theme].text}]}>
                    Ingresar a un tema
                </Text>
            </TouchableOpacity>
        </View>
    )

    const renderForm = () => {
        if (formType === 'topic') {
            return (
                <NewTopicForm
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                />
            )
        } else if (formType === 'post') {
            return (
                <NewPostForm
                    loadingTopics={loadingTopics}
                    topicsByOwner={topicsByOwner}
                    selectedTopic={selectedTopic}
                    setSelectedTopic={setSelectedTopic}
                    setSelectedTopicId={setSelectedTopicId}
                    setTitle={setTitle}
                    setContent={setContent}
                    title={title}
                    content={content}
                    pickDocuments={pickDocuments}
                    selectedDocument={selectedDocument!}
                    setSelectedDocument={setSelectedDocument}
                />
            )
        } else {
            return (
                <NewEnrollmentForm
                    topicId={topicId}
                    setTopicId={setTopicId}
                />
            )
        }
    }

    return (
        <BottomSheet isVisible={isVisible} onClose={onClose} colorScheme={colorScheme}>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                <Text
                    style={[
                        styles.title,
                        {color: Colors[theme].text}
                    ]}
                >
                    {isTeacher ? 'Agregar contenido' : 'Inscribirse a un tema'}
                </Text>

                {isTeacher ? (
                    <>
                        {renderTeacherTabs()}
                        {renderForm()}
                    </>
                ) : (
                    <NewEnrollmentForm
                        topicId={topicId}
                        setTopicId={setTopicId}
                    />
                )}

                <TouchableOpacity
                    style={[
                        styles.button,
                        {
                            backgroundColor: Colors[theme].primary,
                            borderColor: Colors[theme].primaryBorder
                        },
                        (loadingTopics || loading) && {opacity: 0.7}
                    ]}
                    onPress={handleSubmit}
                    disabled={loadingTopics || loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#FFFFFF"/>
                    ) : (
                        <Text style={styles.buttonText}>
                            {isTeacher
                                ? formType === 'topic'
                                    ? 'Crear Tema'
                                    : formType === 'enrollment' ? 'Solicitar' : 'Crear Post'
                                : 'Enviar Solicitud'}
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </BottomSheet>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    tabs: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
    },
    tabText: {
        fontWeight: '500',
    },
    button: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        borderRadius: 10,
        borderTopWidth: 2,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
})