import { Stack } from 'expo-router'
import { useColorScheme } from 'react-native'
import { AppHeader } from '@/components/ui/app-header'

export default function ChatsLayout() {
    const colorScheme = useColorScheme() === 'light' ? 'light' : 'dark'

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    header: () => (
                        <AppHeader
                            theme={colorScheme}
                            variant="title"
                            title="Chats"
                            subtitle="Tus conversaciones"
                            icon="message-circle"
                        />
                    ),
                }}
            />
            <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
        </Stack>
    )
}
