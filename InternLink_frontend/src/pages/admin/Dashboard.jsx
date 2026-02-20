import { mockUsers, mockRecruiters, mockDisputes, mockJobs } from '../../data/mockData'
import { FiUsers, FiBriefcase, FiAlertTriangle, FiTrendingUp, FiCheckCircle } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import './AdminPages.css'

export default function AdminDashboard() {
    const stats = [
        { label: 'Total Users', value: mockUsers.length, icon: <FiUsers />, gradient: 'var(--gradient-primary)' },
        { label: 'Recruiters', value: mockRecruiters.length, icon: <FiBriefcase />, gradient: 'var(--gradient-success)' },
        { label: 'Active Jobs', value: mockJobs.length, icon: <FiCheckCircle />, gradient: 'var(--gradient-secondary)' },
        { label: 'Open Disputes', value: mockDisputes.filter(d => d.status !== 'resolved').length, icon: <FiAlertTriangle />, gradient: 'var(--gradient-warm)' },
    ]

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
                        <h3>Recent Users</h3>
                        <Link to="/admin/users" className="btn btn-sm btn-secondary">Manage</Link>
                    </div>
                    {mockUsers.slice(0, 4).map(u => (
                        <div className="app-item" key={u.id} style={{ marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div className="avatar avatar-sm" style={{ background: 'var(--gradient-primary)' }}>{u.name.charAt(0)}</div>
                                <div className="app-info"><strong>{u.name}</strong><span className="app-company">{u.email}</span></div>
                            </div>
                            <span className={`badge ${u.status === 'active' ? 'badge-selected' : 'badge-rejected'}`}>{u.status}</span>
                        </div>
                    ))}
                </div>

                <div className="glass-card">
                    <div className="card-header">
                        <h3>Open Disputes</h3>
                        <Link to="/admin/disputes" className="btn btn-sm btn-secondary">View All</Link>
                    </div>
                    {mockDisputes.map(d => (
                        <div className="app-item" key={d.id} style={{ marginBottom: '0.5rem' }}>
                            <div className="app-info"><strong>{d.title}</strong><span className="app-company">by {d.reporter} · {d.date}</span></div>
                            <span className={`badge ${d.status === 'open' ? 'badge-applied' : d.status === 'investigating' ? 'badge-interview' : 'badge-selected'}`}>{d.status}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Platform Analytics Chart */}
            <div className="glass-card" style={{ marginTop: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>📈 Platform Growth</h3>
                <div className="admin-chart">
                    <div className="growth-bars">
                        {[
                            { month: 'Sep', users: 40, jobs: 20 },
                            { month: 'Oct', users: 55, jobs: 30 },
                            { month: 'Nov', users: 65, jobs: 45 },
                            { month: 'Dec', users: 70, jobs: 50 },
                            { month: 'Jan', users: 85, jobs: 60 },
                            { month: 'Feb', users: 95, jobs: 75 },
                        ].map((d, i) => (
                            <div key={i} className="growth-bar-group">
                                <div className="bar-pair">
                                    <div className="growth-bar users-bar" style={{ height: `${d.users}%` }}></div>
                                    <div className="growth-bar jobs-bar" style={{ height: `${d.jobs}%` }}></div>
                                </div>
                                <span>{d.month}</span>
                            </div>
                        ))}
                    </div>
                    <div className="chart-legend">
                        <span><span className="legend-dot" style={{ background: 'var(--accent-blue)' }}></span> Users</span>
                        <span><span className="legend-dot" style={{ background: 'var(--accent-purple)' }}></span> Jobs</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
