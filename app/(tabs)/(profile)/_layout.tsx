import { Stack } from 'expo-router'
import { useColorScheme } from 'react-native'
import { AppHeader } from '@/components/ui/app-header'
import { useAuth } from '@/hooks/useAuth'

export default function ProfileLayout() {
    const colorScheme = useColorScheme() === 'light' ? 'light' : 'dark'
    const { user } = useAuth()

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    header: () => (
                        <AppHeader
                            theme={colorScheme}
                            variant="title"
                            title="Perfil"
                            subtitle={user?.role === 'TEACHER' ? 'Profesor' : 'Estudiante'}
                            icon="user"
                        />
                    ),
                }}
            />
        </Stack>
    )
}
