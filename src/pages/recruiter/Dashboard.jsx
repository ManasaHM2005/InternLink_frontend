import { useState, useEffect } from 'react'
import { FiBriefcase, FiUsers, FiTrendingUp, FiPlusCircle, FiFilter, FiEye } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import api from '../../api/api'
import './RecruiterPages.css'

export default function RecruiterDashboard() {
    const [analytics, setAnalytics] = useState(null)
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        loadDashboard()
    }, [])

    const loadDashboard = async () => {
        try {
            const [analyticsData, jobsData] = await Promise.all([
                api.get('/recruiter/analytics'),
                api.get('/recruiter/jobs')
            ])
            setAnalytics(analyticsData)
            setJobs(jobsData)
        } catch (err) {
            setError(err.message || 'Failed to load dashboard')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="page-container"><div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>Loading recruiter dashboard...</div></div>
    }

    const stats = [
        { label: 'Active Listings', value: analytics?.active_jobs || 0, icon: <FiBriefcase />, gradient: 'var(--gradient-primary)' },
        { label: 'Total Applicants', value: analytics?.total_applications || 0, icon: <FiUsers />, gradient: 'var(--gradient-success)' },
        { label: 'Profile Views', value: analytics?.total_views || 0, icon: <FiEye />, gradient: 'var(--gradient-secondary)' },
        { label: 'Avg Apps/Job', value: analytics?.avg_applications_per_job || 0, icon: <FiTrendingUp />, gradient: 'var(--gradient-warm)' },
    ]

    return (
        <div className="page-container">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>🏢 Recruiter Dashboard</h1>
                    <p>Manage your job listings and applicants</p>
                </div>
                <Link to="/recruiter/post-job" className="btn btn-primary"><FiPlusCircle /> Post New Job</Link>
            </div>

            {error && <div className="glass-card" style={{ color: 'var(--accent-red)', padding: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>{error}</div>}

            <div className="grid grid-4 stats-grid">
                {stats.map((stat, i) => (
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
                <div className="glass-card">
                    <div className="card-header">
                        <h3>Active Listings</h3>
                        <Link to="/recruiter/jobs" className="btn btn-sm btn-secondary">Manage All</Link>
                    </div>
                    {jobs.length > 0 ? jobs.slice(0, 4).map(job => (
                        <div className="app-item" key={job.id} style={{ marginBottom: '0.5rem', padding: '1rem' }}>
                            <div className="app-info">
                                <strong>💼 {job.title}</strong>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    {job.location} · {job.job_type}
                                </div>
                            </div>
                            <Link to={`/recruiter/applicants?job_id=${job.id}`} className="badge badge-applied" style={{ textDecoration: 'none' }}>
                                View Applicants
                            </Link>
                        </div>
                    )) : (
                        <p style={{ padding: '1rem', color: 'var(--text-muted)', textAlign: 'center' }}>No jobs posted yet.</p>
                    )}
                </div>

                <div className="glass-card">
                    <div className="card-header">
                        <h3>Status Breakdown</h3>
                        <div className="btn btn-sm btn-secondary">Live Stats</div>
                    </div>
                    <div style={{ padding: '0.5rem' }}>
                        {analytics?.status_breakdown && Object.keys(analytics.status_breakdown).length > 0 ? (
                            Object.entries(analytics.status_breakdown).map(([status, count]) => (
                                <div className="app-item" key={status} style={{ marginBottom: '0.5rem' }}>
                                    <div className="app-info">
                                        <strong style={{ textTransform: 'capitalize' }}>{status.replace('_', ' ')}</strong>
                                    </div>
                                    <span className={`badge badge-${status}`}>{count}</span>
                                </div>
                            ))
                        ) : (
                            <p style={{ padding: '1rem', color: 'var(--text-muted)', textAlign: 'center' }}>No applications received yet.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Chart Placeholder */}
            <div className="glass-card" style={{ marginTop: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>📊 Job Performance</h3>
                <div className="chart-placeholder">
                    <div className="chart-bars">
                        {analytics?.jobs_analytics?.slice(0, 7).map((job, i) => (
                            <div key={job.job_id} className="chart-bar-wrapper">
                                <div className="chart-bar" style={{ height: `${Math.min(job.applications * 10, 100)}%` }}></div>
                                <span title={job.title}>{job.title.substring(0, 6)}...</span>
                            </div>
                        )) || [65, 80, 45, 90, 70, 55, 85].map((h, i) => (
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

