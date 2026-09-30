import { Stack, router } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Feather from '@expo/vector-icons/Feather'
import { Colors } from '@/constants/Colors'
import { Button } from '@/components/ui/button'
import { Spacing, Typography } from '@/constants/Theme'

export default function NotFoundScreen() {
  const theme = useColorScheme() === 'light' ? 'light' : 'dark'

  return (
    <SafeAreaView style={[styles.page, { backgroundColor: Colors[theme].background }]}>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Feather name="compass" size={48} color={Colors[theme].textSecondary} />
      <Text style={[styles.title, { color: Colors[theme].text }]}>Esta pantalla no existe</Text>
      <Text style={[styles.subtitle, { color: Colors[theme].textSecondary }]}>
        Puede que el enlace esté roto o la página se haya movido.
      </Text>
      <Button label="Volver al inicio" onPress={() => router.replace('/(tabs)')} style={styles.button} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  title: {
    ...Typography.title,
    marginTop: Spacing.md,
  },
  subtitle: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  button: {
    marginTop: Spacing.md,
    minWidth: 200,
  },
})
