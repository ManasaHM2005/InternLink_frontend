import { mockApplications } from '../../data/mockData'
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
                {mockApplications.map((app) => (
                    <div className="tracker-card" key={app.id}>
                        <div className="tracker-header">
                            <div>
                                <strong>{app.jobTitle}</strong>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                                    {app.company} · Applied {app.appliedDate}
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
                            {app.timeline.map((t, i) => (
                                <div className="timeline-detail-item" key={i}>
                                    <div className="dot"></div>
                                    <span className="date">{t.date}</span>
                                    <span>{t.note}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
