import { StyleSheet, Text, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationScreen() {
  return (
      <SafeAreaView>
        <View>
          <Text style={styles.title}>
            Profile page
          </Text>
        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  title: {
    color: '#fff'
  }
});
