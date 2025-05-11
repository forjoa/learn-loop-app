import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'

import Main from '@/components/ui/main'
import { useEffect, useState } from 'react'
import { API_URL } from '@/constants/config'
import { useAuth } from '@/hooks/useAuth'
import * as SecureStorage from 'expo-secure-store'
import { Colors } from '@/constants/Colors'
import Feather from '@expo/vector-icons/Feather'
import CustomAlert from '@/components/ui/dialog'
import { Noti } from '@/lib/interfaces'

export default function NotificationScreen() {
    const [notifications, setNotifications] = useState<Noti[]>([])
    const [selectedNotification, setSelectedNotification] = useState<Noti>()
    const [showAlert, setShowAlert] = useState(false)

    const theme = useColorScheme() || 'dark'
    const {user} = useAuth()

    const loadNotifications = async () => {
        const token = await SecureStorage.getItemAsync('authToken')
        if (user) {
            const response = await fetch(`${API_URL}/notifications/get?userId=${user?.id as string}`, {
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

    const enrollmentAction = async (enrollmentId: string, action: string) => {
        const token = await SecureStorage.getItemAsync('authToken')
        const response = await fetch(`${API_URL}/enrollments/${action}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: enrollmentId}),
        })
        const result = await response.json()
        console.log(result)
    }

    useEffect(() => {
        loadNotifications()
    }, [user])

    return (
        <>
            <Main onLoad={loadNotifications}>
                {notifications?.length < 1 ? (
                    <Text style={[{color: Colors[theme].text}]}>No hay notificaciones</Text>
                ) : (
                    notifications.map((notif, index) => (
                        <TouchableOpacity key={index} style={[styles.nav, {
                            borderColor: Colors[theme].nav.border,
                            backgroundColor: Colors[theme].header.background
                        }]} onPress={() => {
                            setSelectedNotification(notif)
                            setShowAlert(true)
                        }}>
                            <View style={[styles.imageContainer, {backgroundColor: Colors[theme].primaryBackground}]}>
                                <Feather name={notif.title.toLowerCase().includes('solicitud') ? 'users' : 'file-plus'}
                                         color={Colors[theme].primary} size={30}/>
                            </View>
                            <View style={[styles.textContainer]}>
                                <Text style={[{color: Colors[theme].text}]}>
                                    {notif.content}
                                </Text>
                                <Text style={[{color: Colors[theme].textSecondary}]}>
                                    {new Date(notif.createdAt!).getDay()}/{new Date(notif.createdAt!).getMonth() + 1} - {new Date(notif.createdAt!).getHours()}:{new Date(notif.createdAt!).getMinutes()}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </Main>
            <CustomAlert
                visible={showAlert}
                title={selectedNotification?.title!}
                message={selectedNotification?.content!}
                confirmText="Aceptar"
                denyText="Rechazar"
                cancelText="Cancelar"
                onConfirm={() => {
                    console.log('Acción confirmada')
                    console.log(selectedNotification)
                    if (selectedNotification?.enrollmentId) {
                        enrollmentAction(selectedNotification.enrollmentId, 'accept')
                    }
                    setShowAlert(false)
                }}
                onCancel={() => {
                    console.log('Acción cancelada')
                    setShowAlert(false)
                }}
                onDeny={() => {
                    console.log('Acción denegada')
                    if (selectedNotification?.enrollmentId) {
                        enrollmentAction(selectedNotification.enrollmentId, 'deny')
                    }
                    setShowAlert(false)
                }}
                theme={theme}
            />
        </>
    )
}

const styles = StyleSheet.create({
    imageContainer: {
        borderRadius: 8,
        padding: 8,
    },
    nav: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderWidth: 0.5,
        borderRadius: 15,
        gap: 10,
        marginBottom: 10,
    },
    textContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 5
    },
})
