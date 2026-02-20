import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { mockJobs, mockApplications, mockNotifications } from '../../data/mockData'
import { FiBriefcase, FiCheckCircle, FiClock, FiTrendingUp, FiArrowRight, FiZap } from 'react-icons/fi'
import './UserPages.css'

export default function Dashboard() {
    const { user } = useAuth()
    const stats = [
        { label: 'Applications', value: mockApplications.length, icon: <FiBriefcase />, gradient: 'var(--gradient-primary)', trend: '+2 this week', up: true },
        { label: 'Shortlisted', value: mockApplications.filter(a => a.status === 'shortlisted').length, icon: <FiCheckCircle />, gradient: 'var(--gradient-success)', trend: '+1 this week', up: true },
        { label: 'Interviews', value: mockApplications.filter(a => a.status === 'interview').length, icon: <FiClock />, gradient: 'var(--gradient-secondary)', trend: 'Upcoming', up: true },
        { label: 'Match Score', value: '85%', icon: <FiTrendingUp />, gradient: 'var(--gradient-warm)', trend: '+5% improved', up: true },
    ]

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
                        {mockApplications.slice(0, 3).map((app) => (
                            <div className="app-item" key={app.id}>
                                <div className="app-info">
                                    <strong>{app.jobTitle}</strong>
                                    <span className="app-company">{app.company}</span>
                                </div>
                                <span className={`badge badge-${app.status}`}>{app.status}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recommended Jobs */}
                <div className="glass-card">
                    <div className="card-header">
                        <h3>Recommended For You</h3>
                        <Link to="/recommendations" className="btn btn-sm btn-secondary">See All</Link>
                    </div>
                    <div className="app-list">
                        {mockJobs.slice(0, 3).map((job) => (
                            <div className="app-item" key={job.id}>
                                <div className="app-info">
                                    <strong>{job.logo} {job.title}</strong>
                                    <span className="app-company">{job.company} · {job.stipend}</span>
                                </div>
                                <div className="match-badge">{job.matchScore}%</div>
                            </div>
                        ))}
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
                    {mockNotifications.slice(0, 3).map((n) => (
                        <div className={`notif-item ${!n.read ? 'unread' : ''}`} key={n.id}>
                            <div className="notif-dot-indicator"></div>
                            <div className="notif-content">
                                <p>{n.message}</p>
                                <span className="notif-time">{n.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
