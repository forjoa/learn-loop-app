import { useEffect, useState } from 'react'
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
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming, withSpring, Easing } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Href, router, useLocalSearchParams } from 'expo-router'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { Colors } from '@/constants/Colors'
import { profileImages } from '@/assets/profile-images'
import { useAuth } from '@/hooks/useAuth'
import { GlassSurface } from '@/components/ui/glass-view'
import { Button } from '@/components/ui/button'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { Motion, Radius, Spacing, Typography } from '@/constants/Theme'

const roles = [
    {label: 'Estudiante', value: 'STUDENT'},
    {label: 'Profesor', value: 'TEACHER'}
]

function ProfileOption({ image, selected, onPress, tint }: { image: string, selected: boolean, onPress: () => void, tint: 'light' | 'dark' }) {
    const scale = useSharedValue(1)
    const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))

    return (
        <Animated.View style={animatedStyle}>
            <Pressable
                onPressIn={() => { scale.value = withSpring(0.9, Motion.spring) }}
                onPressOut={() => { scale.value = withSpring(selected ? 1.06 : 1, Motion.spring) }}
                onPress={() => {
                    onPress()
                    scale.value = withSpring(1.06, Motion.spring)
                }}
                style={[
                    styles.profileOption,
                    { borderColor: selected ? Colors[tint].primary : 'transparent' },
                ]}
            >
                <Image source={profileImages[image]} style={styles.profileImage} />
            </Pressable>
        </Animated.View>
    )
}

export default function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('STUDENT')
    const [profileImage, setProfileImage] = useState('ant.png')
    const [registering, setRegistering] = useState(false)
    const colorScheme = useColorScheme() === 'light' ? 'light' : 'dark'
    const {register, error} = useAuth()
    // Carried along when this screen was opened from the "join a topic" link flow,
    // forwarded back to login so it survives the register -> login hop.
    const { redirectTopicId } = useLocalSearchParams<{ redirectTopicId?: string }>()

    const entrance = useSharedValue(0)
    useEffect(() => {
        entrance.value = withDelay(80, withTiming(1, { duration: Motion.durationSlow, easing: Easing.out(Easing.cubic) }))
    }, [])
    // No opacity here: entrance wraps a GlassSurface, and animating opacity on a
    // GlassView or its ancestors breaks/crashes native Liquid Glass (expo/expo#50097).
    const entranceStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: (1 - entrance.value) * 24 }],
    }))

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Por favor completa todos los campos requeridos')
            return
        }

        setRegistering(true)
        try {
            const result = await register(name, email, password, role, profileImage)

            if (result.success) {
                router.replace(redirectTopicId ? { pathname: '/(auth)', params: { redirectTopicId } } as Href : '/(auth)')
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
        // When carrying a join redirect, always replace with the param forwarded -
        // router.back() here could land on the join screen instead of login, since
        // this screen may have been opened directly from that link.
        if (redirectTopicId) {
            router.replace({ pathname: route, params: { redirectTopicId } } as Href)
            return
        }

        if (router.canGoBack()) {
            router.back()
        } else {
            router.push(route)
        }
    }

    return (
        <SafeAreaView style={[styles.page, { backgroundColor: Colors[colorScheme].background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1, width: '100%' }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View style={entranceStyle}>
                        <GlassSurface tint={colorScheme} radius={Radius.xxl} style={styles.container}>
                            <View style={styles.imageContainer}>
                                <Image
                                    style={styles.image}
                                    source={profileImages[profileImage] ?? require('@/assets/images/droid.png')}
                                />
                            </View>
                            <Text style={[styles.title, { color: Colors[colorScheme].text }]}>Crea tu cuenta</Text>
                            <Text style={[styles.span, { color: Colors[colorScheme].textSecondary }]}>
                                Empieza a aprender o enseñar en minutos
                            </Text>

                            <TextInput
                                style={[
                                    styles.input,
                                    { backgroundColor: Colors[colorScheme].input, color: Colors[colorScheme].text, borderColor: Colors[colorScheme].border },
                                ]}
                                placeholder="Nombre"
                                placeholderTextColor={Colors[colorScheme].textSecondary}
                                value={name}
                                onChangeText={setName}
                            />
                            <TextInput
                                style={[
                                    styles.input,
                                    { backgroundColor: Colors[colorScheme].input, color: Colors[colorScheme].text, borderColor: Colors[colorScheme].border },
                                ]}
                                placeholder="Email"
                                placeholderTextColor={Colors[colorScheme].textSecondary}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <TextInput
                                style={[
                                    styles.input,
                                    { backgroundColor: Colors[colorScheme].input, color: Colors[colorScheme].text, borderColor: Colors[colorScheme].border },
                                ]}
                                placeholder="Contraseña"
                                placeholderTextColor={Colors[colorScheme].textSecondary}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />

                            <SegmentedControl
                                options={roles}
                                value={role}
                                onChange={setRole}
                                tint={colorScheme}
                            />

                            <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>Selecciona tu foto de perfil</Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.profileScroll}
                            >
                                {Object.keys(profileImages).map((image) => (
                                    <ProfileOption
                                        key={image}
                                        image={image}
                                        selected={profileImage === image}
                                        onPress={() => setProfileImage(image)}
                                        tint={colorScheme}
                                    />
                                ))}
                            </ScrollView>

                            <Button
                                label={registering ? 'Registrando...' : 'Registrarse'}
                                onPress={handleRegister}
                                loading={registering}
                                style={{ marginTop: Spacing.sm }}
                            />

                            <View style={[styles.hr, { backgroundColor: Colors[colorScheme].border }]} />

                            <Button label="Ya tengo cuenta" variant="secondary" onPress={() => goTo('/(auth)')} />
                        </GlassSurface>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.xl,
    },
    container: {
        padding: Spacing.xl,
        gap: Spacing.md,
    },
    imageContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    image: {
        width: 88,
        height: 88,
        borderRadius: Radius.pill,
    },
    title: {
        ...Typography.display,
        fontSize: 26,
        textAlign: 'center',
    },
    span: {
        ...Typography.small,
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },
    input: {
        ...Typography.body,
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.md,
        borderRadius: Radius.md,
        borderWidth: StyleSheet.hairlineWidth,
    },
    sectionTitle: {
        ...Typography.small,
        fontWeight: '700',
        marginTop: Spacing.sm,
    },
    profileScroll: {
        marginBottom: Spacing.sm,
    },
    profileOption: {
        marginRight: Spacing.sm,
        width: 64,
        height: 64,
        borderRadius: Radius.pill,
        borderWidth: 2,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    hr: {
        height: StyleSheet.hairlineWidth,
        marginVertical: Spacing.sm,
    },
})
