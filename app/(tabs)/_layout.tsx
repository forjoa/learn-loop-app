import { Tabs, usePathname } from 'expo-router'
import React, { useState } from 'react'
import { Image, StyleSheet, Text, View, useColorScheme } from 'react-native'
import Feather from '@expo/vector-icons/Feather'

import { Colors } from '@/constants/Colors'
import NewContent from '@/components/new-content'
import Constants from 'expo-constants'

export default function TabLayout() {
  const [isNewBottomSheetVisible, setIsNewBottomSheetVisible] = useState(false)
  const colorScheme = useColorScheme() || 'dark'
  const pathname = usePathname()
  const isChatScreen = pathname.startsWith('/chat/')

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme].tint,
          headerShown: !isChatScreen,
          header: () => (
            <View
              style={[
                styles.header,
                {
                  backgroundColor: Colors[colorScheme].header.background,
                  borderColor: Colors[colorScheme].header.border,
                },
              ]}
            >
              <Image
                style={styles.image}
                source={require('@/assets/images/droid.png')}
              />
              <Text
                style={[
                  styles.headerTitle,
                  { color: Colors[colorScheme].header.text },
                ]}
              >
                Learn Loop
              </Text>
            </View>
          ),
          tabBarStyle: [
            styles.nav,
            {
              backgroundColor: Colors[colorScheme].nav.background,
              borderColor: Colors[colorScheme].nav.border,
              display: isChatScreen ? 'none' : 'flex',
            },
          ],
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            animation: 'shift',
            title: 'Inicio',
            tabBarIcon: ({ focused }) => (
              <Feather
                name="home"
                size={24}
                color={
                  focused
                    ? Colors[colorScheme].tabIconSelected
                    : Colors[colorScheme].tabIconDefault
                }
              />
            ),
          }}
        />
        <Tabs.Screen
          name="chats"
          options={{
            animation: 'shift',
            title: 'Chats',
            tabBarIcon: ({ focused }) => (
              <Feather
                name="message-circle"
                size={24}
                color={
                  focused
                    ? Colors[colorScheme].tabIconSelected
                    : Colors[colorScheme].tabIconDefault
                }
              />
            ),
          }}
        />
        <Tabs.Screen
          name="new"
          listeners={{
            tabPress: (e) => {
              e.preventDefault()
              setIsNewBottomSheetVisible(true)
            },
          }}
          options={{
            animation: 'shift',
            title: '',
            tabBarIcon: () => (
              <View
                style={[
                  styles.newButton,
                  {
                    backgroundColor: Colors[colorScheme].newButton.background,
                    borderColor: Colors[colorScheme].newButton.border,
                  },
                ]}
              >
                <Feather name="plus" size={30} color="#fff" />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            animation: 'shift',
            title: 'Notificaciones',
            tabBarIcon: ({ focused }) => (
              <Feather
                name="bell"
                size={24}
                color={
                  focused
                    ? Colors[colorScheme].tabIconSelected
                    : Colors[colorScheme].tabIconDefault
                }
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            animation: 'shift',
            title: 'Perfil',
            tabBarIcon: ({ focused }) => (
              <Feather
                name="user"
                size={24}
                color={
                  focused
                    ? Colors[colorScheme].tabIconSelected
                    : Colors[colorScheme].tabIconDefault
                }
              />
            ),
          }}
        />

        <Tabs.Screen
          name="topics/[id]"
          options={{
            href: null,
            animation: 'shift',
            transitionSpec: {
              animation: 'timing',
              config: {
                duration: 300,
              },
            },
          }}
        />

        <Tabs.Screen
          name="chat/[id]"
          options={{
            href: null,
            animation: 'shift',
            transitionSpec: {
              animation: 'timing',
              config: {
                duration: 300,
              },
            },
          }}
        />
      </Tabs>

      <NewContent
        isVisible={isNewBottomSheetVisible}
        onClose={() => setIsNewBottomSheetVisible(false)}
        colorScheme={colorScheme}
      />
    </>
  )
}

const styles = StyleSheet.create({
  nav: {
    height: 85,
    paddingTop: 7,
    borderTopWidth: 2,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    position: 'absolute',
  },
  newButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 5,
    elevation: 5,
    borderWidth: 1,
  },
  image: {
    width: 50,
    height: 50,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    overflow: 'hidden',
    paddingTop: Constants.statusBarHeight,
    padding: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
  },
})
