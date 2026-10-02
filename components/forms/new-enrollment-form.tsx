import { Alert, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native'
import Feather from '@expo/vector-icons/Feather'
import { Colors } from '@/constants/Colors'
import { Radius, Spacing, Typography } from '@/constants/Theme'
import { API_URL } from '@/constants/config'
import { User } from '@/lib/interfaces'

interface NewEnrollmentFormProps {
    topicId: string
    setTopicId: (text: string) => void
}

export default function NewEnrollmentForm({topicId, setTopicId}: NewEnrollmentFormProps) {
    const theme = useColorScheme() === 'light' ? 'light' : 'dark'

    return (
        <View style={styles.form}>
            <Text style={[styles.label, {color: Colors[theme].textSecondary}]}>
                Código del tema
            </Text>
            <View style={[styles.inputWrapper, {
                backgroundColor: Colors[theme].input,
                borderColor: Colors[theme].border,
            }]}>
                <Feather name="hash" size={18} color={Colors[theme].textSecondary} />
                <TextInput
                    style={[styles.input, {color: Colors[theme].text}]}
                    placeholder="Pégalo aquí"
                    placeholderTextColor={Colors[theme].textSecondary}
                    value={topicId}
                    onChangeText={setTopicId}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>
            <Text style={[styles.hint, {color: Colors[theme].textSecondary}]}>
                Pídele a tu profesor el código del tema y pégalo aquí para enviar tu solicitud de inscripción.
            </Text>
        </View>
    )
}

export const requestEnrollment = async (topicId: string, setLoading: (loading: boolean) => void, token: string, resetForm: () => void, onClose: () => void, user: User) => {
    if (!topicId) {
        Alert.alert('Error', 'Por favor ingresa el código del tema')
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
                topicId: topicId,
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

const styles = StyleSheet.create({
    form: {
        marginBottom: Spacing.lg,
    },
    label: {
        ...Typography.label,
        marginBottom: Spacing.sm,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: Radius.md,
        paddingHorizontal: Spacing.base,
    },
    input: {
        ...Typography.body,
        flex: 1,
        paddingVertical: Spacing.base,
    },
    hint: {
        ...Typography.small,
        marginTop: Spacing.sm,
    },
})
