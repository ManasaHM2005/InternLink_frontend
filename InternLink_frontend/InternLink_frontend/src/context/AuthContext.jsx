import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const API_BASE_URL = 'http://127.0.0.1:8000'

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const savedUser = localStorage.getItem('internlink_user')
        const token = localStorage.getItem('internlink_token')
        if (savedUser && token) {
            setUser(JSON.parse(savedUser))
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.detail || 'Login failed')
        }

        const data = await response.json()
        const userData = { id: data.user_id, email, role: data.role }
        setUser(userData)
        localStorage.setItem('internlink_token', data.access_token)
        localStorage.setItem('internlink_user', JSON.stringify(userData))
        return userData
    }

    const register = async (email, password, role) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role }),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.detail || 'Registration failed')
        }

        const data = await response.json()
        const userData = { id: data.user_id, email, role: data.role }
        setUser(userData)
        localStorage.setItem('internlink_token', data.access_token)
        localStorage.setItem('internlink_user', JSON.stringify(userData))
        return userData
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('internlink_user')
        localStorage.removeItem('internlink_token')
    }

    const switchRole = (role) => {
        const updated = { ...user, role }
        setUser(updated)
        localStorage.setItem('internlink_user', JSON.stringify(updated))
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, switchRole }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
