import { Alert, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native'
import { Colors } from '@/constants/Colors'
import { API_URL } from '@/constants/config'
import { User } from '@/lib/interfaces'

interface NewEnrollmentFormProps {
    topicId: string
    setTopicId: (text: string) => void
}

export default function NewEnrollmentForm({topicId, setTopicId}: NewEnrollmentFormProps) {
    const theme = useColorScheme() || 'dark'

    return (
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
}

export const requestEnrollment = async (topicId: string, setLoading: (loading: boolean) => void, token: string, resetForm: () => void, onClose: () => void, user: User) => {
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
    selectFile: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 5,
        height: 50,
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 15,
    }
})