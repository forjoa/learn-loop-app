import { useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store'
import { API_URL } from '@/constants/config'
import { User } from '@/lib/interfaces'

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = await SecureStore.getItemAsync('authToken')
                if (!token) {
                    setLoading(false)
                    return
                }

                const response = await fetch(`${API_URL}/auth/me/${token}`)
                const data = await response.json()

                if (!data['data']) {
                    setLoading(false)
                    return
                } else {
                    const user: User = data['data']['user']
                    setUser(user)
                }
            } catch (err) {
                await SecureStore.deleteItemAsync('authToken')
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        loadUser()
    }, [])

    const login = async (email: string, password: string) => {
        try {
            setLoading(true)
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password}),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Login failed')
            }

            const data = await response.json()
            await SecureStore.setItemAsync('authToken', data.token)
            await SecureStore.setItemAsync('authUser', JSON.stringify(data.user))
            setUser(data.user)

            return {success: true}
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
            setError(errorMessage)
            return {success: false, error: errorMessage}
        } finally {
            setLoading(false)
        }
    }

    const register = async (name: string, email: string, password: string, role: string, photo: string) => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name, email, password, role, photo}),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Registration failed')
            }

            const data = await response.json()
            return {success: true}
        } catch (err) {
            console.error(err)
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
            setError(errorMessage)
            return {success: false, error: errorMessage}
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        await SecureStore.deleteItemAsync('authToken')
        setUser(null)
    }

    return {user, login, register, logout, loading, error}
}
