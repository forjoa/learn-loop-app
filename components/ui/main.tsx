import { ReactNode, useCallback, useState } from 'react'
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native'

export default function Main({children, onLoad}: { children: ReactNode, onLoad: () => void }) {
    const [refreshing, setRefreshing] = useState(false)

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        onLoad()
        setTimeout(() => {
            setRefreshing(false)
        }, 1000)
    }, [onLoad])

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
                <View style={styles.childrenContainer} key={refreshing ? 'refreshing' : 'not-refreshing'}>
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
        marginBottom: 70
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