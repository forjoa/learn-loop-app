import { Colors } from '@/constants/Colors'
import { Motion, Radius, Spacing, Typography } from '@/constants/Theme'
import { GlassSurface } from './ui/glass-view'
import { Button } from './ui/button'
import React, { useState } from 'react'
import {
    ActivityIndicator,
    Alert,
  Image,
  Modal,
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
import * as Haptics from 'expo-haptics'
import BottomSheet from './ui/bottom-sheet'
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
  const colorScheme = useColorScheme() === 'light' ? 'light' : 'dark'
  const animation = useSharedValue(0)

  const rotationAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: withSpring(isOpen ? '360deg' : '0deg', Motion.spring),
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
          scale: withSpring(animation.value, Motion.spring),
        },
        {
          translateY: withSpring(translateYAnimation, Motion.spring),
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
      opacity: withSpring(opacityAnimation, Motion.spring),
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
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
        <View style={[StyleSheet.absoluteFill, styles.loadingBackdrop, {backgroundColor: Colors[colorScheme].backdrop}]}>
          <GlassSurface tint={colorScheme} radius={Radius.xl} style={styles.loadingCard}>
            <ActivityIndicator size="large" color={Colors[colorScheme].primary} />
            <Text style={[styles.loadingText, { color: Colors[colorScheme].text }]}>Generando examen...</Text>
          </GlassSurface>
        </View>
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
          <Button
            label="Copiar al portapapeles"
            onPress={async () => {
              await Clipboard.setStringAsync(examData)
              Alert.alert('Copiado', 'Examen copiado al portapapeles')
            }}
          />
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
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#016BFF',
  },
  image: {
    width: 40,
    height: 40,
  },
  option: {
    padding: Spacing.sm,
    borderWidth: 1,
    borderRadius: Radius.md,
    marginBottom: -20
  },
  loadingBackdrop: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  loadingText: {
    ...Typography.bodyStrong,
  },
  bottomSheetContent: {
    padding: Spacing.lg,
    maxHeight: '80%',
    gap: Spacing.md,
  },
  title: {
    ...Typography.title,
    textAlign: 'center',
  },
  scrollContainer: {
    maxHeight: 400,
  },
  examText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'monospace',
  },
})