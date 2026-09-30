import { NativeTabs } from 'expo-router/unstable-native-tabs'
import { useState } from 'react'
import { useColorScheme } from 'react-native'
import { Colors } from '@/constants/Colors'
import { useNotificationCount } from '@/hooks/useNotificationCount'
import { TabBarContext } from '@/contexts/TabBarContext'

export default function TabLayout() {
  const colorScheme = useColorScheme() === 'light' ? 'light' : 'dark'
  const notificationCount = useNotificationCount()
  const [isTabBarHidden, setIsTabBarHidden] = useState(false)

  return (
    <TabBarContext.Provider value={{ setIsTabBarHidden }}>
    <NativeTabs tintColor={Colors[colorScheme].tint} hidden={isTabBarHidden}>
      <NativeTabs.Trigger name="(home)">
        <NativeTabs.Trigger.Label>Inicio</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(chats)">
        <NativeTabs.Trigger.Label>Chats</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="message.fill" md="chat" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(notifications)">
        <NativeTabs.Trigger.Label>Alertas</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="bell.fill" md="notifications" />
        {notificationCount > 0 && (
          <NativeTabs.Trigger.Badge>
            {notificationCount > 9 ? '9+' : String(notificationCount)}
          </NativeTabs.Trigger.Badge>
        )}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(profile)">
        <NativeTabs.Trigger.Label>Perfil</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.fill" md="person" />
      </NativeTabs.Trigger>
    </NativeTabs>
    </TabBarContext.Provider>
  )
}
