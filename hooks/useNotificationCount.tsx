import { useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store'
import { API_URL } from '@/constants/config'
import { useAuth } from '@/hooks/useAuth'

export function useNotificationCount() {
    const { user } = useAuth()
    const [count, setCount] = useState(0)

    useEffect(() => {
        const load = async () => {
            if (!user) return
            const token = await SecureStore.getItemAsync('authToken')
            const response = await fetch(`${API_URL}/users/${user.id}/notifications`, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            })
            const data = await response.json()
            setCount(Array.isArray(data) ? data.length : 0)
        }

        load()
    }, [user])

    return count
}
