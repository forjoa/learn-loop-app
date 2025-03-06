import { StyleSheet, Text, View } from 'react-native'

import { SafeAreaView } from 'react-native-safe-area-context'

export default function ChatsScreen() {
  return (
    <SafeAreaView>
      <View>
        <Text style={styles.title}>Chats page</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  title: {
    color: '#fff',
  },
})
