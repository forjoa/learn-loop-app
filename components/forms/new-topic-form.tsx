import { TextInput, View, StyleSheet, useColorScheme, Alert } from 'react-native'
import { Colors } from '@/constants/Colors'
import { API_URL } from '@/constants/config'
import { User } from '@/lib/interfaces'

interface NewTopicFormProps {
    title: string
    setTitle: (text: string) => void
    description: string
    setDescription: (text: string) => void
}

export default function NewTopicForm({ title, setTitle, description, setDescription }: NewTopicFormProps) {
    const theme = useColorScheme() || 'dark'

    return (
        <View style={styles.form}>
            <TextInput
                style={[styles.input,
                    {
                        color: Colors[theme].text, borderColor:
                        Colors[theme].border
                    }
                ]
                }
                placeholder="Título del tema"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={[styles.textarea,
                    {
                        color: Colors[theme].text, borderColor:
                        Colors[theme].border
                    }
                ]
                }
                placeholder="Descripción del tema"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
            />
        </View>
    )
}

export const createTopic = async (title: string, description: string, setLoading: (loading: boolean) => void, token: string, resetForm: () => void, onClose: () => void, user: User) => {
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

const styles = StyleSheet.create({
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
    }
})