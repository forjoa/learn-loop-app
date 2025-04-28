import {
    StyleSheet,
    Text,
    ColorSchemeName,
} from 'react-native'
import { Colors } from '@/constants/Colors'
import BottomSheet from '@/components/ui/bottom-sheet'

type NewBottomSheetProps = {
    isVisible: boolean
    onClose: () => void
    colorScheme?: ColorSchemeName
}

export default function NewContent({
                                           isVisible,
                                           onClose,
                                           colorScheme = 'dark',
                                       }: NewBottomSheetProps) {
    const theme = colorScheme || 'dark'

    return (
        <BottomSheet isVisible={isVisible} onClose={onClose} colorScheme={colorScheme}>
            <Text
                style={[
                    styles.title,
                    {color: Colors[theme].text}
                ]}
            >
                Add new content
            </Text>
        </BottomSheet>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
})
