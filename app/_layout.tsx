import { useAuth } from '@/hooks/useAuth'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Redirect, Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import 'react-native-reanimated'
import { StyleSheet, useColorScheme } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Colors } from '@/constants/Colors'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/Geist-Regular.ttf'),
    })
    const {user} = useAuth()
    const colorScheme = useColorScheme() || 'dark'

    // Create custom themes based on our Colors constants
    const customDarkTheme = {
        ...DarkTheme,
        colors: {
            ...DarkTheme.colors,
            primary: Colors.dark.primary,
            background: Colors.dark.background,
            card: Colors.dark.card,
            text: Colors.dark.text,
            border: Colors.dark.border,
        },
    }

    const customLightTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            primary: Colors.light.primary,
            background: Colors.light.background,
            card: Colors.light.card,
            text: Colors.light.text,
            border: Colors.light.border,
        },
    }

    // Select theme based on system preference
    const theme = colorScheme === 'dark' ? customDarkTheme : customLightTheme

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
            <ThemeProvider value={theme}>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                    <Stack.Screen name="(auth)" options={{headerShown: false}}/>
                    <Stack.Screen name="+not-found"/>
                </Stack>
                <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'}/>
            </ThemeProvider>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
