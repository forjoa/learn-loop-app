import { useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store'
import { API_URL } from '@/constants/config'

export function useAuth() {
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadUser = async () => {
            const token = await SecureStore.getItemAsync('authToken')
            if (token) {
                setUser({token})
            }
        }

        loadUser()
    }, [])

    const login = async (email: string, password: string) => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password}),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Login failed')
            }

            const data = await response.json()
            const token = data.token

            if (!token) {
                throw new Error('No token received from server')
            }

            await SecureStore.setItemAsync('authToken', token)
            setUser({token})
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
        setUser({})
    }

    return {user, login, register, logout, loading, error}
}
