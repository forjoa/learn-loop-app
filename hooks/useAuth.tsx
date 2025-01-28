import { useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store'

export function useAuth() {
    const [user, setUser] = useState({})

    useEffect(() => {
        const loadUser = async () => {
            const token = await SecureStore.getItemAsync('authToken')
            if (token) {
                setUser({ token })
            }
        }

        loadUser()
    }, [])

    const login = async (email: string, password: string) => {
        // logic to user login
        const token = 'fake-token'
        await SecureStore.setItemAsync('authToken', token)
        setUser({ token })
    }

    const logout = async () => {
        await SecureStore.deleteItemAsync('authToken')
        setUser({})
    }

    return { user, login, logout }
}