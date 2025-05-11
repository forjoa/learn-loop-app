import { useMemo } from 'react'
import { Text, StyleSheet, Dimensions, View, TouchableOpacity } from 'react-native'
import { RelativePathString, router } from 'expo-router'
import { TopicWithUsers } from '@/lib/interfaces'
import { generateDeterministicHexColorFromUUID, hexToRgba } from '@/lib/utils'

const {width} = Dimensions.get('window')

interface TopicCardProps {
    topic: TopicWithUsers
    isMine: boolean
    textColor: string
}

export default function TopicCard({topic, isMine, textColor}: TopicCardProps) {
    const hex = useMemo(() => {
        return generateDeterministicHexColorFromUUID(topic.id)
    }, [topic.id])

    const bgColor = useMemo(() => hexToRgba(hex, 0.5), [hex])
    const borderColor = hex

    return (
        <TouchableOpacity
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
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        width: width * 0.9,
        height: 125,
        borderRadius: 16,
        padding: 16,
        marginVertical: 8,
        alignSelf: 'center',
        borderWidth: 1,
        position: 'relative',
    },
    owner: {
        position: 'absolute',
        top: 12,
        right: 16,
        fontSize: 12,
        fontWeight: '600',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8,
    },
    textContainer: {
        position: 'absolute',
        bottom: 12,
        left: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    desc: {
        fontSize: 14,
        lineHeight: 20,
    },
})