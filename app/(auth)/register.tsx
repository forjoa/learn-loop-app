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
import { SafeAreaView } from 'react-native-safe-area-context'
import { Href, router } from 'expo-router'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { Colors } from '@/constants/Colors'
import { profileImages } from '@/assets/profile-images'
import { useAuth } from '@/hooks/useAuth'
import { MaterialIcons } from '@expo/vector-icons'
import SelectDropdown from 'react-native-select-dropdown'

const roles = [
    {label: 'Estudiante', value: 'STUDENT'},
    {label: 'Profesor', value: 'TEACHER'}
]

export default function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('STUDENT')
    const [profileImage, setProfileImage] = useState('ant.png')
    const [registering, setRegistering] = useState(false)
    const colorScheme = useColorScheme() || 'dark'
    const {register, error} = useAuth()

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Por favor completa todos los campos requeridos')
            return
        }

        setRegistering(true)
        try {
            const result = await register(name, email, password, role, profileImage)

            if (result.success) {
                router.push('/(auth)')
            } else {
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

                    <SelectDropdown
                        data={roles}
                        onSelect={(selectedItem) => setRole(selectedItem.value)}
                        renderButton={(selectedItem, isOpened) => (
                            <View style={[
                                styles.dropdownButton,
                                {
                                    backgroundColor: Colors[colorScheme].input,
                                    borderColor: Colors[colorScheme].border
                                }
                            ]}>
                                <Text style={[
                                    styles.dropdownButtonText,
                                    {
                                        color: Colors[colorScheme].text,
                                        // fontSize: 16
                                    }
                                ]}>
                                    {selectedItem?.label || 'Seleccionar rol'}
                                </Text>
                                <MaterialIcons
                                    name={isOpened ? 'arrow-drop-up' : 'arrow-drop-down'}
                                    size={24}
                                    color={Colors[colorScheme].text}
                                />
                            </View>
                        )}
                        renderItem={(item, index, isSelected) => (
                            <View style={[
                                styles.dropdownItem,
                                isSelected && {
                                    backgroundColor: Colors[colorScheme].primary + '20'
                                },
                                {
                                    backgroundColor: Colors[colorScheme].input,
                                    backdropFilter: 'blur(10px)'
                                }
                            ]}>
                                <Text style={[
                                    styles.dropdownItemText,
                                    {
                                        color: Colors[colorScheme].text,
                                        // fontSize: 16
                                    }
                                ]}>
                                    {item.label}
                                </Text>
                            </View>
                        )}
                        dropdownStyle={[
                            styles.dropdown,
                            {
                                backgroundColor: Colors[colorScheme].input,
                                borderColor: Colors[colorScheme].border,
                                marginTop: 5
                            }
                        ]}
                    />

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
                                        {borderColor: Colors[colorScheme].primary}
                                    ],
                                ]}
                            >
                                <Image
                                    source={profileImages[image]}
                                    style={styles.profileImage}
                                />
                            </Pressable>
                        ))}
                    </ScrollView>

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
    sectionTitle: {
        fontWeight: 'bold',
        marginVertical: 10,
    },
    profileScroll: {
        // marginBottom: 20,
    },
    profileOption: {
        marginRight: 10,
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 2,
        borderColor: 'transparent',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
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
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 300,
        height: 50,
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 15
    },
    dropdownButtonText: {
        flex: 1,
        // fontSize: 16
    },
    dropdown: {
        borderRadius: 10,
        borderWidth: 1,
        marginTop: 5
    },
    dropdownItem: {
        padding: 15,
        height: 50,
        justifyContent: 'center',
        backdropFilter: 'blur(10px)'
    },
    dropdownItemText: {
        // fontSize: 16
    }
})
