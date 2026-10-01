import React from 'react'
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native'
import { BlurView } from 'expo-blur'
import { GlassView as NativeGlassView, isGlassEffectAPIAvailable } from 'expo-glass-effect'
import { Radius } from '@/constants/Theme'

interface GlassSurfaceProps extends ViewProps {
    tint?: 'light' | 'dark'
    radius?: number
    intensity?: number
    borderColor?: string
    bordered?: boolean
    children?: React.ReactNode
}

// isLiquidGlassAvailable() is a compile-time check and can report true on iOS 26
// betas where the native UIGlassEffect selector isn't actually there yet (crashes -
// see expo/expo#40911). isGlassEffectAPIAvailable() is the runtime-safe check Expo
// recommends instead. Screens must also never animate opacity on a GlassSurface or
// any of its ancestors (expo/expo#50097) - use transform-only entrance animations.
const nativeGlassAvailable = isGlassEffectAPIAvailable()

/**
 * Cross-platform "glass" surface: real Apple Liquid Glass on iOS 26+,
 * a blur + tint + hairline-border approximation everywhere else
 * (older iOS, Android) so the look stays consistent without requiring
 * a custom dev client.
 */
export function GlassSurface({
    tint = 'dark',
    radius = Radius.lg,
    intensity = 40,
    borderColor,
    bordered = true,
    style,
    children,
    ...rest
}: GlassSurfaceProps) {
    if (nativeGlassAvailable) {
        return (
            <NativeGlassView
                glassEffectStyle="regular"
                style={[{ borderRadius: radius, overflow: 'hidden' }, style as ViewStyle]}
                {...rest}
            >
                {children}
            </NativeGlassView>
        )
    }

    const overlayColor = tint === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.35)'
    const resolvedBorder = borderColor ?? (tint === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.5)')

    return (
        <View style={[{ borderRadius: radius, overflow: 'hidden' }, style as ViewStyle]} {...rest}>
            <BlurView
                intensity={intensity}
                tint={tint}
                style={StyleSheet.absoluteFill}
            />
            <View
                style={[
                    StyleSheet.absoluteFill,
                    {
                        backgroundColor: overlayColor,
                        borderRadius: radius,
                        ...(bordered
                            ? { borderWidth: StyleSheet.hairlineWidth * 2, borderColor: resolvedBorder }
                            : null),
                    },
                ]}
            />
            {children}
        </View>
    )
}

export const isGlassNative = nativeGlassAvailable
