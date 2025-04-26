import { useState } from 'react'
import {
  ImageSourcePropType,
  Image,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TextInput,
  ImageURISource,
  useColorScheme,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Href, router } from 'expo-router'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { Colors } from '@/constants/Colors'

const profileImages: Record<string, ImageSourcePropType> = {
  'ant.png': require('@/assets/images/profile/ant.png'),
  'bear.png': require('@/assets/images/profile/bear.png'),
  'bison.png': require('@/assets/images/profile/bison.png'),
  'buffalo.png': require('@/assets/images/profile/buffalo.png'),
  'cat-2.png': require('@/assets/images/profile/cat-2.png'),
  'cat-3.png': require('@/assets/images/profile/cat-3.png'),
  'chicken.png': require('@/assets/images/profile/chicken.png'),
  'cow.png': require('@/assets/images/profile/cow.png'),
  'crocodile.png': require('@/assets/images/profile/crocodile.png'),
  'dog-2.png': require('@/assets/images/profile/dog-2.png'),
  'dog-4.png': require('@/assets/images/profile/dog-4.png'),
  'doraemon.png': require('@/assets/images/profile/doraemon.png'),
  'duck.png': require('@/assets/images/profile/duck.png'),
  'eagle.png': require('@/assets/images/profile/eagle.png'),
  'elephant.png': require('@/assets/images/profile/elephant.png'),
  'fox.png': require('@/assets/images/profile/fox.png'),
  'giraffe.png': require('@/assets/images/profile/giraffe.png'),
  'gorilla.png': require('@/assets/images/profile/gorilla.png'),
  'hedgehog.png': require('@/assets/images/profile/hedgehog.png'),
  'hello-kitty.png': require('@/assets/images/profile/hello-kitty.png'),
  'hippo.png': require('@/assets/images/profile/hippo.png'),
  'horse.png': require('@/assets/images/profile/horse.png'),
  'keroppi.png': require('@/assets/images/profile/keroppi.png'),
  'koala.png': require('@/assets/images/profile/koala.png'),
  'leopard.png': require('@/assets/images/profile/leopard.png'),
  'lion.png': require('@/assets/images/profile/lion.png'),
  'monkey.png': require('@/assets/images/profile/monkey.png'),
  'moose.png': require('@/assets/images/profile/moose.png'),
  'mouse.png': require('@/assets/images/profile/mouse.png'),
  'otter.png': require('@/assets/images/profile/otter.png'),
  'owl.png': require('@/assets/images/profile/owl.png'),
  'panda.png': require('@/assets/images/profile/panda.png'),
  'penguin.png': require('@/assets/images/profile/penguin.png'),
  'pig.png': require('@/assets/images/profile/pig.png'),
  'pikachu.png': require('@/assets/images/profile/pikachu.png'),
  'raccoon.png': require('@/assets/images/profile/raccoon.png'),
  'sheep.png': require('@/assets/images/profile/sheep.png'),
  'sloth.png': require('@/assets/images/profile/sloth.png'),
  'snake.png': require('@/assets/images/profile/snake.png'),
  'squirrel.png': require('@/assets/images/profile/squirrel.png'),
  'tiger.png': require('@/assets/images/profile/tiger.png'),
  'wolf.png': require('@/assets/images/profile/wolf.png'),
  'zebra.png': require('@/assets/images/profile/zebra.png'),
}

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('STUDENT')
  const [profileImage, setProfileImage] = useState(profileImages['ant.png'])
  const colorScheme = useColorScheme() || 'dark'

  const handleRegister = () => {
    console.log({ name, email, password, role, profileImage })
    router.push('/(auth)')
  }

  const goTo = (route: Href) => {
    router.push(route)
  }

  return (
    <SafeAreaView style={styles.page}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={[
            styles.container,
            { backgroundColor: Colors[colorScheme].card }
          ]}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
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
          ]}>Registro</Text>
          <Text style={[
            styles.span,
            { color: Colors[colorScheme].textSecondary }
          ]}>
            Crea una cuenta para comenzar a aprender o enseñar
          </Text>

          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: Colors[colorScheme].input,
                color: Colors[colorScheme].text 
              }
            ]}
            placeholder="Nombre"
            placeholderTextColor={Colors[colorScheme].textSecondary}
            value={name}
            onChangeText={setName}
          />
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
            keyboardType="email-address"
          />

          {/* Campo de contraseña */}
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: Colors[colorScheme].input,
                color: Colors[colorScheme].text 
              }
            ]}
            placeholder="****"
            placeholderTextColor={Colors[colorScheme].textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Selector de rol */}
          <Picker
            selectedValue={role}
            onValueChange={(itemValue: string) => setRole(itemValue)}
            style={[
              styles.picker,
              { 
                backgroundColor: Colors[colorScheme].input,
                color: Colors[colorScheme].text 
              }
            ]}
            itemStyle={styles.pickerItem}
            mode="dropdown"
          >
            <Picker.Item 
              label="Estudiante" 
              value="STUDENT" 
              color={colorScheme === 'dark' ? '#fff' : '#000'}
            />
            <Picker.Item 
              label="Profesor" 
              value="TEACHER" 
              color={colorScheme === 'dark' ? '#fff' : '#000'}
            />
          </Picker>

          {/* Selección de imagen de perfil */}
          <Text style={[
            styles.sectionTitle,
            { color: Colors[colorScheme].text }
          ]}>Selecciona tu foto de perfil</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.profileScroll}
          >
            {Object.keys(profileImages).map((image) => (
              <Pressable
                key={image}
                onPress={() => setProfileImage(image as ImageURISource)}
                style={[
                  styles.profileOption,
                  profileImage === image && [
                    styles.profileSelected,
                    { borderColor: Colors[colorScheme].primary }
                  ],
                ]}
              >
                <Image
                  source={profileImages[image]} // Usas directamente la referencia de `profileImages`
                  style={styles.profileImage}
                />
              </Pressable>
            ))}
          </ScrollView>

          {/* Botón de registro */}
          <Pressable 
            style={[
              styles.primary,
              { 
                backgroundColor: Colors[colorScheme].primary,
                borderColor: Colors[colorScheme].primaryBorder 
              }
            ]} 
            onPress={handleRegister}
          >
            <Text style={[
              styles.textPrimary,
              { color: Colors[colorScheme].text }
            ]}>Registrarse</Text>
          </Pressable>

          <View style={[
            styles.hr,
            { backgroundColor: Colors[colorScheme].border }
          ]} />

          {/* Enlace para ir al login */}
          <Pressable 
            style={[
              styles.secondary,
              { 
                backgroundColor: Colors[colorScheme].secondary.background,
                borderColor: Colors[colorScheme].secondary.border 
              }
            ]} 
            onPress={() => goTo('/(auth)')}
          >
            <Text style={[
              styles.textSecondary,
              { color: Colors[colorScheme].secondary.text }
            ]}>Inicia sesión</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    width: '90%',
    marginVertical: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  span: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  picker: {
    borderRadius: 10,
    marginBottom: 15,
  },
  pickerItem: {
    fontSize: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileScroll: {
    marginBottom: 20,
  },
  profileOption: {
    marginRight: 10,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  profileSelected: {
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  primary: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 5,
    borderTopWidth: 2,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
  },
  textPrimary: {
  },
  hr: {
    height: 1,
    marginVertical: 20,
  },
  secondary: {
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
