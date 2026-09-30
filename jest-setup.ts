// The installed react-native-worklets (0.10.x) hardcodes IS_JEST to false in its
// native-platform checker, so requiring the real library under jest-expo still runs
// native turbo-module init and crashes. A hand-rolled mock sidesteps that entirely -
// it only needs to cover the reanimated APIs this app actually imports.
jest.mock('react-native-reanimated', () => {
    const React = require('react')
    const { View, Text, ScrollView, Image, FlatList } = require('react-native')

    const useSharedValue = (initial: unknown) => React.useRef({ value: initial }).current

    const useAnimatedStyle = (factory: () => Record<string, unknown>) => factory()

    const identity = (toValue: unknown) => toValue

    const interpolate = (value: number, input: number[], output: number[]) => {
        if (value <= input[0]) return output[0]
        if (value >= input[input.length - 1]) return output[output.length - 1]
        for (let i = 1; i < input.length; i++) {
            if (value <= input[i]) {
                const t = (value - input[i - 1]) / (input[i] - input[i - 1])
                return output[i - 1] + t * (output[i] - output[i - 1])
            }
        }
        return output[output.length - 1]
    }

    const Easing = {
        ease: (t: number) => t,
        cubic: (t: number) => t,
        out: (fn: (t: number) => number) => fn,
        in: (fn: (t: number) => number) => fn,
        bezier: () => (t: number) => t,
    }

    const Animated = {
        View,
        Text,
        ScrollView,
        Image,
        FlatList,
        createAnimatedComponent: (Component: unknown) => Component,
    }

    return {
        __esModule: true,
        default: Animated,
        useSharedValue,
        useAnimatedStyle,
        withSpring: identity,
        withTiming: identity,
        withDelay: (_delay: number, toValue: unknown) => toValue,
        runOnJS: (fn: (...args: unknown[]) => void) => fn,
        interpolate,
        Extrapolation: { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' },
        Easing,
        createAnimatedComponent: (Component: unknown) => Component,
    }
})

jest.mock('expo-haptics', () => ({
    impactAsync: jest.fn(),
    notificationAsync: jest.fn(),
    selectionAsync: jest.fn(),
    ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
    NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' },
}))
