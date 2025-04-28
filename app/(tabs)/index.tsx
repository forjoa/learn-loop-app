import { StyleSheet, Text, useColorScheme } from 'react-native'

import { Colors } from '@/constants/Colors'
import Main from '@/components/ui/main'

export default function HomeScreen() {
    const colorScheme = useColorScheme() || 'dark'

    return (
        <Main>
            <Text style={[{color: Colors[colorScheme].text}]}>Aquí encontrarás todos tus temas.</Text>
        </Main>
    )
}

const styles = StyleSheet.create({})
