import {
    StyleSheet,
    Text,
    View,
    TextInput,
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
import { MaterialIcons } from '@expo/vector-icons'
import SelectDropdown from 'react-native-select-dropdown'

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
    const [topicId, setTopicId] = useState('') // Para input directo del ID
    const [token, setToken] = useState('')
    const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null)
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
    const [loadingTopics, setLoadingTopics] = useState(false)

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

    const createTopic = async () => {
        if (!title || !description) {
            Alert.alert('Error', 'Por favor completa todos los campos')
            return
        }

        try {
            setLoading(true)
            await fetch(`${API_URL}/topics`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    description,
                    ownerId: user?.id
                })
            })
            Alert.alert('Éxito', 'Tema creado correctamente')
            resetForm()
            onClose()
        } catch (error) {
            console.error('Error creating topic:', error)
            Alert.alert('Error', 'No se pudo crear el tema')
        } finally {
            setLoading(false)
        }
    }

    const createPost = async () => {
        if (!title || !content || !selectedTopicId) {
            Alert.alert('Error', 'Por favor completa todos los campos')
            return
        }

        try {
            setLoading(true)

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
                        topicId: selectedTopicId
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

    const requestEnrollment = async () => {
        if (!topicId) {
            Alert.alert('Error', 'Por favor ingresa el ID del tema')
            return
        }

        try {
            setLoading(true)
            await fetch(`${API_URL}/enrollments/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: user?.id,
                    topicId: parseInt(topicId),
                })
            })
            Alert.alert('Éxito', 'Solicitud de inscripción enviada correctamente')
            resetForm()
            onClose()
        } catch (error) {
            console.error('Error requesting enrollment:', error)
            Alert.alert('Error', 'No se pudo enviar la solicitud de inscripción')
        } finally {
            setLoading(false)
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
        console.log(formType)
        if (formType === 'topic') {
            createTopic()
        } else if (formType === 'post') {
            createPost()
        } else if (formType === 'enrollment') {
            requestEnrollment()
        }
    }

    const renderTopicForm = () => (
        <View style={styles.form}>
            <TextInput
                style={[styles.input, {color: Colors[theme].text, borderColor: Colors[theme].border}]}
                placeholder="Título del tema"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={[styles.textarea, {color: Colors[theme].text, borderColor: Colors[theme].border}]}
                placeholder="Descripción del tema"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
            />
        </View>
    )

    const renderPostForm = () => (
        <View style={styles.form}>
            {loadingTopics ? (
                <ActivityIndicator size="small" color={Colors[theme].primary}/>
            ) : topicsByOwner.length === 0 ? (
                <Text style={{color: Colors[theme].text}}>No hay temas disponibles</Text>
            ) : (
                <>
                    <Text style={[styles.label, {color: Colors[theme].text}]}>Selecciona un tema:</Text>
                    <View>
                        <SelectDropdown
                            data={topicsByOwner}
                            defaultValue={selectedTopic}
                            onSelect={(selectedItem) => {
                                setSelectedTopicId(selectedItem.id)
                                setSelectedTopic(selectedItem)
                            }}
                            renderButton={(selectedItem, isOpened) => (
                                <View style={[
                                    styles.dropdownButton,
                                    {
                                        backgroundColor: Colors[theme].input || 'transparent',
                                        borderColor: Colors[theme].border
                                    }
                                ]}>
                                    <Text style={[
                                        styles.dropdownButtonText,
                                        {
                                            color: Colors[theme].text,
                                        }
                                    ]}>
                                        {selectedItem?.title || 'Seleccionar tema'}
                                    </Text>
                                    <MaterialIcons
                                        name={isOpened ? 'arrow-drop-up' : 'arrow-drop-down'}
                                        size={24}
                                        color={Colors[theme].text}
                                    />
                                </View>
                            )}
                            renderItem={(item, index, isSelected) => (
                                <View style={[
                                    styles.dropdownItem,
                                    isSelected && {
                                        backgroundColor: Colors[theme].primary + '20'
                                    },
                                    {
                                        backgroundColor: Colors[theme].input || 'transparent',
                                    }
                                ]}>
                                    <Text style={[
                                        styles.dropdownItemText,
                                        {
                                            color: Colors[theme].text,
                                        }
                                    ]}>
                                        {item.title}
                                    </Text>
                                </View>
                            )}
                            dropdownStyle={[
                                styles.dropdown,
                                {
                                    backgroundColor: Colors[theme].input || 'transparent',
                                    borderColor: Colors[theme].border,
                                    marginTop: 5
                                }
                            ]}
                        />
                    </View>
                    <TextInput
                        style={[styles.input, {color: Colors[theme].text, borderColor: Colors[theme].border}]}
                        placeholder="Título del post"
                        value={title}
                        onChangeText={setTitle}
                    />
                    <TextInput
                        style={[styles.textarea, {color: Colors[theme].text, borderColor: Colors[theme].border}]}
                        placeholder="Contenido del post"
                        value={content}
                        onChangeText={setContent}
                        multiline
                        numberOfLines={6}
                    />
                </>
            )}
        </View>
    )

    const renderEnrollmentForm = () => (
        <View style={styles.form}>
            <Text style={[styles.label, {color: Colors[theme].text}]}>
                Ingresa el ID del tema para inscribirte:
            </Text>
            <TextInput
                style={[styles.input, {color: Colors[theme].text, borderColor: Colors[theme].border}]}
                placeholder="ID del tema"
                value={topicId}
                onChangeText={setTopicId}
                keyboardType="numeric"
            />
            <Text style={[styles.enrollmentHelp, {color: Colors[theme].textSecondary || Colors[theme].text}]}>
                Ingresa solamente el número ID del tema compartido por tu profesor.
            </Text>
        </View>
    )

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
                        {formType === 'topic' ? renderTopicForm() : formType === 'post' ? renderPostForm() : renderEnrollmentForm()}
                    </>
                ) : (
                    renderEnrollmentForm()
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
                                    : 'Crear Post'
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
    form: {
        marginBottom: 20,
    },
    label: {
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    textarea: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        textAlignVertical: 'top',
    },
    pickerContainer: {
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
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
    enrollmentHelp: {
        fontSize: 12,
        marginTop: -12,
        marginBottom: 16,
    },
    topicDetails: {
        padding: 10,
        marginBottom: 16,
    },
    topicTitle: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    topicDescription: {},
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 15,
        marginBottom: 16,
    },
    dropdownButtonText: {
        flex: 1,
    },
    dropdown: {
        borderRadius: 8,
        borderWidth: 1,
    },
    dropdownItem: {
        padding: 15,
        height: 50,
        justifyContent: 'center',
    },
    dropdownItemText: {},
})