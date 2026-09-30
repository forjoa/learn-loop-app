import {
    StyleSheet,
    Text,
    View,
    Pressable,
    ScrollView,
    ActivityIndicator,
    Alert,
    ColorSchemeName,
    LayoutChangeEvent,
} from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { Colors } from '@/constants/Colors'
import { Motion, Radius, Spacing, Typography } from '@/constants/Theme'
import { GlassSurface } from '@/components/ui/glass-view'
import { Button } from '@/components/ui/button'
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

type FormType = 'topic' | 'post' | 'enrollment'

export default function NewContent({
                                       isVisible,
                                       onClose,
                                       colorScheme = 'dark',
                                   }: NewBottomSheetProps) {
    const theme = colorScheme === 'light' ? 'light' : 'dark'
    const {user} = useAuth()

    const [formType, setFormType] = useState<FormType>('enrollment')
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

    const tabLayouts = useRef<Record<FormType, { x: number, width: number }>>({} as any)
    const indicatorX = useSharedValue(0)
    const indicatorWidth = useSharedValue(0)

    const indicatorStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: indicatorX.value }],
        width: indicatorWidth.value,
    }))

    const moveIndicatorTo = (type: FormType) => {
        const layout = tabLayouts.current[type]
        if (layout) {
            indicatorX.value = withSpring(layout.x, Motion.springSoft)
            indicatorWidth.value = withSpring(layout.width, Motion.springSoft)
        }
    }

    const onTabLayout = (type: FormType) => (e: LayoutChangeEvent) => {
        const { x, width } = e.nativeEvent.layout
        tabLayouts.current[type] = { x, width }
        if (type === formType) {
            indicatorX.value = x
            indicatorWidth.value = width
        }
    }

    useEffect(() => {
        const loadToken = async () => {
            const t = await SecureStore.getItemAsync('authToken')
            setToken(t!)
        }

        loadToken()
    }, [])

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

    useEffect(() => {
        if (isVisible && formType === 'post' && isTeacher) {
            fetchTopicsByOwner()
        }
    }, [isVisible, formType])

    const pickDocuments = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                multiple: false,
            })

            if (!result.canceled) {
                const successResult = result as DocumentPicker.DocumentPickerSuccessResult

                setSelectedDocument(successResult.assets[0])
            }
        } catch (error) {
            console.error('Error picking documents:', error)
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

    const renderTab = (type: FormType, label: string) => (
        <Pressable
            style={styles.tab}
            onLayout={onTabLayout(type)}
            onPress={() => {
                setFormType(type)
                moveIndicatorTo(type)
                if (type === 'post') fetchTopicsByOwner()
            }}
        >
            <Text
                style={[styles.tabText, {color: formType === type ? '#fff' : Colors[theme].textSecondary}]}>
                {label}
            </Text>
        </Pressable>
    )

    const renderTeacherTabs = () => (
        <View style={[styles.tabsRow, { backgroundColor: Colors[theme].input }]}>
            <Animated.View style={[styles.indicator, indicatorStyle, { backgroundColor: Colors[theme].primary }]} />
            {renderTab('topic', 'Nuevo tema')}
            {renderTab('post', 'Nuevo post')}
            {renderTab('enrollment', 'Ingresar')}
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

                <Button
                    label={
                        isTeacher
                            ? formType === 'topic'
                                ? 'Crear tema'
                                : formType === 'enrollment' ? 'Solicitar' : 'Crear post'
                            : 'Enviar solicitud'
                    }
                    onPress={handleSubmit}
                    loading={loading}
                    disabled={loadingTopics}
                    style={{ marginTop: Spacing.md }}
                />
            </ScrollView>
        </BottomSheet>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: Spacing.lg,
    },
    title: {
        ...Typography.title,
        marginBottom: Spacing.lg,
    },
    tabsRow: {
        flexDirection: 'row',
        marginBottom: Spacing.lg,
        borderRadius: Radius.pill,
        padding: 4,
        position: 'relative',
    },
    indicator: {
        position: 'absolute',
        top: 4,
        bottom: 4,
        left: 0,
        borderRadius: Radius.pill,
    },
    tab: {
        flex: 1,
        paddingVertical: Spacing.sm,
        alignItems: 'center',
        zIndex: 1,
    },
    tabText: {
        ...Typography.small,
        fontWeight: '600',
    },
})
