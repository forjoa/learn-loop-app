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
import BottomSheet from '@/components/ui/bottom-sheet'
import { Colors } from '@/constants/Colors'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

type SelectEditPhotoProps = {
    isVisible: boolean
    onClose: () => void
    colorScheme?: ColorSchemeName
    currentPhoto?: string
    setProfilePhoto: Dispatch<SetStateAction<string | undefined>>
    photos: Record<string, ImageSourcePropType>
}

export default function SelectEditPhoto({
                                            isVisible,
                                            onClose,
                                            photos,
                                            setProfilePhoto,
                                            currentPhoto,
                                            colorScheme = 'dark',
                                        }: SelectEditPhotoProps) {
    const theme = colorScheme || 'dark'
    const [selected, setSelected] = useState<string | undefined>(currentPhoto)

    useEffect(() => {
        setSelected(currentPhoto)
    }, [currentPhoto])

    const photoList = Object.entries(photos).map(([key, source]) => ({key, source}))

    const {width} = Dimensions.get('window')
    const ITEM_SIZE = (width - 40 - 20) / 3

    const handleSelectPhoto = (key: string) => {
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
                        {photoList.map(({key, source}) => {
                            const isActive = key === selected
                            return (
                                <Pressable
                                    key={key}
                                    onPress={() => handleSelectPhoto(key)}
                                    style={[
                                        styles.item,
                                        {
                                            width: ITEM_SIZE,
                                            height: ITEM_SIZE,
                                            borderColor: isActive
                                                ? Colors[theme].primary
                                                : 'transparent',
                                        },
                                    ]}
                                >
                                    <Image
                                        source={source}
                                        style={[
                                            styles.image,
                                            {
                                                width: ITEM_SIZE - 8,
                                                height: ITEM_SIZE - 8,
                                                borderRadius: (ITEM_SIZE - 8) / 2,
                                            },
                                        ]}
                                    />
                                </Pressable>
                            )
                        })}
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
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
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
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    item: {
        marginBottom: 10,
        borderWidth: 2,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        resizeMode: 'cover',
    },
})