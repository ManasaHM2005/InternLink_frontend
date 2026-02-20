import { useState } from 'react'
import { mockJobs } from '../../data/mockData'
import './AdminPages.css'

export default function ApproveInternships() {
    const [jobs, setJobs] = useState(mockJobs.map(j => ({ ...j, approval: 'pending' })))

    const updateApproval = (id, approval) => {
        setJobs(jobs.map(j => j.id === id ? { ...j, approval } : j))
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>✅ Approve Internships</h1>
                <p>Review and approve/reject internship listings</p>
            </div>

            <div className="glass-card admin-table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Company</th>
                            <th>Location</th>
                            <th>Type</th>
                            <th>Stipend</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map(j => (
                            <tr key={j.id}>
                                <td><strong style={{ color: 'var(--text-primary)' }}>{j.logo} {j.title}</strong></td>
                                <td>{j.company}</td>
                                <td>{j.location}</td>
                                <td>{j.type}</td>
                                <td>{j.stipend}</td>
                                <td>
                                    <span className={`badge ${j.approval === 'approved' ? 'badge-selected' : j.approval === 'rejected' ? 'badge-rejected' : 'badge-pending'}`}>
                                        {j.approval}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-btns">
                                        {j.approval === 'pending' && (
                                            <>
                                                <button className="action-btn approve" onClick={() => updateApproval(j.id, 'approved')}>Approve</button>
                                                <button className="action-btn reject" onClick={() => updateApproval(j.id, 'rejected')}>Reject</button>
                                            </>
                                        )}
                                        {j.approval !== 'pending' && <button className="action-btn view" onClick={() => updateApproval(j.id, 'pending')}>Reset</button>}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
