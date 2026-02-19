import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('internlink_user')
        return saved ? JSON.parse(saved) : null
    })

    const [token, setToken] = useState(() => {
        return localStorage.getItem('internlink_token') || null
    })

    const login = (userData, accessToken) => {
        setUser(userData)
        setToken(accessToken)
        localStorage.setItem('internlink_user', JSON.stringify(userData))
        localStorage.setItem('internlink_token', accessToken)
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('internlink_user')
        localStorage.removeItem('internlink_token')
    }

    const switchRole = (role) => {
        const updated = { ...user, role }
        setUser(updated)
        localStorage.setItem('internlink_user', JSON.stringify(updated))
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, switchRole }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
