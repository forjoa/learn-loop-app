import { ReactNode, useCallback, useState } from 'react'
import { RefreshControl, ScrollView, StyleSheet, useColorScheme, View } from 'react-native'

export default function Main({children}: { children: ReactNode }) {
    const [refreshing, setRefreshing] = useState(false)

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        setTimeout(() => {
            setRefreshing(false)
        }, 1000)
    }, [])
    const colorScheme = useColorScheme() || 'dark'
    return (
        <View style={styles.titleContainer}>
            <ScrollView
                contentContainerStyle={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }
            >
                {children}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 8,
        padding: 18,
        width: '100%',
        flex: 1
    },
    scrollView: {
        flex: 1,
        width: '100%',
    },
})