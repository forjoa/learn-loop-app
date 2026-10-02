import { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, useColorScheme, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming, Easing } from 'react-native-reanimated'
import Feather from '@expo/vector-icons/Feather'
import { RelativePathString, router, useLocalSearchParams } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { Colors } from '@/constants/Colors'
import { GlassSurface } from '@/components/ui/glass-view'
import { Button } from '@/components/ui/button'
import { Motion, Radius, Spacing, Typography } from '@/constants/Theme'
import { API_URL } from '@/constants/config'
import { useAuth } from '@/hooks/useAuth'
import { EnrollmentStatus, TopicPreview } from '@/lib/interfaces'

type ScreenState = 'loading' | 'not-found' | 'ready'

export default function JoinTopicScreen() {
    const { topicId } = useLocalSearchParams<{ topicId: string }>()
    const theme = useColorScheme() === 'light' ? 'light' : 'dark'
    const { user, loading: authLoading } = useAuth()

    const [state, setState] = useState<ScreenState>('loading')
    const [topic, setTopic] = useState<TopicPreview | null>(null)
    const [enrollmentStatus, setEnrollmentStatus] = useState<EnrollmentStatus | null>(null)
    const [checkingStatus, setCheckingStatus] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [requested, setRequested] = useState(false)

    const entrance = useSharedValue(0)
    useEffect(() => {
        entrance.value = withDelay(80, withTiming(1, { duration: Motion.durationSlow, easing: Easing.out(Easing.cubic) }))
    }, [])
    // No opacity here: wraps a GlassSurface, and animating opacity on a GlassView or
    // its ancestors breaks/crashes native Liquid Glass (expo/expo#50097).
    const entranceStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: (1 - entrance.value) * 24 }],
    }))

    useEffect(() => {
        const loadPreview = async () => {
            try {
                const result = await fetch(`${API_URL}/public/topics/preview?id=${topicId}`)
                if (!result.ok) {
                    setState('not-found')
                    return
                }
                setTopic(await result.json())
                setState('ready')
            } catch {
                setState('not-found')
            }
        }

        if (topicId) {
            loadPreview()
        } else {
            setState('not-found')
        }
    }, [topicId])

    useEffect(() => {
        if (authLoading || !user || !topicId) return

        const loadStatus = async () => {
            setCheckingStatus(true)
            try {
                const token = await SecureStore.getItemAsync('authToken')
                const result = await fetch(`${API_URL}/enrollments/status?userId=${user.id}&topicId=${topicId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })
                if (result.ok) {
                    setEnrollmentStatus(await result.json())
                }
            } finally {
                setCheckingStatus(false)
            }
        }

        loadStatus()
    }, [user, authLoading, topicId])

    const handleRequestJoin = async () => {
        if (!user || !topicId) return

        setSubmitting(true)
        try {
            const token = await SecureStore.getItemAsync('authToken')
            await fetch(`${API_URL}/enrollments/create`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user.id, topicId }),
            })
            setRequested(true)
        } finally {
            setSubmitting(false)
        }
    }

    const goToLogin = () => {
        router.push({ pathname: '/(auth)', params: { redirectTopicId: topicId } })
    }

    const goToRegister = () => {
        router.push({ pathname: '/(auth)/register', params: { redirectTopicId: topicId } })
    }

    const goHome = () => router.replace('/(tabs)/(home)')
    const goToTopic = () => router.replace(`/topics/${topicId}` as RelativePathString)

    const isOwner = !!user && !!topic && user.id === topic.ownerId

    const renderAction = () => {
        if (!user) {
            return (
                <View style={styles.actions}>
                    <Button label="Iniciar sesión" onPress={goToLogin} />
                    <Button label="Crear una cuenta" variant="secondary" onPress={goToRegister} />
                </View>
            )
        }

        if (isOwner) {
            return (
                <View style={styles.actions}>
                    <Text style={[styles.statusText, { color: Colors[theme].textSecondary }]}>
                        Este es tu propio tema.
                    </Text>
                    <Button label="Ver tema" onPress={goToTopic} />
                </View>
            )
        }

        if (checkingStatus) {
            return <ActivityIndicator color={Colors[theme].primary} style={styles.actions} />
        }

        if (requested || enrollmentStatus?.status === 'PENDING') {
            return (
                <View style={styles.actions}>
                    <View style={[styles.pendingBadge, { backgroundColor: Colors[theme].input }]}>
                        <Feather name="clock" size={16} color={Colors[theme].textSecondary} />
                        <Text style={[styles.statusText, { color: Colors[theme].textSecondary }]}>
                            Solicitud pendiente de aprobación
                        </Text>
                    </View>
                    <Button label="Ir al inicio" variant="secondary" onPress={goHome} />
                </View>
            )
        }

        if (enrollmentStatus?.status === 'APPROVED') {
            return (
                <View style={styles.actions}>
                    <Text style={[styles.statusText, { color: Colors[theme].textSecondary }]}>
                        Ya eres miembro de este tema.
                    </Text>
                    <Button label="Ir al tema" onPress={goToTopic} />
                </View>
            )
        }

        return (
            <View style={styles.actions}>
                <Button label="Solicitar unirme" onPress={handleRequestJoin} loading={submitting} />
            </View>
        )
    }

    return (
        <SafeAreaView style={[styles.page, { backgroundColor: Colors[theme].background }]}>
            {state === 'loading' && (
                <ActivityIndicator size="large" color={Colors[theme].primary} />
            )}

            {state === 'not-found' && (
                <View style={styles.center}>
                    <Feather name="compass" size={48} color={Colors[theme].textSecondary} />
                    <Text style={[styles.title, { color: Colors[theme].text }]}>Este tema no existe</Text>
                    <Text style={[styles.description, { color: Colors[theme].textSecondary }]}>
                        El enlace puede estar roto o el tema ya no está disponible.
                    </Text>
                    <Button label="Ir al inicio" onPress={() => router.replace('/')} style={styles.notFoundButton} />
                </View>
            )}

            {state === 'ready' && topic && (
                <Animated.View style={[styles.content, entranceStyle]}>
                    <GlassSurface tint={theme} radius={Radius.xl} style={styles.card}>
                        <View style={[styles.icon, { backgroundColor: Colors[theme].primaryBackground }]}>
                            <Feather name="book-open" size={28} color={Colors[theme].primary} />
                        </View>
                        <Text style={[styles.title, { color: Colors[theme].text }]}>{topic.title}</Text>
                        <Text style={[styles.description, { color: Colors[theme].textSecondary }]}>
                            {topic.description}
                        </Text>
                        <View style={styles.metaRow}>
                            <Text style={[styles.meta, { color: Colors[theme].textSecondary }]}>
                                Profesor: {topic.ownerName}
                            </Text>
                            <Text style={[styles.meta, { color: Colors[theme].textSecondary }]}>
                                {topic.memberCount} {topic.memberCount === 1 ? 'miembro' : 'miembros'}
                            </Text>
                        </View>
                    </GlassSurface>

                    {renderAction()}
                </Animated.View>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.lg,
    },
    center: {
        alignItems: 'center',
        gap: Spacing.sm,
    },
    content: {
        width: '100%',
        gap: Spacing.lg,
    },
    card: {
        padding: Spacing.xl,
        gap: Spacing.sm,
        alignItems: 'center',
    },
    icon: {
        width: 56,
        height: 56,
        borderRadius: Radius.pill,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.sm,
    },
    title: {
        ...Typography.title,
        textAlign: 'center',
    },
    description: {
        ...Typography.body,
        textAlign: 'center',
    },
    metaRow: {
        flexDirection: 'row',
        gap: Spacing.base,
        marginTop: Spacing.sm,
    },
    meta: {
        ...Typography.small,
    },
    actions: {
        gap: Spacing.sm,
    },
    statusText: {
        ...Typography.small,
        textAlign: 'center',
    },
    pendingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        paddingVertical: Spacing.base,
        borderRadius: Radius.md,
    },
    notFoundButton: {
        marginTop: Spacing.base,
        minWidth: 200,
    },
})
