import React, { useEffect } from 'react'
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    Dimensions,
    Modal,
    ColorSchemeName,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
    Gesture,
    GestureDetector,
} from 'react-native-gesture-handler'
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    runOnJS,
} from 'react-native-reanimated'
import { BlurView } from 'expo-blur'
import { Colors } from '@/constants/Colors'
import { Radius, Spacing } from '@/constants/Theme'
import { GlassSurface } from './glass-view'

const {height: SCREEN_HEIGHT} = Dimensions.get('window')
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50

type NewBottomSheetProps = {
    isVisible: boolean
    onClose: () => void
    colorScheme?: ColorSchemeName
    children?: React.ReactNode
}

export default function BottomSheet({
                                        isVisible,
                                        onClose,
                                        colorScheme = 'dark',
                                        children
                                    }: NewBottomSheetProps) {
    const translateY = useSharedValue(0)
    const backdropOpacity = useSharedValue(0)
    const context = useSharedValue({y: 0})
    const theme = colorScheme === 'light' ? 'light' : 'dark'

    const scrollTo = (
        destination: number,
        callback?: () => void
    ) => {
        'worklet'
        translateY.value = withTiming(destination, {duration: 320, easing: Easing.out(Easing.cubic)})
        backdropOpacity.value = withTiming(
            destination === 0 ? 0 : 1,
            {duration: 300},
            () => {
                if (callback) runOnJS(callback)()
            }
        )
    }

    const gesture = Gesture.Pan()
        .onStart(() => {
            context.value = {y: translateY.value}
        })
        .onUpdate(event => {
            translateY.value = Math.max(
                Math.min(event.translationY + context.value.y, 0),
                MAX_TRANSLATE_Y
            )
        })
        .onEnd(() => {
            if (translateY.value > -800) {
                scrollTo(0, onClose)
            } else {
                scrollTo(MAX_TRANSLATE_Y)
            }
        })

    const rSheetStyle = useAnimatedStyle(() => ({
        transform: [{translateY: translateY.value}],
    }))
    const rBackdropStyle = useAnimatedStyle(() => ({
        opacity: backdropOpacity.value,
    }))

    useEffect(() => {
        if (isVisible) {
            scrollTo(MAX_TRANSLATE_Y)
        }
    }, [isVisible])

    if (!isVisible) return null

    return (
        <Modal transparent visible={isVisible} animationType="none">
            <TouchableWithoutFeedback onPress={() => scrollTo(0, onClose)}>
                <Animated.View style={[styles.backdrop, rBackdropStyle]}>
                    <BlurView
                        intensity={30}
                        tint={theme}
                        style={[StyleSheet.absoluteFill, {backgroundColor: Colors[theme].backdrop}]}
                    />
                </Animated.View>
            </TouchableWithoutFeedback>

            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.sheetWrapper, rSheetStyle]}>
                    {/* GlassSurface is background-only here, sibling to the scrollable
                        content rather than its container - native GlassView breaks/crashes
                        with scrollable descendants (expo/expo#50097-adjacent reports). */}
                    <View style={[styles.sheet, {borderColor: Colors[theme].border}]}>
                        <GlassSurface tint={theme} radius={0} style={StyleSheet.absoluteFill}/>
                        <View
                            style={[
                                styles.line,
                                {backgroundColor: Colors[theme].line}
                            ]}
                        />
                        <SafeAreaView style={styles.content}>
                            {children}
                        </SafeAreaView>
                    </View>
                </Animated.View>
            </GestureDetector>
        </Modal>
    )
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 1,
    },
    sheetWrapper: {
        height: SCREEN_HEIGHT,
        width: '100%',
        position: 'absolute',
        top: SCREEN_HEIGHT,
        zIndex: 20,
    },
    sheet: {
        flex: 1,
        borderTopLeftRadius: Radius.xxl,
        borderTopRightRadius: Radius.xxl,
        borderWidth: StyleSheet.hairlineWidth,
        overflow: 'hidden',
    },
    line: {
        width: 48,
        height: 5,
        alignSelf: 'center',
        marginVertical: Spacing.md,
        borderRadius: Radius.pill,
    },
    content: {
        flex: 1,
        padding: Spacing.lg,
    },
})