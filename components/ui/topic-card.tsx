import { useMemo } from 'react'
import { Text, StyleSheet, Dimensions, View, TouchableOpacity } from 'react-native'
import { RelativePathString, router } from 'expo-router'
import { TopicWithUsers } from '@/lib/interfaces'

const {width} = Dimensions.get('window')

const generateDeterministicHexColorFromUUID = (uuid: string): string => {
    let hash = 0
    for (let i = 0; i < uuid.length; i++) {
        const char = uuid.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
    }

    const p1 = 131
    const p2 = 173
    const p3 = 211
    const xor1 = 0x5A5A5A
    const xor2 = 0xA5A5A5
    const xor3 = 0xCACACA

    const positiveHash = Math.abs(hash || 1)
    let r_val = (positiveHash * p1) ^ xor1
    let g_val = (positiveHash * p2) ^ xor2
    let b_val = (positiveHash * p3) ^ xor3

    const r = (r_val & 0xFF) % 156 + 80
    const g = (g_val & 0xFF) % 156 + 80
    const b = (b_val & 0xFF) % 156 + 80

    const toHexComponent = (c: number): string => {
        const hex = Math.max(0, Math.min(255, Math.floor(c))).toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }

    return `#${toHexComponent(r)}${toHexComponent(g)}${toHexComponent(b)}`
}

const hexToRgba = (hex: string, alpha: number): string => {
    const bigint = parseInt(hex.slice(1), 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

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
});