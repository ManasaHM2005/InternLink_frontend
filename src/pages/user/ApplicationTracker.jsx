import { useState, useEffect } from 'react'
import { FiCheckCircle, FiClock, FiXCircle, FiCalendar, FiAward } from 'react-icons/fi'
import api from '../../api/api'
import './UserPages.css'

const allStatuses = ['applied', 'shortlisted', 'interview', 'selected', 'rejected']
const statusIcons = {
    applied: <FiClock />,
    shortlisted: <FiCheckCircle />,
    interview: <FiCalendar />,
    selected: <FiAward />,
    rejected: <FiXCircle />,
}

export default function ApplicationTracker() {
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadApplications()
    }, [])

    const loadApplications = async () => {
        try {
            const data = await api.get('/users/applications')
            setApplications(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('Failed to load applications:', err)
        } finally {
            setLoading(false)
        }
    }

    const getStepState = (app, stepStatus) => {
        const appIdx = allStatuses.indexOf(app.status)
        const stepIdx = allStatuses.indexOf(stepStatus)
        if (app.status === 'rejected' && stepStatus === 'rejected') return 'rejected'
        if (app.status === 'rejected' && stepIdx > appIdx) return ''
        if (stepIdx < appIdx) return 'completed'
        if (stepIdx === appIdx) return 'active'
        return ''
    }

    if (loading) {
        return <div className="page-container"><div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>Loading applications...</div></div>
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>📋 Application Tracker</h1>
                <p>Track the status of all your applications in real-time</p>
            </div>

            <div className="app-tracker-list">
                {applications.length > 0 ? applications.map((app) => (
                    <div className="tracker-card" key={app.id}>
                        <div className="tracker-header">
                            <div>
                                <strong>{app.job_title || 'Job'}</strong>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                                    {app.company_name || 'Company'} · Applied {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : ''}
                                </div>
                            </div>
                            <span className={`badge badge-${app.status}`}>{app.status}</span>
                        </div>

                        {/* Status Timeline Bar */}
                        <div className="status-timeline">
                            {allStatuses.filter(s => s !== 'rejected' || app.status === 'rejected').map((status) => (
                                <div className={`status-step ${getStepState(app, status)}`} key={status}>
                                    <div className="step-dot">{statusIcons[status]}</div>
                                    <span className="step-label">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                                </div>
                            ))}
                        </div>

                        {app.matching_score && (
                            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                Match Score: <strong style={{ color: 'var(--accent-blue)' }}>{Math.round(app.matching_score)}%</strong>
                            </div>
                        )}
                    </div>
                )) : (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</p>
                        <p>No applications yet. Start applying to jobs!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
