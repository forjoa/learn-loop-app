import { Alert, Image, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'
import Main from '@/components/ui/main'
import { Colors } from '@/constants/Colors'
import { useAuth } from '@/hooks/useAuth'
import { profileImages } from '@/assets/profile-images'
import SelectDropdown from 'react-native-select-dropdown'
import { MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import Feather from '@expo/vector-icons/Feather'
import React, { useState, useEffect } from 'react'
import SelectEditPhoto from '@/components/select-edit-photo'
import { API_URL } from '@/constants/config'
import * as SecureStore from 'expo-secure-store'

const roles = [
    {label: 'Estudiante', value: 'STUDENT'},
    {label: 'Profesor', value: 'TEACHER'},
]

export default function ProfileScreen() {
    const [isSelectEditPhotoVisible, setIsSelectEditPhotoVisible] = useState(false)
    const [profilePhoto, setProfilePhoto] = useState<string>()
    const [role, setRole] = useState<string>()
    const [token, setToken] = useState('')
    const colorScheme = useColorScheme() || 'dark'
    const {user, logout} = useAuth()

    const loadProfileData = async () => {
        if (!user) return

        const t = await SecureStore.getItemAsync('authToken')
        setToken(t!)
        setProfilePhoto(user.photo)
        setRole(user.role)
    }

    useEffect(() => {
        loadProfileData()
    }, [user])

    const handleEditSubmit = async () => {
        try {
            const response = await fetch(`${API_URL}/users/edit`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    photo: profilePhoto,
                    role,
                    id: user?.id,
                    name: user?.name,
                    email: user?.email,
                }),
            })
            const result = await response.json()

            if (result.data) {
                Alert.alert('Usuario actualizado', 'Los cambios se han guardado correctamente')
            } else {
                Alert.alert('Error al actualizar', 'Hubo un problema al actualizar el usuario')
            }
        } catch (e) {
            Alert.alert('Error', 'Hubo un problema al conectar con el servidor')
        }
    }

    return (
        <>
            <Main onLoad={loadProfileData}>
                <View style={styles.container}>
                    <View style={styles.imageWrapper}>
                        <Image
                            source={profileImages[profilePhoto as unknown as string]}
                            style={styles.image}
                        />
                        <Pressable
                            style={[
                                styles.newButton,
                                {
                                    backgroundColor: Colors[colorScheme].newButton.background,
                                    borderColor: Colors[colorScheme].newButton.border,
                                },
                            ]}
                            onPress={() => setIsSelectEditPhotoVisible(true)}
                        >
                            <Feather name="edit" size={20} color="#fff"/>
                        </Pressable>
                    </View>

                    <Text style={[styles.name, {color: Colors[colorScheme].text}]}>
                        {user?.name}
                    </Text>

                    <SelectDropdown
                        data={roles}
                        defaultValue={
                            user?.role === 'TEACHER' ? roles[1] : roles[0]
                        }
                        onSelect={(selectedItem) => setRole(selectedItem.value)}
                        renderButton={(selectedItem, isOpened) => (
                            <View
                                style={[
                                    styles.dropdownButton,
                                    {
                                        backgroundColor: Colors[colorScheme].input,
                                        borderColor: Colors[colorScheme].border,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.dropdownButtonText,
                                        {color: Colors[colorScheme].text},
                                    ]}
                                >
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
                            <View
                                style={[
                                    styles.dropdownItem,
                                    isSelected && {
                                        backgroundColor: Colors[colorScheme].primary,
                                    },
                                    {backgroundColor: Colors[colorScheme].input},
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.dropdownItemText,
                                        {color: Colors[colorScheme].text},
                                    ]}
                                >
                                    {item.label}
                                </Text>
                            </View>
                        )}
                        dropdownStyle={[
                            styles.dropdown,
                            {
                                backgroundColor: Colors[colorScheme].input,
                                borderColor: Colors[colorScheme].border,
                            },
                        ]}
                    />

                    <View style={styles.sendContainer}>
                        <Pressable
                            style={[
                                styles.primary,
                                {
                                    backgroundColor: Colors[colorScheme].error,
                                    borderColor: Colors[colorScheme].errorBorder,
                                },
                            ]}
                            onPress={() => {
                                logout()
                                router.navigate('/(auth)')
                            }}
                        >
                            <Text style={[styles.textPrimary, {color: '#fff'}]}>
                                Cerrar sesión
                            </Text>
                        </Pressable>
                        <Pressable
                            style={[
                                styles.primary,
                                {
                                    backgroundColor: Colors[colorScheme].primary,
                                    borderColor: Colors[colorScheme].primaryBorder,
                                },
                            ]}
                            onPress={() => handleEditSubmit()}
                        >
                            <Text style={[styles.textPrimary, {color: '#fff'}]}>
                                Guardar cambios
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Main>

            <SelectEditPhoto
                isVisible={isSelectEditPhotoVisible}
                onClose={() => setIsSelectEditPhotoVisible(false)}
                colorScheme={colorScheme}
                setProfilePhoto={setProfilePhoto}
                currentPhoto={profilePhoto}
                photos={profileImages}
            />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    imageWrapper: {
        position: 'relative',
        marginBottom: 20,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
        zIndex: 1,
    },
    newButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: -5,
        right: -5,
        zIndex: 10,
        elevation: 10,
        borderWidth: 1,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 300,
        height: 50,
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 15,
    },
    dropdownButtonText: {
        flex: 1,
    },
    dropdown: {
        borderRadius: 10,
        borderWidth: 1,
        marginTop: 5,
    },
    dropdownItem: {
        padding: 15,
        height: 50,
        justifyContent: 'center',
        backdropFilter: 'blur(10px)',
    },
    dropdownItemText: {},
    primary: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        marginBottom: 5,
        borderTopWidth: 2,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
    },
    textPrimary: {},
    sendContainer: {
        marginTop: 20,
        width: 300,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
})
