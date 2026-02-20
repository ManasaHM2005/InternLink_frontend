import { useState, useEffect } from 'react'
import { useAuth, API_BASE_URL } from '../../context/AuthContext'
import { FiCheckCircle, FiClock, FiXCircle, FiCalendar, FiAward } from 'react-icons/fi'
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
    const { user } = useAuth()
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchApplications()
    }, [])

    const fetchApplications = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${API_BASE_URL}/users/applications`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('internlink_token')}`
                }
            })
            if (!response.ok) throw new Error('Failed to fetch applications')
            const apps = await response.json()

            // Fetch history for each app to populate timeline
            const appsWithHistory = await Promise.all(apps.map(async (app) => {
                const trackRes = await fetch(`${API_BASE_URL}/users/applications/${app.id}/track`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('internlink_token')}`
                    }
                })
                if (trackRes.ok) {
                    const trackData = await trackRes.json()
                    return { ...app, timeline: trackData.status_history }
                }
                return { ...app, timeline: [] }
            }))

            setApplications(appsWithHistory)
        } catch (err) {
            console.error(err)
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

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>📋 Application Tracker</h1>
                <p>Track the status of all your applications in real-time</p>
            </div>

            <div className="app-tracker-list">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>Loading applications...</div>
                ) : applications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        <p style={{ fontSize: '2rem' }}>📋</p>
                        <p>No applications found. Start applying!</p>
                    </div>
                ) : applications.map((app) => (
                    <div className="tracker-card" key={app.id}>
                        <div className="tracker-header">
                            <div>
                                <strong>{app.job_title}</strong>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                                    {app.company_name} · Applied {new Date(app.applied_at).toLocaleDateString()}
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

                        {/* Detail Timeline */}
                        <div className="timeline-details">
                            {app.timeline?.map((t, i) => (
                                <div className="timeline-detail-item" key={i}>
                                    <div className="dot"></div>
                                    <span className="date">{new Date(t.changed_at).toLocaleDateString()}</span>
                                    <span><strong>{t.new_status.toUpperCase()}</strong>: {t.notes}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
