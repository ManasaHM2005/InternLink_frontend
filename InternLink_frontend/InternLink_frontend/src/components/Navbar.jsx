import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, API_BASE_URL } from '../context/AuthContext'
import { FiBell, FiLogOut, FiSearch, FiMenu } from 'react-icons/fi'
import './Navbar.css'

export default function Navbar({ onToggleSidebar }) {
    const { user, logout, switchRole } = useAuth()
    const navigate = useNavigate()
    const [unreadCount, setUnreadCount] = useState(0)

    const token = localStorage.getItem('internlink_token')

    useEffect(() => {
        if (!token) return
        const fetchUnread = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    setUnreadCount(data.unread_count || 0)
                }
            } catch (err) {
                // Silently ignore — non-critical
            }
        }
        fetchUnread()
        // Poll every 60 seconds for new notifications
        const interval = setInterval(fetchUnread, 60000)
        return () => clearInterval(interval)
    }, [token])

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
                </select>

                <button className="nav-icon-btn" onClick={() => navigate('/notifications')} title="Notifications">
                    <FiBell />
                    {unreadCount > 0 && <span className="notif-dot"></span>}
                </button>

                <div className="user-menu">
                    <div className="avatar" style={{ background: 'var(--gradient-primary)' }}>
                        {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                    <span className="user-name">{user?.name || user?.email?.split('@')[0] || 'User'}</span>
                </div>

                <button className="nav-icon-btn logout-btn" onClick={handleLogout} title="Logout">
                    <FiLogOut />
                </button>
            </div>
        </header>
    )
}
