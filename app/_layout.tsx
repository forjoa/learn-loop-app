import { useAuth } from '@/hooks/useAuth'
import { DarkTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Redirect, Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import 'react-native-reanimated'
import { StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/Geist-Regular.ttf'),
    })
    const {user} = useAuth()

    if (!user) {
        return <Redirect href="/(auth)"/>
    }

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync()
        }
    }, [loaded])

    if (!loaded) {
        return null
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <ThemeProvider value={DarkTheme}>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                    <Stack.Screen name="(auth)" options={{headerShown: false}}/>
                    <Stack.Screen name="+not-found"/>
                </Stack>
                <StatusBar style="auto"/>
            </ThemeProvider>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
