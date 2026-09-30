import React from 'react'
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native'
import { BlurView } from 'expo-blur'
import { GlassView as NativeGlassView } from 'expo-glass-effect'
import { Radius } from '@/constants/Theme'

interface GlassSurfaceProps extends ViewProps {
    tint?: 'light' | 'dark'
    radius?: number
    intensity?: number
    borderColor?: string
    bordered?: boolean
    children?: React.ReactNode
}

// Disabled for now: expo-glass-effect's native GlassView (iOS 26's brand-new
// Liquid Glass API) has been unreliable on first mount (renders without its
// border/background until the screen is revisited) — likely a beta-era native
// rendering bug per Expo's own docs warning. The BlurView-based fallback below
// is more mature and consistent, so we use it everywhere until that matures.
const nativeGlassAvailable = false

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
