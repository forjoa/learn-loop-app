import React, { useEffect, useRef } from 'react'
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { Colors } from '@/constants/Colors'
import { Motion, Radius, Spacing, Typography } from '@/constants/Theme'

interface Option<T extends string> {
    label: string
    value: T
}

interface SegmentedControlProps<T extends string> {
    options: Option<T>[]
    value: T
    onChange: (value: T) => void
    tint: 'light' | 'dark'
}

export function SegmentedControl<T extends string>({ options, value, onChange, tint }: SegmentedControlProps<T>) {
    const layouts = useRef<Record<string, { x: number, width: number }>>({})
    const indicatorX = useSharedValue(0)
    const indicatorWidth = useSharedValue(0)

    const indicatorStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: indicatorX.value }],
        width: indicatorWidth.value,
    }))

    const moveTo = (key: string) => {
        const layout = layouts.current[key]
        if (layout) {
            indicatorX.value = withSpring(layout.x, Motion.springSoft)
            indicatorWidth.value = withSpring(layout.width, Motion.springSoft)
        }
    }

    useEffect(() => {
        moveTo(value)
    }, [value])

    const onOptionLayout = (key: string) => (e: LayoutChangeEvent) => {
        const { x, width } = e.nativeEvent.layout
        layouts.current[key] = { x, width }
        if (key === value) {
            indicatorX.value = x
            indicatorWidth.value = width
        }
    }

    return (
        <View style={[styles.track, { backgroundColor: Colors[tint].input }]}>
            <Animated.View style={[styles.indicator, indicatorStyle, { backgroundColor: Colors[tint].primary }]} />
            {options.map((option) => (
                <Pressable
                    key={option.value}
                    style={styles.option}
                    onLayout={onOptionLayout(option.value)}
                    onPress={() => {
                        Haptics.selectionAsync()
                        onChange(option.value)
                    }}
                >
                    <Text
                        style={[
                            styles.label,
                            { color: value === option.value ? '#fff' : Colors[tint].textSecondary },
                        ]}
                    >
                        {option.label}
                    </Text>
                </Pressable>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    track: {
        flexDirection: 'row',
        borderRadius: Radius.pill,
        padding: 4,
        position: 'relative',
    },
    indicator: {
        position: 'absolute',
        top: 4,
        bottom: 4,
        left: 0,
        borderRadius: Radius.pill,
    },
    option: {
        flex: 1,
        paddingVertical: Spacing.md,
        alignItems: 'center',
        zIndex: 1,
    },
    label: {
        ...Typography.body,
        fontWeight: '600',
    },
})
