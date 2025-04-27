import { useState } from 'react'
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  useColorScheme,
} from 'react-native'
import { useAuth } from '@/hooks/useAuth'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Href, Link, router } from 'expo-router'
import { Colors } from '@/constants/Colors'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading, error } = useAuth()
  const [loginError, setLoginError] = useState<string | null>(null)
  const colorScheme = useColorScheme() || 'dark'

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
    router.push(route)
  }

  return (
    <SafeAreaView style={styles.page}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[
          styles.container,
          { backgroundColor: Colors[colorScheme].card }
        ]}
      >
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require('@/assets/images/droid.png')}
          />
        </View>
        <Text style={[
          styles.title,
          { color: Colors[colorScheme].text }
        ]}>Login</Text>
        <Text style={[
          styles.span,
          { color: Colors[colorScheme].textSecondary }
        ]}>
          Bienvenido de nuevo a tu plataforma de aprendizaje favorita
        </Text>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: Colors[colorScheme].input,
              color: Colors[colorScheme].text 
            }
          ]}
          placeholder="Email"
          placeholderTextColor={Colors[colorScheme].textSecondary}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: Colors[colorScheme].input,
              color: Colors[colorScheme].text 
            }
          ]}
          placeholder="******"
          placeholderTextColor={Colors[colorScheme].textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {loginError && (
          <Text style={[
            styles.errorText,
            { color: Colors[colorScheme].error }
          ]}>{loginError}</Text>
        )}
        <Pressable 
          style={[
            styles.primary, 
            { 
              backgroundColor: Colors[colorScheme].primary,
              borderColor: Colors[colorScheme].primaryBorder 
            },
            loading && [
              styles.disabledButton,
              { backgroundColor: Colors[colorScheme].disabledButton }
            ]
          ]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors[colorScheme].text} />
          ) : (
            <Text style={[
              styles.textPrimary,
              { color: '#fff' }
            ]}>Enviar</Text>
          )}
        </Pressable>
        <View style={[
          styles.hr,
          { backgroundColor: Colors[colorScheme].border }
        ]} />
        <Pressable
          style={[
            styles.secondary,
            { 
              backgroundColor: Colors[colorScheme].secondary.background,
              borderColor: Colors[colorScheme].secondary.border 
            }
          ]}
          onPress={() => goTo('/(auth)/register')}
        >
          <Text style={[
            styles.textSecondary,
            { color: Colors[colorScheme].secondary.text }
          ]}>Regístrate</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  page: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  errorText: {
    fontSize: 14,
    marginTop: -15,
    marginBottom: -10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  container: {
    width: '80%',
    padding: 30,
    borderRadius: 20,
    display: 'flex',
    gap: 25,
  },
  imageContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: -20,
  },
  span: {
    marginTop: -10,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 15,
    borderRadius: 10,
  },
  primary: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    borderTopWidth: 2,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
  },
  textPrimary: {
  },
  hr: {
    height: 1,
  },
  secondary: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    borderTopWidth: 2,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    marginBottom: 25,
  },
  textSecondary: {
  },
})
