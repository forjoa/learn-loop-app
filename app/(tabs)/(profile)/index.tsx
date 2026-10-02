import { Alert, Image, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming, Easing } from 'react-native-reanimated'
import Main from '@/components/ui/main'
import { Colors } from '@/constants/Colors'
import { Motion, Radius, Spacing, Typography } from '@/constants/Theme'
import { Button } from '@/components/ui/button'
import { GlassSurface } from '@/components/ui/glass-view'
import { useAuth } from '@/hooks/useAuth'
import { profileImages } from '@/assets/profile-images'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { router } from 'expo-router'
import Feather from '@expo/vector-icons/Feather'
import React, { useState, useEffect } from 'react'
import SelectEditPhoto from '@/components/select-edit-photo'
import { API_URL } from '@/constants/config'
import * as SecureStore from 'expo-secure-store'
import * as Haptics from 'expo-haptics'

const roles = [
    {label: 'Estudiante', value: 'STUDENT'},
    {label: 'Profesor', value: 'TEACHER'},
]

export default function ProfileScreen() {
    const [isSelectEditPhotoVisible, setIsSelectEditPhotoVisible] = useState(false)
    const [profilePhoto, setProfilePhoto] = useState<string>()
    const [role, setRole] = useState<string>()
    const [token, setToken] = useState('')
    const colorScheme = useColorScheme() === 'light' ? 'light' : 'dark'
    const {user, logout, updateUser} = useAuth()

    const entrance = useSharedValue(0)
    const editButtonScale = useSharedValue(1)

    useEffect(() => {
        entrance.value = withDelay(60, withTiming(1, { duration: Motion.durationSlow, easing: Easing.out(Easing.cubic) }))
    }, [])

    const entranceStyle = useAnimatedStyle(() => ({
        opacity: entrance.value,
        transform: [{ translateY: (1 - entrance.value) * 20 }],
    }))
    const editButtonStyle = useAnimatedStyle(() => ({ transform: [{ scale: editButtonScale.value }] }))

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

    const hasChanges = (role !== undefined && role !== user?.role) || (profilePhoto !== undefined && profilePhoto !== user?.photo)

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
                updateUser({ photo: profilePhoto, role })
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
                Alert.alert('Usuario actualizado', 'Los cambios se han guardado correctamente')
            } else {
                Alert.alert('Error al actualizar', 'Hubo un problema al actualizar el usuario')
            }
        } catch (e) {
            Alert.alert('Error', 'Hubo un problema al conectar con el servidor')
        }
    }

    const handleLogout = () => {
        Alert.alert('Cerrar sesión', '¿Seguro que quieres cerrar sesión?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Cerrar sesión',
                style: 'destructive',
                onPress: () => {
                    logout()
                    router.navigate('/(auth)')
                },
            },
        ])
    }

    return (
        <>
            <Main onLoad={loadProfileData}>
                <Animated.View style={[styles.container, entranceStyle]}>
                    <View style={styles.hero}>
                        <View style={styles.imageWrapper}>
                            <Image
                                source={profileImages[profilePhoto as unknown as string]}
                                style={styles.image}
                            />
                            <Animated.View style={editButtonStyle}>
                                <Pressable
                                    style={[
                                        styles.editButton,
                                        {
                                            backgroundColor: Colors[colorScheme].newButton.background,
                                            borderColor: Colors[colorScheme].background,
                                        },
                                    ]}
                                    onPressIn={() => { editButtonScale.value = withSpring(0.88, Motion.spring) }}
                                    onPressOut={() => { editButtonScale.value = withSpring(1, Motion.spring) }}
                                    onPress={() => setIsSelectEditPhotoVisible(true)}
                                >
                                    <Feather name="edit-2" size={14} color="#fff"/>
                                </Pressable>
                            </Animated.View>
                        </View>

                        <Text style={[styles.name, {color: Colors[colorScheme].text}]}>
                            {user?.name}
                        </Text>
                        <Text style={[styles.email, {color: Colors[colorScheme].textSecondary}]}>
                            {user?.email}
                        </Text>
                    </View>

                    <GlassSurface tint={colorScheme} radius={Radius.lg} style={styles.card}>
                        <Text style={[styles.cardTitle, {color: Colors[colorScheme].textSecondary}]}>
                            Tipo de cuenta
                        </Text>
                        {role && (
                            <SegmentedControl
                                options={roles}
                                value={role}
                                onChange={setRole}
                                tint={colorScheme}
                            />
                        )}
                        <Text style={[styles.cardHint, {color: Colors[colorScheme].textSecondary}]}>
                            Esto define qué puedes hacer en la app: un profesor puede crear temas y
                            publicar contenido, un estudiante solo puede inscribirse y verlo.
                        </Text>
                    </GlassSurface>

                    <View style={styles.actions}>
                        <Button
                            label={hasChanges ? 'Guardar cambios' : 'Guardado'}
                            onPress={handleEditSubmit}
                            disabled={!hasChanges}
                        />

                        <Pressable style={styles.logoutRow} onPress={handleLogout}>
                            <Feather name="log-out" size={18} color={Colors[colorScheme].error} />
                            <Text style={[styles.logoutText, {color: Colors[colorScheme].error}]}>
                                Cerrar sesión
                            </Text>
                        </Pressable>
                    </View>
                </Animated.View>
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
        alignItems: 'stretch',
        padding: Spacing.lg,
        gap: Spacing.lg,
    },
    hero: {
        alignItems: 'center',
    },
    imageWrapper: {
        position: 'relative',
        marginBottom: Spacing.base,
    },
    image: {
        width: 96,
        height: 96,
        borderRadius: Radius.pill,
    },
    editButton: {
        width: 32,
        height: 32,
        borderRadius: Radius.pill,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: -2,
        right: -2,
        borderWidth: 2,
    },
    name: {
        ...Typography.title,
    },
    email: {
        ...Typography.small,
        marginTop: 2,
    },
    card: {
        padding: Spacing.lg,
        gap: Spacing.base,
    },
    cardTitle: {
        ...Typography.label,
    },
    cardHint: {
        ...Typography.small,
        lineHeight: 18,
    },
    actions: {
        gap: Spacing.base,
    },
    logoutRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: Spacing.sm,
        paddingVertical: Spacing.sm,
    },
    logoutText: {
        ...Typography.bodyStrong,
    },
})
