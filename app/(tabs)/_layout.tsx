import { Tabs } from 'expo-router'
import React, { useState } from 'react'
import { StyleSheet, View, Pressable } from 'react-native'
import Feather from '@expo/vector-icons/Feather'

import { Colors } from '@/constants/Colors'
import NewBottomSheet from '@/components/NewBottomSheet'

export default function TabLayout() {
    const [isNewBottomSheetVisible, setIsNewBottomSheetVisible] = useState(false)

    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: Colors['dark'].tint,
                    headerShown: true,
                    tabBarStyle: styles.nav,
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({focused}) => <Feather name="home" size={24}
                                                            color={focused ? Colors['dark'].tabIconSelected : '#50545D'}/>,
                    }}
                />
                <Tabs.Screen
                    name="chats"
                    options={{
                        title: 'Chats',
                        tabBarIcon: ({focused}) => (
                            <Feather name="message-circle" size={24}
                                     color={focused ? Colors['dark'].tabIconSelected : '#50545D'}/>
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
                        title: '',
                        tabBarIcon: () => (
                            <View style={styles.newButton}>
                                <Feather name="plus" size={30} color="#fff"/>
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="notifications"
                    options={{
                        title: 'Notificaciones',
                        tabBarIcon: ({focused}) => <Feather name="bell" size={24}
                                                            color={focused ? Colors['dark'].tabIconSelected : '#50545D'}/>,
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Profile',
                        tabBarIcon: ({focused}) => <Feather name="user" size={24}
                                                            color={focused ? Colors['dark'].tabIconSelected : '#50545D'}/>,
                    }}
                />
            </Tabs>

            <NewBottomSheet
                isVisible={isNewBottomSheetVisible}
                onClose={() => setIsNewBottomSheetVisible(false)}
            />
        </>
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
        marginBottom: 24
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
