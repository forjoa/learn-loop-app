import { Tabs } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Feather from '@expo/vector-icons/Feather'

import { Colors } from '@/constants/Colors'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors['dark'].tint,
        headerShown: false,
        tabBarStyle: styles.nav,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: () => <Feather name="home" size={24} color="#50545D" />,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: '',
          tabBarIcon: () => (
            <Feather name="message-circle" size={24} color="#50545D" />
          ),
        }}
      />
      <Tabs.Screen
        name="new"
        options={{
          title: '',
          tabBarIcon: () => (
            <View style={styles.newButton}>
              <Feather name="plus" size={30} color="#fff" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: '',
          tabBarIcon: () => <Feather name="bell" size={24} color="#50545D" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: () => <Feather name="user" size={24} color="#50545D" />,
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  nav: {
    backgroundColor: '#1F1F21',
    color: '#50545D',
    paddingTop: 12,
    borderTopWidth: 2,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderColor: '#353638',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    position: 'absolute',
  },
  newButton: {
    backgroundColor: '#016BFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#4090FF',
  },
})
