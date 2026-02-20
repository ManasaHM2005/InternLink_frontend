import { useState, useEffect } from 'react'
import { FiUsers, FiBriefcase, FiAlertTriangle, FiCheckCircle, FiShield, FiTrendingUp } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import api from '../../api/api'
import './AdminPages.css'

export default function AdminDashboard() {
    const [analytics, setAnalytics] = useState(null)
    const [users, setUsers] = useState([])
    const [disputes, setDisputes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        loadDashboard()
    }, [])

    const loadDashboard = async () => {
        setLoading(true)
        setError('')
        try {
            const [analyticsData, usersData, disputesData] = await Promise.all([
                api.get('/admin/analytics'),
                api.get('/admin/users?page_size=5'),
                api.get('/admin/disputes?status=open')
            ])
            setAnalytics(analyticsData)
            setUsers(usersData)
            setDisputes(disputesData)
        } catch (err) {
            setError(err.message || 'Failed to load admin dashboard')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="page-container"><div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>Loading platform analytics...</div></div>
    }

    const stats = [
        { label: 'Total Users', value: analytics?.total_users || 0, icon: <FiUsers />, gradient: 'var(--gradient-primary)' },
        { label: 'Recruiters', value: analytics?.total_recruiters || 0, icon: <FiBriefcase />, gradient: 'var(--gradient-success)' },
        { label: 'Active Jobs', value: analytics?.active_jobs || 0, icon: <FiCheckCircle />, gradient: 'var(--gradient-secondary)' },
        { label: 'Open Disputes', value: analytics?.open_disputes || 0, icon: <FiAlertTriangle />, gradient: 'var(--gradient-warm)' },
    ]

    return (
        <div className="page-container">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>🛡️ Admin Dashboard</h1>
                    <p>Platform overview and management</p>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={loadDashboard}>Refresh Data</button>
            </div>

            {error && <div className="glass-card" style={{ color: 'var(--accent-red)', padding: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>{error}</div>}

            <div className="grid grid-4 stats-grid">
                {stats.map((s, i) => (
                    <div className="stat-card" key={i}>
                        <div className="stat-icon" style={{ background: s.gradient }}>{s.icon}</div>
                        <div className="stat-info"><h3>{s.value}</h3><p>{s.label}</p></div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid">
                <div className="glass-card">
                    <div className="card-header">
                        <h3>Recent Users</h3>
                        <Link to="/admin/users" className="btn btn-sm btn-secondary">Manage All</Link>
                    </div>
                    {users.length > 0 ? users.slice(0, 5).map(u => (
                        <div className="app-item" key={u.id} style={{ marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div className="avatar avatar-sm" style={{ background: u.role === 'admin' ? 'var(--gradient-warm)' : 'var(--gradient-primary)' }}>{u.email.charAt(0).toUpperCase()}</div>
                                <div className="app-info">
                                    <strong>{u.email.split('@')[0]}</strong>
                                    <span className="app-company">{u.role} · {u.email}</span>
                                </div>
                            </div>
                            <span className={`badge ${u.is_active ? 'badge-selected' : 'badge-rejected'}`}>{u.is_active ? 'Active' : 'Deactivated'}</span>
                        </div>
                    )) : (
                        <p style={{ padding: '1rem', color: 'var(--text-muted)', textAlign: 'center' }}>No users found.</p>
                    )}
                </div>

                <div className="glass-card">
                    <div className="card-header">
                        <h3>Pending Disputes</h3>
                        <Link to="/admin/disputes" className="btn btn-sm btn-secondary">View All</Link>
                    </div>
                    {disputes.length > 0 ? disputes.map(d => (
                        <div className="app-item" key={d.id} style={{ marginBottom: '0.5rem' }}>
                            <div className="app-info">
                                <strong>{d.subject}</strong>
                                <span className="app-company">{d.status} · {new Date(d.created_at).toLocaleDateString()}</span>
                            </div>
                            <span className={`badge badge-rejected`}>Review</span>
                        </div>
                    )) : (
                        <p style={{ padding: '1rem', color: 'var(--text-muted)', textAlign: 'center' }}>No open disputes! 🎉</p>
                    )}
                </div>
            </div>

            {/* Platform Analytics Chart */}
            <div className="glass-card" style={{ marginTop: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>📉 This Month's Activity</h3>
                <div className="grid grid-3" style={{ gap: '1.5rem' }}>
                    <div className="stat-card" style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <div className="stat-info">
                            <h3>+{analytics?.users_this_month || 0}</h3>
                            <p>New Users This Month</p>
                        </div>
                    </div>
                    <div className="stat-card" style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <div className="stat-info">
                            <h3>+{analytics?.jobs_this_month || 0}</h3>
                            <p>New Jobs This Month</p>
                        </div>
                    </div>
                    <div className="stat-card" style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <div className="stat-info">
                            <h3>+{analytics?.applications_this_month || 0}</h3>
                            <p>Applications Sent</p>
                        </div>
                    </div>
                </div>

                {analytics?.top_skills && analytics.top_skills.length > 0 && (
                    <div style={{ marginTop: '2rem' }}>
                        <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>🔥 Top Skills Demanded</h4>
                        <div className="tags-container">
                            {analytics.top_skills.map((s, i) => (
                                <span className="tag" key={i} style={{ padding: '0.4rem 0.8rem' }}>
                                    {s.skill} <span style={{ color: 'var(--accent-blue)', marginLeft: '0.4rem', fontWeight: 'bold' }}>{s.count}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

