import { useState, useEffect } from 'react'
import { useAuth, API_BASE_URL } from '../../context/AuthContext'
import './AdminPages.css'

export default function ApproveInternships() {
    const { user } = useAuth()
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPendingJobs()
    }, [])

    const fetchPendingJobs = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${API_BASE_URL}/admin/jobs/pending`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('internlink_token')}`
                }
            })
            if (!response.ok) throw new Error('Failed to fetch pending jobs')
            const data = await response.json()
            setJobs(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const updateApproval = async (id, isApproved) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/jobs/${id}/approve`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('internlink_token')}`
                },
                body: JSON.stringify({ is_approved: isApproved, notes: isApproved ? 'Approved by admin' : 'Rejected by admin' })
            })
            if (!response.ok) throw new Error('Update failed')
            setJobs(jobs.filter(j => j.id !== id))
        } catch (err) {
            alert(err.message)
        }
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
                        {loading ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Loading pending listings...</td></tr>
                        ) : jobs.map(j => (
                            <tr key={j.id}>
                                <td><strong style={{ color: 'var(--text-primary)' }}>{j.title}</strong></td>
                                <td>{j.company_name}</td>
                                <td>{j.location}</td>
                                <td>{j.job_type}</td>
                                <td>{j.stipend_min} - {j.stipend_max}</td>
                                <td>
                                    <span className="badge badge-pending">Pending</span>
                                </td>
                                <td>
                                    <div className="action-btns">
                                        <button className="action-btn approve" onClick={() => updateApproval(j.id, true)}>Approve</button>
                                        <button className="action-btn reject" onClick={() => updateApproval(j.id, false)}>Reject</button>
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
