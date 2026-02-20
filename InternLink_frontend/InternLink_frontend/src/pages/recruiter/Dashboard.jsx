import { useState, useEffect } from 'react'
import { useAuth, API_BASE_URL } from '../../context/AuthContext'
import { FiBriefcase, FiUsers, FiTrendingUp, FiPlusCircle, FiFilter } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import './RecruiterPages.css'

export default function RecruiterDashboard() {
    const { user } = useAuth()
    const [analytics, setAnalytics] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAnalytics()
    }, [])

    const fetchAnalytics = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${API_BASE_URL}/recruiter/analytics`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('internlink_token')}`
                }
            })
            if (!response.ok) throw new Error('Failed to fetch analytics')
            const data = await response.json()
            setAnalytics(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const stats = analytics ? [
        { label: 'Active Listings', value: analytics.active_jobs, icon: <FiBriefcase />, gradient: 'var(--gradient-primary)' },
        { label: 'Total Applicants', value: analytics.total_applications, icon: <FiUsers />, gradient: 'var(--gradient-success)' },
        { label: 'Shortlisted', value: analytics.status_breakdown?.shortlisted || 0, icon: <FiFilter />, gradient: 'var(--gradient-secondary)' },
        { label: 'Avg Apps / Job', value: analytics.avg_applications_per_job, icon: <FiTrendingUp />, gradient: 'var(--gradient-warm)' },
    ] : []

    return (
        <div className="page-container">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>🏢 Recruiter Dashboard</h1>
                    <p>Manage your job listings and applicants</p>
                </div>
                <Link to="/recruiter/post-job" className="btn btn-primary"><FiPlusCircle /> Post New Job</Link>
            </div>

            <div className="grid grid-4 stats-grid">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem', gridColumn: 'span 4' }}>Loading analytics...</div>
                ) : stats.map((stat, i) => (
                    <div className="stat-card" key={i}>
                        <div className="stat-icon" style={{ background: stat.gradient }}>{stat.icon}</div>
                        <div className="stat-info">
                            <h3>{stat.value}</h3>
                            <p>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid">
                <div className="glass-card" style={{ gridColumn: 'span 2' }}>
                    <div className="card-header">
                        <h3>Your Listings</h3>
                        <Link to="/recruiter/post-job" className="btn btn-sm btn-secondary">Add New</Link>
                    </div>
                    {!loading && analytics?.jobs_analytics?.length > 0 ? (
                        analytics.jobs_analytics.slice(0, 5).map(job => (
                            <div className="app-item" key={job.job_id} style={{ marginBottom: '0.5rem' }}>
                                <div className="app-info">
                                    <strong>{job.title}</strong>
                                    <span className="app-company">{job.applications} applicants · Views: {job.views}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <span className={`badge badge-${job.is_active ? 'applied' : 'rejected'}`}>
                                        {job.is_active ? 'Active' : 'Closed'}
                                    </span>
                                    <Link to={`/recruiter/jobs/${job.job_id}/applicants`} className="btn btn-sm btn-primary">View Apps</Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                            No active listings yet.
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Chart Placeholder */}
            <div className="glass-card" style={{ marginTop: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>📊 Application Trends</h3>
                <div className="chart-placeholder">
                    <div className="chart-bars">
                        {[65, 80, 45, 90, 70, 55, 85].map((h, i) => (
                            <div key={i} className="chart-bar-wrapper">
                                <div className="chart-bar" style={{ height: `${h}%` }}></div>
                                <span>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
