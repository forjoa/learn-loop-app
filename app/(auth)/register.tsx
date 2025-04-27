import { useState } from 'react'
import {
    Image,
    StyleSheet,
    Text,
    View,
    Pressable,
    ScrollView,
    TextInput,
    useColorScheme,
    Alert,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Href, router } from 'expo-router'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { Colors } from '@/constants/Colors'
import { profileImages } from '@/assets/profile-images'
import { useAuth } from '@/hooks/useAuth'

export default function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('STUDENT')
    const [profileImage, setProfileImage] = useState('ant.png')
    const [registering, setRegistering] = useState(false)
    const colorScheme = useColorScheme() || 'dark'
    const { register, error } = useAuth()

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Por favor completa todos los campos requeridos')
            return
        }

        setRegistering(true)
        try {
            const result = await register(name, email, password, role, profileImage)

            if (result.success) {
                // Registro exitoso, redirigir al login
                router.push('/(auth)')
            } else {
                // Mostrar error
                Alert.alert('Error', result.error || 'Hubo un problema al registrarse')
            }
        } catch (err) {
            Alert.alert('Error', 'Hubo un problema al conectar con el servidor')
            console.error(err)
        } finally {
            setRegistering(false)
        }
    }

    const goTo = (route: Href) => {
        router.push(route)
    }

    return (
        <SafeAreaView style={styles.page}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    style={[
                        styles.container,
                        {backgroundColor: Colors[colorScheme].card}
                    ]}
                    contentContainerStyle={{flexGrow: 1}}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.image}
                            source={profileImages[profileImage] ?? require('@/assets/images/droid.png')}
                        />
                    </View>
                    <Text style={[
                        styles.title,
                        {color: Colors[colorScheme].text}
                    ]}>Registro</Text>
                    <Text style={[
                        styles.span,
                        {color: Colors[colorScheme].textSecondary}
                    ]}>
                        Crea una cuenta para comenzar a aprender o enseñar
                    </Text>

                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: Colors[colorScheme].input,
                                color: Colors[colorScheme].text
                            }
                        ]}
                        placeholder="Nombre"
                        placeholderTextColor={Colors[colorScheme].textSecondary}
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: Colors[colorScheme].input,
                                color: Colors[colorScheme].text
                            }
                        ]}
                        placeholder="Email"
                        placeholderTextColor={Colors[colorScheme].textSecondary}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />

                    {/* Campo de contraseña */}
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: Colors[colorScheme].input,
                                color: Colors[colorScheme].text
                            }
                        ]}
                        placeholder="****"
                        placeholderTextColor={Colors[colorScheme].textSecondary}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    {/* Selector de rol */}
                    <Picker
                        selectedValue={role}
                        onValueChange={(itemValue: string) => setRole(itemValue)}
                        style={[
                            styles.picker,
                            {
                                backgroundColor: Colors[colorScheme].input,
                                color: Colors[colorScheme].text
                            }
                        ]}
                        itemStyle={styles.pickerItem}
                        mode="dropdown"
                    >
                        <Picker.Item
                            label="Estudiante"
                            value="STUDENT"
                            color={colorScheme === 'dark' ? '#fff' : '#000'}
                        />
                        <Picker.Item
                            label="Profesor"
                            value="TEACHER"
                            color={colorScheme === 'dark' ? '#fff' : '#000'}
                        />
                    </Picker>

                    {/* Selección de imagen de perfil */}
                    <Text style={[
                        styles.sectionTitle,
                        {color: Colors[colorScheme].text}
                    ]}>Selecciona tu foto de perfil</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.profileScroll}
                    >
                        {Object.keys(profileImages).map((image) => (
                            <Pressable
                                key={image}
                                onPress={() => setProfileImage(image)}
                                style={[
                                    styles.profileOption,
                                    profileImage === image && [
                                        styles.profileSelected,
                                        {borderColor: Colors[colorScheme].primary}
                                    ],
                                ]}
                            >
                                <Image
                                    source={profileImages[image]} // Usas directamente la referencia de `profileImages`
                                    style={styles.profileImage}
                                />
                            </Pressable>
                        ))}
                    </ScrollView>

                    {/* Botón de registro */}
                    <Pressable
                        style={[
                            styles.primary,
                            {
                                backgroundColor: Colors[colorScheme].primary,
                                borderColor: Colors[colorScheme].primaryBorder,
                                opacity: registering ? 0.7 : 1
                            }
                        ]}
                        onPress={handleRegister}
                        disabled={registering}
                    >
                        <Text style={[
                            styles.textPrimary,
                            {color: '#fff'}
                        ]}>{registering ? 'Registrando...' : 'Registrarse'}</Text>
                    </Pressable>

                    <View style={[
                        styles.hr,
                        {backgroundColor: Colors[colorScheme].border}
                    ]}/>

                    {/* Enlace para ir al login */}
                    <Pressable
                        style={[
                            styles.secondary,
                            {
                                backgroundColor: Colors[colorScheme].secondary.background,
                                borderColor: Colors[colorScheme].secondary.border
                            }
                        ]}
                        onPress={() => goTo('/(auth)')}
                    >
                        <Text style={[
                            styles.textSecondary,
                            {color: Colors[colorScheme].secondary.text}
                        ]}>Inicia sesión</Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    container: {
        width: '90%',
        marginVertical: 20,
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    imageContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    span: {
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        paddingHorizontal: 12,
        paddingVertical: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    picker: {
        borderRadius: 10,
        marginBottom: 15,
    },
    pickerItem: {
        fontSize: 12,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 10,
    },
    profileScroll: {
        marginBottom: 20,
    },
    profileOption: {
        marginRight: 10,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    profileSelected: {},
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    primary: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 10,
        marginBottom: 5,
        borderTopWidth: 2,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
    },
    textPrimary: {},
    hr: {
        height: 1,
        marginVertical: 20,
    },
    secondary: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 10,
        borderTopWidth: 2,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        marginBottom: 25,
    },
    textSecondary: {},
})
