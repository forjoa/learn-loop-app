import { StyleSheet, Text, Pressable, useColorScheme, View } from 'react-native'

import Main from '@/components/ui/main'
import { GlassSurface } from '@/components/ui/glass-view'
import { Motion, Radius, Spacing, Typography } from '@/constants/Theme'
import { useEffect, useState } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming, Easing } from 'react-native-reanimated'
import { API_URL } from '@/constants/config'
import { useAuth } from '@/hooks/useAuth'
import * as SecureStorage from 'expo-secure-store'
import { Colors } from '@/constants/Colors'
import Feather from '@expo/vector-icons/Feather'
import CustomAlert from '@/components/ui/dialog'
import { Noti } from '@/lib/interfaces'

function NotificationRow({ notif, theme, index, onPress }: { notif: Noti, theme: 'light' | 'dark', index: number, onPress: () => void }) {
    const scale = useSharedValue(1)
    const entrance = useSharedValue(0)

    useEffect(() => {
        entrance.value = withDelay(
            Math.min(index, 8) * 50,
            withTiming(1, { duration: Motion.durationBase, easing: Easing.out(Easing.cubic) })
        )
    }, [])

    // No opacity here: wraps a GlassSurface, and animating opacity on a GlassView or
    // its ancestors breaks/crashes native Liquid Glass (expo/expo#50097).
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: (1 - entrance.value) * 12 },
            { scale: scale.value },
        ],
    }))

    return (
        <Animated.View style={animatedStyle}>
            <Pressable
                onPressIn={() => { scale.value = withSpring(0.98, Motion.spring) }}
                onPressOut={() => { scale.value = withSpring(1, Motion.spring) }}
                onPress={onPress}
            >
                <GlassSurface tint={theme} radius={Radius.lg} style={styles.nav}>
                    <View style={[styles.imageContainer, {backgroundColor: Colors[theme].primaryBackground}]}>
                        <Feather name={notif.title.toLowerCase().includes('solicitud') ? 'users' : 'file-plus'}
                                 color={Colors[theme].primary} size={26}/>
                    </View>
                    <View style={[styles.textContainer]}>
                        <Text style={[Typography.bodyStrong, {color: Colors[theme].text}]}>
                            {notif.content}
                        </Text>
                        <Text style={[Typography.small, {color: Colors[theme].textSecondary}]}>
                            {new Date(notif.createdAt!).getDay()}/{new Date(notif.createdAt!).getMonth() + 1} - {new Date(notif.createdAt!).getHours()}:{new Date(notif.createdAt!).getMinutes()}
                        </Text>
                    </View>
                </GlassSurface>
            </Pressable>
        </Animated.View>
    )
}

export default function NotificationScreen() {
    const [notifications, setNotifications] = useState<Noti[]>([])
    const [selectedNotification, setSelectedNotification] = useState<Noti>()
    const [showAlert, setShowAlert] = useState(false)

    const theme = useColorScheme() === 'light' ? 'light' : 'dark'
    const {user} = useAuth()

    const loadNotifications = async () => {
        const token = await SecureStorage.getItemAsync('authToken')
        if (user) {
            const response = await fetch(`${API_URL}/users/${user?.id as string}/notifications`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
            const result = await response.json()
            setNotifications(result)
        }
    }

    const enrollmentAction = async (enrollmentId: string, status: 'APPROVED' | 'REJECTED') => {
        const token = await SecureStorage.getItemAsync('authToken')
        const response = await fetch(`${API_URL}/enrollments/${enrollmentId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({status}),
        })
        await response.json()
    }

    useEffect(() => {
        loadNotifications()
    }, [user])

    return (
        <>
            <Main onLoad={loadNotifications}>
                {notifications?.length < 1 ? (
                    <Text style={[{color: Colors[theme].textSecondary}]}>No hay notificaciones</Text>
                ) : (
                    notifications.map((notif, index) => (
                        <NotificationRow
                            key={index}
                            notif={notif}
                            theme={theme}
                            index={index}
                            onPress={() => {
                                setSelectedNotification(notif)
                                setShowAlert(true)
                            }}
                        />
                    ))
                )}
            </Main>
            <CustomAlert
                visible={showAlert}
                title={selectedNotification?.title!}
                message={selectedNotification?.content!}
                confirmText={selectedNotification?.enrollmentId ? 'Aceptar' : 'Entendido'}
                denyText="Rechazar"
                cancelText="Cancelar"
                onConfirm={() => {
                    if (selectedNotification?.enrollmentId) {
                        enrollmentAction(selectedNotification.enrollmentId, 'APPROVED')
                    }
                    setShowAlert(false)
                }}
                onCancel={() => {
                    setShowAlert(false)
                }}
                // Only a still-pending request is actionable - a resolved one (the
                // student's "accepted"/"rejected" notification) has no enrollmentId
                // and should just read as informational, with no deny option.
                onDeny={selectedNotification?.enrollmentId ? () => {
                    enrollmentAction(selectedNotification.enrollmentId!, 'REJECTED')
                    setShowAlert(false)
                } : undefined}
                theme={theme}
            />
        </>
    )
}

const styles = StyleSheet.create({
    imageContainer: {
        borderRadius: Radius.pill,
        padding: Spacing.md,
    },
    nav: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.base,
        gap: Spacing.md,
        marginBottom: Spacing.sm,
    },
    textContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: Spacing.xs,
        flexShrink: 1,
    },
})
