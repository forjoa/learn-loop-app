import { Stack } from 'expo-router'
import { useState } from 'react'
import { useColorScheme } from 'react-native'
import { AppHeader } from '@/components/ui/app-header'
import NewContent from '@/components/new-content'
import { useAuth } from '@/hooks/useAuth'
import { useNotificationCount } from '@/hooks/useNotificationCount'
import { HomeSearchContext } from '@/contexts/HomeSearchContext'

export default function HomeLayout() {
    const colorScheme = useColorScheme() === 'light' ? 'light' : 'dark'
    const { user } = useAuth()
    const notificationCount = useNotificationCount()
    const [isNewBottomSheetVisible, setIsNewBottomSheetVisible] = useState(false)
    const [query, setQuery] = useState('')

    return (
        <HomeSearchContext.Provider value={{ query, setQuery }}>
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{
                        header: () => (
                            <AppHeader
                                theme={colorScheme}
                                variant="home"
                                user={user}
                                notificationCount={notificationCount}
                                onAddPress={() => setIsNewBottomSheetVisible(true)}
                                searchValue={query}
                                onSearchChange={setQuery}
                            />
                        ),
                    }}
                />
                <Stack.Screen name="topics/[id]" options={{ headerShown: false }} />
            </Stack>

            <NewContent
                isVisible={isNewBottomSheetVisible}
                onClose={() => setIsNewBottomSheetVisible(false)}
                colorScheme={colorScheme}
            />
        </HomeSearchContext.Provider>
    )
}
