import React, { useEffect } from 'react'
import {
    StyleSheet,
    Text,
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
    withSpring,
    withTiming,
    runOnJS,
} from 'react-native-reanimated'
import { Colors } from '@/constants/Colors'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50

type NewBottomSheetProps = {
    isVisible: boolean
    onClose: () => void
    colorScheme?: ColorSchemeName
}

export default function NewBottomSheet({
                                           isVisible,
                                           onClose,
                                           colorScheme = 'dark',
                                       }: NewBottomSheetProps) {
    const translateY = useSharedValue(0)
    const backdropOpacity = useSharedValue(0)
    const context = useSharedValue({ y: 0 })
    const theme = colorScheme || 'dark'

    const scrollTo = (
        destination: number,
        callback?: () => void
    ) => {
        'worklet'
        translateY.value = withSpring(destination, { damping: 15 })
        backdropOpacity.value = withTiming(
            destination === 0 ? 0 : 1,
            { duration: 300 },
            () => {
                if (callback) runOnJS(callback)()
            }
        )
    }

    const gesture = Gesture.Pan()
        .onStart(() => {
            context.value = { y: translateY.value }
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
        transform: [{ translateY: translateY.value }],
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
                <Animated.View 
                    style={[
                        styles.backdrop, 
                        rBackdropStyle, 
                        { backgroundColor: Colors[theme].backdrop }
                    ]} 
                />
            </TouchableWithoutFeedback>

            <GestureDetector gesture={gesture}>
                <Animated.View 
                    style={[
                        styles.sheet, 
                        rSheetStyle, 
                        { 
                            backgroundColor: Colors[theme].card,
                            borderColor: Colors[theme].border 
                        }
                    ]}
                >
                    <View 
                        style={[
                            styles.line, 
                            { backgroundColor: Colors[theme].line }
                        ]} 
                    />
                    <SafeAreaView style={styles.content}>
                        <Text 
                            style={[
                                styles.title, 
                                { color: Colors[theme].text }
                            ]}
                        >
                            Add new content
                        </Text>
                    </SafeAreaView>
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
    sheet: {
        height: SCREEN_HEIGHT,
        width: '100%',
        position: 'absolute',
        top: SCREEN_HEIGHT,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderWidth: 1,
        zIndex: 20,
    },
    line: {
        width: 75,
        height: 4,
        alignSelf: 'center',
        marginVertical: 15,
        borderRadius: 2,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
})
