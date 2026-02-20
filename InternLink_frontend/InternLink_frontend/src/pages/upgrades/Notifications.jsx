import { useState, useEffect } from 'react'
import { useAuth, API_BASE_URL } from '../../context/AuthContext'
import { FiBriefcase, FiCalendar, FiZap, FiUsers, FiSettings, FiBell } from 'react-icons/fi'
import './UpgradePages.css'

const typeIcons = {
    application: { icon: <FiBriefcase />, bg: 'var(--gradient-primary)' },
    application_update: { icon: <FiBriefcase />, bg: 'var(--gradient-primary)' },
    interview: { icon: <FiCalendar />, bg: 'var(--gradient-secondary)' },
    interview_scheduled: { icon: <FiCalendar />, bg: 'var(--gradient-secondary)' },
    recommendation: { icon: <FiZap />, bg: 'var(--gradient-success)' },
    new_follower: { icon: <FiUsers />, bg: 'var(--gradient-warm)' },
    new_like: { icon: <FiUsers />, bg: 'var(--gradient-warm)' },
    new_comment: { icon: <FiUsers />, bg: 'var(--gradient-warm)' },
    new_share: { icon: <FiUsers />, bg: 'var(--gradient-warm)' },
    system: { icon: <FiSettings />, bg: 'linear-gradient(135deg, #64748b, #475569)' },
}

export default function Notifications() {
    const { } = useAuth()
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')

    const token = localStorage.getItem('internlink_token')
    const headers = { Authorization: `Bearer ${token}` }

    const fetchNotifications = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE_URL}/notifications?page_size=50`, { headers })
            if (res.ok) setNotifications(await res.json())
        } catch (err) {
            console.error('Notifications fetch error:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNotifications()
    }, [])

    const markAllRead = async () => {
        try {
            await fetch(`${API_BASE_URL}/notifications/read-all`, { method: 'PUT', headers })
            setNotifications(notifications.map(n => ({ ...n, is_read: true })))
        } catch (err) {
            console.error('Mark all read error:', err)
        }
    }

    const markRead = async (id) => {
        try {
            await fetch(`${API_BASE_URL}/notifications/${id}/read`, { method: 'PUT', headers })
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n))
        } catch (err) {
            console.error('Mark read error:', err)
        }
    }

    const filtered = filter === 'all'
        ? notifications
        : filter === 'unread'
            ? notifications.filter(n => !n.is_read)
            : notifications.filter(n => n.notification_type === filter)

    return (
        <div className="page-container">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>🔔 Notifications</h1>
                    <p>Stay updated with your activity</p>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={markAllRead}>Mark all as read</button>
            </div>

            <div className="tabs" style={{ maxWidth: '600px' }}>
                {['all', 'unread', 'application_update', 'interview_scheduled', 'new_follower'].map(f => (
                    <button key={f} className={`tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                        {f === 'all' ? 'All' : f === 'unread' ? 'Unread' : f === 'application_update' ? 'Applications' : f === 'interview_scheduled' ? 'Interviews' : 'Social'}
                    </button>
                ))}
            </div>

            <div className="notif-page-list">
                {loading ? (
                    <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading notifications…</p>
                ) : filtered.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No notifications</p>
                ) : (
                    filtered.map(n => {
                        const typeInfo = typeIcons[n.notification_type] || typeIcons.system
                        return (
                            <div
                                className={`notif-page-item ${!n.is_read ? 'unread' : ''}`}
                                key={n.id}
                                onClick={() => !n.is_read && markRead(n.id)}
                                style={{ cursor: !n.is_read ? 'pointer' : 'default' }}
                            >
                                <div className="notif-type-icon" style={{ background: typeInfo.bg, color: 'white' }}>
                                    {typeInfo.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    {n.title && <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.1rem' }}>{n.title}</p>}
                                    <p style={{ fontSize: '0.875rem', marginBottom: '0.15rem' }}>{n.message}</p>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        {new Date(n.created_at).toLocaleString()}
                                    </span>
                                </div>
                                {!n.is_read && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-blue)', flexShrink: 0 }}></div>}
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
