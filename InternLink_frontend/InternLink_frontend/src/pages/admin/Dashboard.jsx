import { useState, useEffect } from 'react'
import { useAuth, API_BASE_URL } from '../../context/AuthContext'
import { FiUsers, FiBriefcase, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import './AdminPages.css'

export default function AdminDashboard() {
    const { user } = useAuth()
    const [analytics, setAnalytics] = useState(null)
    const [disputes, setDisputes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [analyticsRes, disputesRes] = await Promise.all([
                fetch(`${API_BASE_URL}/admin/analytics`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('internlink_token')}` }
                }),
                fetch(`${API_BASE_URL}/admin/disputes?status=open`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('internlink_token')}` }
                })
            ])

            if (analyticsRes.ok) setAnalytics(await analyticsRes.json())
            if (disputesRes.ok) setDisputes(await disputesRes.json())
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const stats = analytics ? [
        { label: 'Total Users', value: analytics.total_users, icon: <FiUsers />, gradient: 'var(--gradient-primary)' },
        { label: 'Recruiters', value: analytics.total_recruiters, icon: <FiBriefcase />, gradient: 'var(--gradient-success)' },
        { label: 'Active Jobs', value: analytics.active_jobs, icon: <FiCheckCircle />, gradient: 'var(--gradient-secondary)' },
        { label: 'Open Disputes', value: analytics.open_disputes, icon: <FiAlertTriangle />, gradient: 'var(--gradient-warm)' },
    ] : []

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>🛡️ Admin Dashboard</h1>
                <p>Platform overview and management</p>
            </div>

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
                        <h3>Quick Administration</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0.5rem 0' }}>
                        <Link to="/admin/users" className="btn btn-secondary" style={{ justifyContent: 'center' }}>Manage Users</Link>
                        <Link to="/admin/recruiters" className="btn btn-secondary" style={{ justifyContent: 'center' }}>Manage Recruiters</Link>
                        <Link to="/admin/internships" className="btn btn-secondary" style={{ justifyContent: 'center' }}>Approve Listings</Link>
                        <Link to="/admin/disputes" className="btn btn-secondary" style={{ justifyContent: 'center' }}>Resolve Disputes</Link>
                    </div>
                </div>

                <div className="glass-card">
                    <div className="card-header">
                        <h3>Open Disputes</h3>
                        <Link to="/admin/disputes" className="btn btn-sm btn-secondary">View All</Link>
                    </div>
                    {!loading && disputes.length > 0 ? (
                        disputes.slice(0, 4).map(d => (
                            <div className="app-item" key={d.id} style={{ marginBottom: '0.5rem' }}>
                                <div className="app-info">
                                    <strong>{d.subject}</strong>
                                    <span className="app-company">Status: {d.status} · {new Date(d.created_at).toLocaleDateString()}</span>
                                </div>
                                <span className={`badge badge-${d.status === 'open' ? 'applied' : 'selected'}`}>{d.status}</span>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>{loading ? 'Loading...' : 'No open disputes.'}</p>
                    )}
                </div>
            </div>

            <div className="glass-card" style={{ marginTop: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>📈 Platform Growth</h3>
                <div className="admin-chart">
                    <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        Live growth data tracking enabled. View detailed trends in Analytics report.
                    </p>
                </div>
            </div>
        </div>
    )
}
