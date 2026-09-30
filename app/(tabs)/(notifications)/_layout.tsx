import { Stack } from 'expo-router'
import { useColorScheme } from 'react-native'
import { AppHeader } from '@/components/ui/app-header'
import { useNotificationCount } from '@/hooks/useNotificationCount'

export default function NotificationsLayout() {
    const colorScheme = useColorScheme() === 'light' ? 'light' : 'dark'
    const notificationCount = useNotificationCount()

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    header: () => (
                        <AppHeader
                            theme={colorScheme}
                            variant="title"
                            title="Notificaciones"
                            subtitle={notificationCount > 0 ? `${notificationCount} pendientes` : 'Todo al día'}
                            icon="bell"
                        />
                    ),
                }}
            />
        </Stack>
    )
}
