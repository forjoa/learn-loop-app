import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/Colors';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors['dark'].tint,
        headerShown: false,
        tabBarStyle: styles.nav,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  nav: {
    backgroundColor: '#1F1F21',
    color: '#50545D',
    overflow: 'hidden',
    paddingTop: 12,
    borderTopWidth: 2,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderColor: '#353638',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    position: 'absolute'
  }
})