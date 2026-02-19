import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FiBriefcase, FiCheckCircle, FiClock, FiTrendingUp, FiArrowRight, FiZap } from 'react-icons/fi'
import api from '../../api/api'
import './UserPages.css'

export default function Dashboard() {
    const { user } = useAuth()
    const [applications, setApplications] = useState([])
    const [notifications, setNotifications] = useState([])
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadDashboard()
    }, [])

    const loadDashboard = async () => {
        try {
            const [appsData, jobsData] = await Promise.all([
                api.get('/users/applications').catch(() => []),
                api.get('/users/jobs/search?page_size=3').catch(() => ({ jobs: [] })),
            ])
            setApplications(Array.isArray(appsData) ? appsData : [])
            setJobs(jobsData?.jobs || [])

            try {
                const notifData = await api.get('/notifications/')
                setNotifications(Array.isArray(notifData) ? notifData : [])
            } catch (_) {
                setNotifications([])
            }
        } catch (err) {
            console.error('Dashboard load error:', err)
        } finally {
            setLoading(false)
        }
    }

    const shortlisted = applications.filter(a => a.status === 'shortlisted').length
    const interviews = applications.filter(a => a.status === 'interview').length

    const stats = [
        { label: 'Applications', value: applications.length, icon: <FiBriefcase />, gradient: 'var(--gradient-primary)', trend: `${applications.length} total`, up: true },
        { label: 'Shortlisted', value: shortlisted, icon: <FiCheckCircle />, gradient: 'var(--gradient-success)', trend: `${shortlisted} active`, up: true },
        { label: 'Interviews', value: interviews, icon: <FiClock />, gradient: 'var(--gradient-secondary)', trend: interviews > 0 ? 'Upcoming' : 'None yet', up: true },
        { label: 'Match Score', value: applications.length > 0 ? `${Math.round(applications.reduce((s, a) => s + (a.matching_score || 0), 0) / applications.length)}%` : '—', icon: <FiTrendingUp />, gradient: 'var(--gradient-warm)', trend: 'Based on resume', up: true },
    ]

    if (loading) {
        return <div className="page-container"><div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>Loading dashboard...</div></div>
    }

    return (
        <div className="page-container">
            {/* Welcome Banner */}
            <div className="welcome-banner">
                <div className="welcome-text">
                    <h1>Welcome back, {user?.name || 'User'}! 👋</h1>
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
                            <h3>{stat.value}</h3>
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
                        {applications.length > 0 ? applications.slice(0, 3).map((app) => (
                            <div className="app-item" key={app.id}>
                                <div className="app-info">
                                    <strong>{app.job_title || 'Job'}</strong>
                                    <span className="app-company">{app.company_name || 'Company'}</span>
                                </div>
                                <span className={`badge badge-${app.status}`}>{app.status}</span>
                            </div>
                        )) : (
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '1rem 0' }}>No applications yet. Start applying!</p>
                        )}
                    </div>
                </div>

                {/* Recommended Jobs */}
                <div className="glass-card">
                    <div className="card-header">
                        <h3>Recommended For You</h3>
                        <Link to="/recommendations" className="btn btn-sm btn-secondary">See All</Link>
                    </div>
                    <div className="app-list">
                        {jobs.length > 0 ? jobs.slice(0, 3).map((job) => (
                            <div className="app-item" key={job.id}>
                                <div className="app-info">
                                    <strong>{job.title}</strong>
                                    <span className="app-company">{job.company_name || 'Company'} · {job.stipend_min ? `₹${job.stipend_min}` : ''}</span>
                                </div>
                                {job.matching_score && <div className="match-badge">{Math.round(job.matching_score)}%</div>}
                            </div>
                        )) : (
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '1rem 0' }}>No jobs available yet.</p>
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
                    {notifications.length > 0 ? notifications.slice(0, 3).map((n) => (
                        <div className={`notif-item ${!n.is_read ? 'unread' : ''}`} key={n.id}>
                            <div className="notif-dot-indicator"></div>
                            <div className="notif-content">
                                <p>{n.message || n.title}</p>
                                <span className="notif-time">{n.created_at ? new Date(n.created_at).toLocaleDateString() : ''}</span>
                            </div>
                        </div>
                    )) : (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '1rem 0' }}>No notifications yet.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
