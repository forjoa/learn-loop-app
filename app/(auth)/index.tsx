import { useState } from 'react';
import { TextInput, View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    await login(email, password);
  };

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={require('@/assets/images/droid.png')} />
        </View>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.span}>Bienvenido de nuevo a tu plataforma de aprendizaje favorita</Text>
        <TextInput style={styles.input} placeholder='Email' value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder='****' value={password} onChangeText={setPassword} secureTextEntry />
        <Pressable style={styles.primary} onPress={handleLogin} >
          <Text style={styles.textPrimary}>Enviar</Text>
        </Pressable>
        <View style={styles.hr}/>
        <Pressable style={styles.secondary}>
          <Text style={styles.textSecondary}>Regístrate</Text>
        </Pressable>
        <View>
          <Link href={'/(auth)/index'}>¿Olvidaste la contraseña?</Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  container: {
    backgroundColor: '#1F1F21',
    width: '80%',
    padding: 30,
    borderRadius: 20,
    display: 'flex',
    gap: 25
  },
  imageContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: 100,
    height: 100
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: -20
  },
  span: {
    color: '#50545D',
    marginTop: -10
  },
  input: {
    backgroundColor: '#353638',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 15,
    borderRadius: 10
  },
  primary: {
    backgroundColor: '#016BFF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    borderTopWidth: 2,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderColor: '#4090FF'
  },
  textPrimary: {
    color: '#fff',
  },
  hr: {
    backgroundColor: '#353638',
    height: 1
  },
  secondary: {
    backgroundColor: '#353638',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    borderTopWidth: 2,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderColor: '#50545D'
  },
  textSecondary: {
    color: '#016BFF'
  }
})