import { TextInput, Text, View, StyleSheet, useColorScheme, Alert } from 'react-native'
import { Colors } from '@/constants/Colors'
import { Radius, Spacing, Typography } from '@/constants/Theme'
import { API_URL } from '@/constants/config'
import { User } from '@/lib/interfaces'

interface NewTopicFormProps {
    title: string
    setTitle: (text: string) => void
    description: string
    setDescription: (text: string) => void
}

export default function NewTopicForm({ title, setTitle, description, setDescription }: NewTopicFormProps) {
    const theme = useColorScheme() === 'light' ? 'light' : 'dark'

    return (
        <View style={styles.form}>
            <View>
                <Text style={[styles.label, { color: Colors[theme].textSecondary }]}>Título del tema</Text>
                <TextInput
                    style={[styles.input, {
                        color: Colors[theme].text,
                        backgroundColor: Colors[theme].input,
                        borderColor: Colors[theme].border,
                    }]}
                    placeholder="Ej. Matemáticas II"
                    placeholderTextColor={Colors[theme].textSecondary}
                    value={title}
                    onChangeText={setTitle}
                />
            </View>

            <View>
                <Text style={[styles.label, { color: Colors[theme].textSecondary }]}>Descripción</Text>
                <TextInput
                    style={[styles.textarea, {
                        color: Colors[theme].text,
                        backgroundColor: Colors[theme].input,
                        borderColor: Colors[theme].border,
                    }]}
                    placeholder="De qué trata este tema, para que tus estudiantes sepan qué esperar"
                    placeholderTextColor={Colors[theme].textSecondary}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                />
            </View>

            <Text style={[styles.hint, { color: Colors[theme].textSecondary }]}>
                Al crear el tema podrás compartir su código con tus estudiantes para que se inscriban.
            </Text>
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
    hint: {
        ...Typography.small,
    },
})
