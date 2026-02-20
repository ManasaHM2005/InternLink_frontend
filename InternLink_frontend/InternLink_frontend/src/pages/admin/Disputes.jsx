import { useState, useEffect } from 'react'
import { useAuth, API_BASE_URL } from '../../context/AuthContext'
import './AdminPages.css'

export default function Disputes() {
    const { user } = useAuth()
    const [disputes, setDisputes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDisputes()
    }, [])

    const fetchDisputes = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${API_BASE_URL}/admin/disputes`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('internlink_token')}`
                }
            })
            if (!response.ok) throw new Error('Failed to fetch disputes')
            const data = await response.json()
            setDisputes(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const updateStatus = async (id, status) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/disputes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('internlink_token')}`
                },
                body: JSON.stringify({ status, admin_notes: `Status changed to ${status}` })
            })
            if (!response.ok) throw new Error('Update failed')
            setDisputes(disputes.map(d => d.id === id ? { ...d, status } : d))
        } catch (err) {
            alert(err.message)
        }
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>⚠️ Handle Disputes</h1>
                <p>Manage and resolve platform disputes</p>
            </div>

            <div className="glass-card admin-table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Reporter</th>
                            <th>Against</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading disputes...</td></tr>
                        ) : disputes.map(d => (
                            <tr key={d.id}>
                                <td><strong style={{ color: 'var(--text-primary)' }}>{d.subject}</strong></td>
                                <td>User ID: {d.filed_by}</td>
                                <td>{d.against_user ? `User ID: ${d.against_user}` : 'N/A'}</td>
                                <td>{new Date(d.created_at).toLocaleDateString()}</td>
                                <td>
                                    <span className={`badge ${d.status === 'open' ? 'badge-applied' : d.status === 'under_review' ? 'badge-interview' : 'badge-selected'}`}>
                                        {d.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-btns">
                                        {d.status === 'open' && <button className="action-btn warn" onClick={() => updateStatus(d.id, 'under_review')}>Investigate</button>}
                                        {d.status === 'under_review' && <button className="action-btn approve" onClick={() => updateStatus(d.id, 'resolved')}>Resolve</button>}
                                        {d.status === 'resolved' && <span style={{ fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: 'bold' }}>✓ Resolved</span>}
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
