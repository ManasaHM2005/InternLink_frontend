import { useState } from 'react'
import { mockNotifications } from '../../data/mockData'
import { FiBriefcase, FiCalendar, FiZap, FiUsers, FiSettings, FiBell } from 'react-icons/fi'
import './UpgradePages.css'

const typeIcons = {
    application: { icon: <FiBriefcase />, bg: 'var(--gradient-primary)' },
    interview: { icon: <FiCalendar />, bg: 'var(--gradient-secondary)' },
    recommendation: { icon: <FiZap />, bg: 'var(--gradient-success)' },
    social: { icon: <FiUsers />, bg: 'var(--gradient-warm)' },
    system: { icon: <FiSettings />, bg: 'linear-gradient(135deg, #64748b, #475569)' },
}

export default function Notifications() {
    const [notifications, setNotifications] = useState(mockNotifications)
    const [filter, setFilter] = useState('all')

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })))
    }

    const filtered = filter === 'all'
        ? notifications
        : filter === 'unread'
            ? notifications.filter(n => !n.read)
            : notifications.filter(n => n.type === filter)

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
                {['all', 'unread', 'application', 'interview', 'recommendation', 'social'].map(f => (
                    <button key={f} className={`tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            <div className="notif-page-list">
                {filtered.map(n => {
                    const typeInfo = typeIcons[n.type] || typeIcons.system
                    return (
                        <div className={`notif-page-item ${!n.read ? 'unread' : ''}`} key={n.id}>
                            <div className="notif-type-icon" style={{ background: typeInfo.bg, color: 'white' }}>
                                {typeInfo.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '0.875rem', marginBottom: '0.15rem' }}>{n.message}</p>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.time}</span>
                            </div>
                            {!n.read && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-blue)', flexShrink: 0 }}></div>}
                        </div>
                    )
                })}
                {filtered.length === 0 && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No notifications</p>}
            </div>
        </div>
    )
}
