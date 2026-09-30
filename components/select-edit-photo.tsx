import {
    ColorSchemeName,
    Dimensions,
    Image,
    ImageSourcePropType,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import BottomSheet from '@/components/ui/bottom-sheet'
import { Colors } from '@/constants/Colors'
import { Motion, Spacing, Typography } from '@/constants/Theme'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import * as Haptics from 'expo-haptics'

type SelectEditPhotoProps = {
    isVisible: boolean
    onClose: () => void
    colorScheme?: ColorSchemeName
    currentPhoto?: string
    setProfilePhoto: Dispatch<SetStateAction<string | undefined>>
    photos: Record<string, ImageSourcePropType>
}

function PhotoOption({ source, size, isActive, onPress, tint }: { source: ImageSourcePropType, size: number, isActive: boolean, onPress: () => void, tint: 'light' | 'dark' }) {
    const scale = useSharedValue(isActive ? 1.05 : 1)

    useEffect(() => {
        scale.value = withSpring(isActive ? 1.05 : 1, Motion.spring)
    }, [isActive])

    const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))

    return (
        <Animated.View style={animatedStyle}>
            <Pressable
                onPress={onPress}
                style={[
                    styles.item,
                    { width: size, height: size, borderColor: isActive ? Colors[tint].primary : 'transparent' },
                ]}
            >
                <Image
                    source={source}
                    style={[styles.image, { width: size - 8, height: size - 8, borderRadius: (size - 8) / 2 }]}
                />
            </Pressable>
        </Animated.View>
    )
}

export default function SelectEditPhoto({
                                            isVisible,
                                            onClose,
                                            photos,
                                            setProfilePhoto,
                                            currentPhoto,
                                            colorScheme = 'dark',
                                        }: SelectEditPhotoProps) {
    const theme = colorScheme === 'light' ? 'light' : 'dark'
    const [selected, setSelected] = useState<string | undefined>(currentPhoto)

    useEffect(() => {
        setSelected(currentPhoto)
    }, [currentPhoto])

    const photoList = Object.entries(photos).map(([key, source]) => ({key, source}))

    const {width} = Dimensions.get('window')
    const ITEM_SIZE = (width - 40 - 20) / 3

    const handleSelectPhoto = (key: string) => {
        Haptics.selectionAsync()
        setSelected(key)
        setProfilePhoto(key)
    }

    return (
        <BottomSheet isVisible={isVisible} onClose={onClose} colorScheme={theme}>
            <View style={styles.contentContainer}>
                <Text style={[styles.title, {color: Colors[theme].text}]}>
                    Selecciona tu nueva foto de perfil
                </Text>

                <View style={styles.scrollContainer}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.grid}
                    >
                        {photoList.map(({key, source}) => (
                            <PhotoOption
                                key={key}
                                source={source}
                                size={ITEM_SIZE}
                                isActive={key === selected}
                                onPress={() => handleSelectPhoto(key)}
                                tint={theme}
                            />
                        ))}
                    </ScrollView>
                </View>
            </View>
        </BottomSheet>
    )
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        width: '100%',
    },
    title: {
        ...Typography.title,
        marginBottom: Spacing.lg,
        textAlign: 'center',
    },
    scrollContainer: {
        flex: 1,
        height: '100%',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        paddingBottom: Spacing.lg,
    },
    item: {
        marginBottom: Spacing.md,
        borderWidth: 2,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        resizeMode: 'cover',
    },
})
