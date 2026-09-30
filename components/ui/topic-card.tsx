import { useEffect, useMemo } from 'react'
import { Text, StyleSheet, Dimensions, View, Pressable } from 'react-native'
import { RelativePathString, router } from 'expo-router'
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming, Easing } from 'react-native-reanimated'
import { TopicWithUsers } from '@/lib/interfaces'
import { generateDeterministicHexColorFromUUID, hexToRgba } from '@/lib/utils'
import { Motion, Radius, Spacing, Typography } from '@/constants/Theme'

const {width} = Dimensions.get('window')

interface TopicCardProps {
    topic: TopicWithUsers
    isMine: boolean
    textColor: string
    index?: number
}

export default function TopicCard({topic, isMine, textColor, index = 0}: TopicCardProps) {
    const hex = useMemo(() => {
        return generateDeterministicHexColorFromUUID(topic.id)
    }, [topic.id])

    const bgColor = useMemo(() => hexToRgba(hex, 0.5), [hex])
    const borderColor = hex

    const scale = useSharedValue(1)
    const entrance = useSharedValue(0)

    useEffect(() => {
        entrance.value = withDelay(
            Math.min(index, 6) * 60,
            withTiming(1, { duration: Motion.durationSlow, easing: Easing.out(Easing.cubic) })
        )
    }, [])

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: entrance.value,
        transform: [
            { translateY: (1 - entrance.value) * 18 },
            { scale: scale.value },
        ],
    }))

    return (
        <Animated.View style={animatedStyle}>
            <Pressable
                onPressIn={() => { scale.value = withSpring(0.97, Motion.spring) }}
                onPressOut={() => { scale.value = withSpring(1, Motion.spring) }}
                style={[styles.card, {backgroundColor: bgColor, borderColor}]}
                onPress={() => router.push(`/topics/${topic.id}` as RelativePathString)}
            >
                <Text style={[styles.owner, {color: textColor, backgroundColor: hex}]}>
                    {isMine ? 'Mi tema' : topic.owner.name}
                </Text>
                <View style={styles.textContainer}>
                    <Text style={[styles.title, {color: textColor}]}>
                        {topic.title}
                    </Text>
                    <Text style={[styles.desc, {color: textColor}]}>
                        {topic.description}
                    </Text>
                </View>
            </Pressable>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    card: {
        width: width * 0.9,
        height: 125,
        borderRadius: Radius.lg,
        padding: Spacing.base,
        marginVertical: Spacing.sm,
        alignSelf: 'center',
        borderWidth: 1,
        position: 'relative',
    },
    owner: {
        position: 'absolute',
        top: Spacing.md,
        right: Spacing.base,
        ...Typography.label,
        fontWeight: '600',
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.sm,
        borderRadius: Radius.xs,
    },
    textContainer: {
        position: 'absolute',
        bottom: Spacing.md,
        left: Spacing.base,
    },
    title: {
        ...Typography.title,
        fontSize: 20,
        marginBottom: Spacing.xs,
    },
    desc: {
        ...Typography.small,
    },
})
