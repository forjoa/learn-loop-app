import { Stack } from 'expo-router'
import React from 'react'
import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function NotFoundScreen() {
  return (
    <SafeAreaView>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Text>This screen doesnt exists</Text>
    </SafeAreaView>
  )
}
