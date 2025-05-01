import { useLocalSearchParams } from 'expo-router'
import { Text, StyleSheet, useColorScheme } from 'react-native'
import Main from '@/components/ui/main'
import { Colors } from '@/constants/Colors'

export default function TopicDetails() {
    const {id} = useLocalSearchParams()
    const theme = useColorScheme() || 'dark'

    return (
        <Main>
            <Text style={[{color: Colors[theme].text}]}>Topic details {id}</Text>
        </Main>
    )
}

const styles = StyleSheet.create({})
