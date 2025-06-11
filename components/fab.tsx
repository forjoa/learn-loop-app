import { Colors } from '@/constants/Colors'
import React, { useState } from 'react'
import {
    ActivityIndicator,
    Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  ViewProps,
} from 'react-native'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import BottomSheet from './ui/bottom-sheet'
import { BlurView } from 'expo-blur'
import * as Clipboard from 'expo-clipboard';

interface FloatingButtonProps extends ViewProps {
  onPress: () => void
  topicId: string
}

export function FloatingButton({
  onPress,
  topicId,
  style,
  ...rest
}: FloatingButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [examData, setExamData] = useState<string>('')
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const colorScheme = useColorScheme() || 'dark'
  const animation = useSharedValue(0)

  const rotationAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: withSpring(isOpen ? '360deg' : '0deg'),
        },
      ],
    }
  })

  const heartAnimatedStyle = useAnimatedStyle(() => {
    const translateYAnimation = interpolate(
      animation.value,
      [0, 1],
      [0, -40],
      Extrapolation.CLAMP
    )

    return {
      transform: [
        {
          scale: withSpring(animation.value),
        },
        {
          translateY: withSpring(translateYAnimation),
        },
      ],
    }
  })

  const opacityAnimatedStyle = useAnimatedStyle(() => {
    const opacityAnimation = interpolate(
      animation.value,
      [0, 0.5, 1],
      [0, 0, 1],
      Extrapolation.CLAMP
    )

    return {
      opacity: withSpring(opacityAnimation),
    }
  })

  function toggleMenu() {
    onPress()
    setIsOpen((current) => {
      animation.value = current ? 0 : 1
      return !current
    })
  }

    const generateExam = async () => {
    setIsOpen(false)
    animation.value = 0
    setIsLoading(true)
    
    try {
      const response = await fetch(
        `https://learn-loop.app.n8n.cloud/webhook/6d998e45-df1f-4ab7-b4c1-494c4156ffc9?topic_id=${topicId}`
      )
      const data = await response.json()
      
      setExamData(data.output || 'No se pudo generar el examen')
      setIsLoading(false)
      setShowBottomSheet(true)
    } catch (error) {
      console.error('Error en la petición:', error)
      setIsLoading(false)
      Alert.alert('Error', 'No se pudo generar el examen')
    }
  }

    const handleCloseBottomSheet = () => {
    setShowBottomSheet(false)
    setExamData('')
  }

   return (
    <>
      <View style={[styles.container, style]} {...rest}>
        <TouchableOpacity onPress={generateExam}>
          <Animated.View
            style={[heartAnimatedStyle, opacityAnimatedStyle]}
          >
            <Text
              style={[
                styles.option,
                {
                  color: Colors[colorScheme].text,
                  backgroundColor: Colors[colorScheme].header.background,
                  borderColor: Colors[colorScheme].header.border,
                },
              ]}
            >
              Generar examen
            </Text>
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} onPress={toggleMenu}>
          <Animated.View
            style={[styles.button, rotationAnimatedStyle]}
          >
            <Image
              style={styles.image}
              source={require('@/assets/images/droid.png')}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isLoading}
        transparent={true}
        animationType="fade"
      >
        <BlurView intensity={Platform.OS === 'ios' ? 30 : 20}
                        tint={colorScheme === 'dark' ? 'dark' : 'light'}
                        style={[StyleSheet.absoluteFill, {backgroundColor: Colors[colorScheme].backdrop}]}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#016BFF" />
            <Text style={styles.loadingText}>Generando examen...</Text>
          </View>
        </BlurView>
      </Modal>

      <BottomSheet
        isVisible={showBottomSheet}
        onClose={handleCloseBottomSheet}
        colorScheme={colorScheme}
      >
        <View style={styles.bottomSheetContent}>
          <Text style={[styles.title, { color: Colors[colorScheme].text }]}>
            Examen Generado
          </Text>
          <ScrollView style={styles.scrollContainer}>
            <Text style={[styles.examText, { color: Colors[colorScheme].text }]}>
              {examData}
            </Text>
          </ScrollView>
          <TouchableOpacity
            style={styles.copyButton}
            onPress={async () => {
              // Aquí puedes implementar la funcionalidad de copiar
              
               await Clipboard.setStringAsync(examData)
              Alert.alert('Copiado', 'Examen copiado al portapapeles')
            }}
          >
            <Text style={styles.copyButtonText}>Copiar al portapapeles</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    position: 'absolute',
  },
  button: {
    width: 65,
    height: 65,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#016BFF',
  },
  image: {
    width: 40,
    height: 40,
  },
  option: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: -20
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(1, 107, 255, 0.1)',
  },
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 20,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#016BFF',
    fontWeight: '600',
  },
  bottomSheetContent: {
    padding: 20,
    maxHeight: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  scrollContainer: {
    maxHeight: 400,
    marginBottom: 20,
  },
  examText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'monospace',
  },
  copyButton: {
    backgroundColor: '#016BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  copyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
})