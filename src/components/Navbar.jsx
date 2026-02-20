import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiBell, FiLogOut, FiSearch, FiMenu } from 'react-icons/fi'
import api from '../api/api'
import './Navbar.css'

export default function Navbar({ onToggleSidebar }) {
    const { user, logout, switchRole } = useAuth()
    const navigate = useNavigate()
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        const fetchUnread = async () => {
            try {
                const data = await api.get('/notifications/unread-count')
                setUnreadCount(data.unread_count || 0)
            } catch (_) { }
        }
        fetchUnread()
        const interval = setInterval(fetchUnread, 30000) // Polling every 30s
        return () => clearInterval(interval)
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <header className="navbar">
            <div className="navbar-left">
                <button className="menu-toggle" onClick={onToggleSidebar}>
                    <FiMenu />
                </button>
                <div className="search-bar navbar-search">
                    <FiSearch className="search-icon" />
                    <input type="text" placeholder="Search jobs, people, companies..." />
                </div>
            </div>

            <div className="navbar-right">
                <select
                    className="role-switcher"
                    value={user?.role || 'user'}
                    onChange={(e) => switchRole(e.target.value)}
                >
                    <option value="user">👤 User</option>
                    <option value="recruiter">🏢 Recruiter</option>
                    <option value="admin">🛡️ Admin</option>
                </select>

                <button className="nav-icon-btn" onClick={() => navigate('/notifications')} title="Notifications">
                    <FiBell />
                    {unreadCount > 0 && <span className="notif-dot"></span>}
                </button>

                <div className="user-menu">
                    <div className="avatar" style={{ background: 'var(--gradient-primary)' }}>
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="user-name">{user?.name || 'User'}</span>
                </div>

                <button className="nav-icon-btn logout-btn" onClick={handleLogout} title="Logout">
                    <FiLogOut />
                </button>
            </div>
        </header>
    )
}
