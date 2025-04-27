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
import { ActivityIndicator, View } from 'react-native'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        SpaceMono: require('../assets/fonts/Geist-Regular.ttf'),
    })

    const { user, loading: authLoading } = useAuth()
    const colorScheme = useColorScheme() || 'dark'

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

    const theme = colorScheme === 'dark' ? customDarkTheme : customLightTheme

    useEffect(() => {
        if (fontsLoaded && !authLoading) {
            SplashScreen.hideAsync()
        }
    }, [fontsLoaded, authLoading])

    if (!fontsLoaded || authLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <ThemeProvider value={theme}>
                <Stack screenOptions={{ headerShown: false }}>
                    {user ? (
                        <>
                            <Stack.Screen
                                name="(tabs)"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen name="+not-found"/>
                        </>
                    ) : (
                        <Stack.Screen
                            name="(auth)"
                            options={{ headerShown: false }}
                        />
                    )}
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