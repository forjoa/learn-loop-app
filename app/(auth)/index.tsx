import { useEffect, useState } from 'react'
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming, Easing } from 'react-native-reanimated'
import { useAuth } from '@/hooks/useAuth'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Href, router } from 'expo-router'
import { Colors } from '@/constants/Colors'
import { GlassSurface } from '@/components/ui/glass-view'
import { Button } from '@/components/ui/button'
import { Motion, Radius, Spacing, Typography } from '@/constants/Theme'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading } = useAuth()
  const [loginError, setLoginError] = useState<string | null>(null)
  const colorScheme = useColorScheme() === 'light' ? 'light' : 'dark'

  const entrance = useSharedValue(0)
  useEffect(() => {
    entrance.value = withDelay(80, withTiming(1, { duration: Motion.durationSlow, easing: Easing.out(Easing.cubic) }))
  }, [])
  const entranceStyle = useAnimatedStyle(() => ({
    opacity: entrance.value,
    transform: [{ translateY: (1 - entrance.value) * 24 }],
  }))

  const handleLogin = async () => {
    if (!email || !password) {
      setLoginError('Por favor, ingresa tu email y contraseña')
      return
    }

    const result = await login(email, password)
    if (result.success) {
      router.push('/(tabs)')
    } else {
      setLoginError(result.error || 'Error al iniciar sesión')
    }
  }

  const goTo = (route: Href) => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.push(route)
    }
  }

  return (
    <SafeAreaView style={[styles.page, { backgroundColor: Colors[colorScheme].background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.page}
      >
        <Animated.View style={[styles.wrapper, entranceStyle]}>
          <GlassSurface tint={colorScheme} radius={Radius.xxl} style={styles.container}>
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={require('@/assets/images/droid.png')}
              />
            </View>
            <Text style={[styles.title, { color: Colors[colorScheme].text }]}>Bienvenido</Text>
            <Text style={[styles.span, { color: Colors[colorScheme].textSecondary }]}>
              Inicia sesión en tu plataforma de aprendizaje favorita
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: Colors[colorScheme].input,
                  color: Colors[colorScheme].text,
                  borderColor: Colors[colorScheme].border,
                },
              ]}
              placeholder="Email"
              placeholderTextColor={Colors[colorScheme].textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: Colors[colorScheme].input,
                  color: Colors[colorScheme].text,
                  borderColor: Colors[colorScheme].border,
                },
              ]}
              placeholder="Contraseña"
              placeholderTextColor={Colors[colorScheme].textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {loginError && (
              <Text style={[styles.errorText, { color: Colors[colorScheme].error }]}>{loginError}</Text>
            )}
            <Button label="Entrar" onPress={handleLogin} loading={loading} />
            <View style={[styles.hr, { backgroundColor: Colors[colorScheme].border }]} />
            <Button
              label="Crear una cuenta"
              variant="secondary"
              onPress={() => goTo('/(auth)/register')}
            />
          </GlassSurface>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    width: '88%',
  },
  errorText: {
    ...Typography.small,
    marginTop: -Spacing.sm,
  },
  container: {
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 88,
    height: 88,
  },
  title: {
    ...Typography.display,
    fontSize: 28,
    textAlign: 'center',
  },
  span: {
    ...Typography.small,
    textAlign: 'center',
    marginTop: -Spacing.sm,
  },
  input: {
    ...Typography.body,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  hr: {
    height: StyleSheet.hairlineWidth,
  },
})
