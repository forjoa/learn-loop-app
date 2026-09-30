import React from 'react'
import { ActivityIndicator, Pressable, StyleSheet, Text, useColorScheme, ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { Colors } from '@/constants/Colors'
import { Motion, Radius, Spacing, Typography } from '@/constants/Theme'

type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps {
    label: string
    onPress: () => void
    variant?: Variant
    disabled?: boolean
    loading?: boolean
    style?: ViewStyle
    icon?: React.ReactNode
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export function Button({ label, onPress, variant = 'primary', disabled, loading, style, icon }: ButtonProps) {
    const theme = useColorScheme() === 'light' ? 'light' : 'dark'
    const scale = useSharedValue(1)

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }))

    const palette = Colors[theme]
    const variantStyle: ViewStyle =
        variant === 'primary'
            ? { backgroundColor: palette.primary }
            : variant === 'secondary'
                ? { backgroundColor: palette.secondary.background, borderWidth: 1, borderColor: palette.secondary.border }
                : { backgroundColor: 'transparent' }

    const textColor = variant === 'primary' ? '#fff' : variant === 'secondary' ? palette.secondary.text : palette.primary

    return (
        <AnimatedPressable
            disabled={disabled || loading}
            onPressIn={() => {
                scale.value = withSpring(Motion.pressScale, Motion.spring)
            }}
            onPressOut={() => {
                scale.value = withSpring(1, Motion.spring)
            }}
            onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                onPress()
            }}
            style={[
                styles.base,
                variantStyle,
                disabled && { opacity: 0.5 },
                animatedStyle,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={textColor} />
            ) : (
                <>
                    {icon}
                    <Text style={[styles.label, { color: textColor }]}>{label}</Text>
                </>
            )}
        </AnimatedPressable>
    )
}

const styles = StyleSheet.create({
    base: {
        minHeight: 52,
        borderRadius: Radius.pill,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: Spacing.sm,
        paddingHorizontal: Spacing.lg,
    },
    label: {
        ...Typography.bodyStrong,
    },
})
