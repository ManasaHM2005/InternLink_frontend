import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, API_BASE_URL } from '../../context/AuthContext'
import { FiBriefcase, FiCheckCircle, FiClock, FiTrendingUp, FiArrowRight, FiZap } from 'react-icons/fi'
import './UserPages.css'

export default function Dashboard() {
    const { user } = useAuth()
    const [applications, setApplications] = useState([])
    const [jobs, setJobs] = useState([])
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)

    const token = localStorage.getItem('internlink_token')
    const headers = { Authorization: `Bearer ${token}` }

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true)
            try {
                const [appsRes, jobsRes, notifsRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/users/applications`, { headers }),
                    fetch(`${API_BASE_URL}/users/jobs/search?page_size=3`, { headers }),
                    fetch(`${API_BASE_URL}/notifications?page_size=3`, { headers }),
                ])

                if (appsRes.ok) setApplications(await appsRes.json())
                if (jobsRes.ok) {
                    const data = await jobsRes.json()
                    setJobs(data.jobs || [])
                }
                if (notifsRes.ok) setNotifications(await notifsRes.json())
            } catch (err) {
                console.error('Dashboard fetch error:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchAll()
    }, [])

    const stats = [
        { label: 'Applications', value: applications.length, icon: <FiBriefcase />, gradient: 'var(--gradient-primary)', trend: 'total', up: true },
        { label: 'Shortlisted', value: applications.filter(a => a.status === 'shortlisted').length, icon: <FiCheckCircle />, gradient: 'var(--gradient-success)', trend: 'shortlisted', up: true },
        { label: 'Interviews', value: applications.filter(a => a.status === 'interview_scheduled').length, icon: <FiClock />, gradient: 'var(--gradient-secondary)', trend: 'upcoming', up: true },
        { label: 'Match Score', value: '—', icon: <FiTrendingUp />, gradient: 'var(--gradient-warm)', trend: 'upload resume', up: true },
    ]

    return (
        <div className="page-container">
            {/* Welcome Banner */}
            <div className="welcome-banner">
                <div className="welcome-text">
                    <h1>Welcome back, {user?.name || user?.email?.split('@')[0] || 'User'}! 👋</h1>
                    <p>Here's what's happening with your job search today.</p>
                </div>
                <Link to="/jobs" className="btn btn-primary">
                    <FiZap /> Explore Jobs <FiArrowRight />
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-4 stats-grid">
                {stats.map((stat, i) => (
                    <div className="stat-card" key={i}>
                        <div className="stat-icon" style={{ background: stat.gradient }}>{stat.icon}</div>
                        <div className="stat-info">
                            <h3>{loading ? '…' : stat.value}</h3>
                            <p>{stat.label}</p>
                            <span className={`trend ${stat.up ? 'up' : 'down'}`}>{stat.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Two Column Layout */}
            <div className="dashboard-grid">
                {/* Recent Applications */}
                <div className="glass-card">
                    <div className="card-header">
                        <h3>Recent Applications</h3>
                        <Link to="/applications" className="btn btn-sm btn-secondary">View All</Link>
                    </div>
                    <div className="app-list">
                        {loading ? (
                            <p style={{ color: 'var(--text-muted)', padding: '1rem' }}>Loading…</p>
                        ) : applications.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', padding: '1rem' }}>No applications yet. <Link to="/jobs">Browse jobs →</Link></p>
                        ) : (
                            applications.slice(0, 3).map((app) => (
                                <div className="app-item" key={app.id}>
                                    <div className="app-info">
                                        <strong>{app.job_title}</strong>
                                        <span className="app-company">{app.company_name}</span>
                                    </div>
                                    <span className={`badge badge-${app.status}`}>{app.status}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recommended Jobs */}
                <div className="glass-card">
                    <div className="card-header">
                        <h3>Recommended For You</h3>
                        <Link to="/jobs" className="btn btn-sm btn-secondary">See All</Link>
                    </div>
                    <div className="app-list">
                        {loading ? (
                            <p style={{ color: 'var(--text-muted)', padding: '1rem' }}>Loading…</p>
                        ) : jobs.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', padding: '1rem' }}>No jobs available yet.</p>
                        ) : (
                            jobs.slice(0, 3).map((job) => (
                                <div className="app-item" key={job.id}>
                                    <div className="app-info">
                                        <strong>🏢 {job.title}</strong>
                                        <span className="app-company">{job.company_name} · ₹{job.stipend_min?.toLocaleString()}/mo</span>
                                    </div>
                                    <div className="match-badge">{job.job_type}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Latest Notifications */}
            <div className="glass-card" style={{ marginTop: '1.5rem' }}>
                <div className="card-header">
                    <h3>Recent Notifications</h3>
                    <Link to="/notifications" className="btn btn-sm btn-secondary">View All</Link>
                </div>
                <div className="notif-list">
                    {loading ? (
                        <p style={{ color: 'var(--text-muted)', padding: '1rem' }}>Loading…</p>
                    ) : notifications.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', padding: '1rem' }}>No notifications yet.</p>
                    ) : (
                        notifications.slice(0, 3).map((n) => (
                            <div className={`notif-item ${!n.is_read ? 'unread' : ''}`} key={n.id}>
                                <div className="notif-dot-indicator"></div>
                                <div className="notif-content">
                                    <p>{n.message}</p>
                                    <span className="notif-time">{new Date(n.created_at).toLocaleString()}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
