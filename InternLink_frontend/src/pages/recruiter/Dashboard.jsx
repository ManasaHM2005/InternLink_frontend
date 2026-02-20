import { useState } from 'react'
import { mockJobs, mockApplications } from '../../data/mockData'
import { FiBriefcase, FiUsers, FiTrendingUp, FiPlusCircle, FiDownload, FiFilter } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import './RecruiterPages.css'

export default function RecruiterDashboard() {
    const stats = [
        { label: 'Active Listings', value: mockJobs.length, icon: <FiBriefcase />, gradient: 'var(--gradient-primary)' },
        { label: 'Total Applicants', value: 424, icon: <FiUsers />, gradient: 'var(--gradient-success)' },
        { label: 'Shortlisted', value: 56, icon: <FiFilter />, gradient: 'var(--gradient-secondary)' },
        { label: 'Hire Rate', value: '23%', icon: <FiTrendingUp />, gradient: 'var(--gradient-warm)' },
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
                        <Link to="/recruiter/post-job" className="btn btn-sm btn-secondary">Add New</Link>
                    </div>
                    {mockJobs.slice(0, 4).map(job => (
                        <div className="app-item" key={job.id} style={{ marginBottom: '0.5rem' }}>
                            <div className="app-info">
                                <strong>{job.logo} {job.title}</strong>
                                <span className="app-company">{job.applicants} applicants · {job.posted}</span>
                            </div>
                            <span className="badge badge-applied">{job.type}</span>
                        </div>
                    ))}
                </div>

                <div className="glass-card">
                    <div className="card-header">
                        <h3>Recent Applicants</h3>
                        <Link to="/recruiter/applicants" className="btn btn-sm btn-secondary">View All</Link>
                    </div>
                    {['Manasa H M', 'Rahul Kumar', 'Sneha Mehta', 'Ananya Rao'].map((name, i) => (
                        <div className="app-item" key={i} style={{ marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div className="avatar avatar-sm" style={{ background: 'var(--gradient-primary)' }}>{name.charAt(0)}</div>
                                <div className="app-info">
                                    <strong>{name}</strong>
                                    <span className="app-company">Frontend Developer Intern</span>
                                </div>
                            </div>
                            <span className={`badge badge-${['shortlisted', 'applied', 'interview', 'selected'][i]}`}>
                                {['shortlisted', 'applied', 'interview', 'selected'][i]}
                            </span>
                        </div>
                    ))}
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
