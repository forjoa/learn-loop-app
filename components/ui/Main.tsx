import { ReactNode, useCallback, useState } from 'react'
import { RefreshControl, ScrollView, StyleSheet, useColorScheme, View } from 'react-native'
import { Colors } from '@/constants/Colors'

export default function Main({children}: { children: ReactNode }) {
    const [refreshing, setRefreshing] = useState(false)
    const colorScheme = useColorScheme() || 'dark'

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        setTimeout(() => {
            setRefreshing(false)
        }, 1000)
    }, [])

    return (
        <View style={styles.titleContainer}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }
                horizontal={false}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
                <View style={styles.childrenContainer}>
                    {children}
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        flex: 1,
        padding: 18,
        width: '100%',
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
        width: '100%',
    },
    childrenContainer: {
        flex: 1,
        width: '100%',
    },
})