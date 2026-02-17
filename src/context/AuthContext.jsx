import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('internlink_user')
        return saved ? JSON.parse(saved) : null
    })

    const login = (userData) => {
        setUser(userData)
        localStorage.setItem('internlink_user', JSON.stringify(userData))
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('internlink_user')
    }

    const switchRole = (role) => {
        const updated = { ...user, role }
        setUser(updated)
        localStorage.setItem('internlink_user', JSON.stringify(updated))
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, switchRole }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
