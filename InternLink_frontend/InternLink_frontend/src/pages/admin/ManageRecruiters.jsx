import { useState, useEffect } from 'react'
import { useAuth, API_BASE_URL } from '../../context/AuthContext'
import { FiSearch } from 'react-icons/fi'
import './AdminPages.css'

export default function ManageRecruiters() {
    const { user: currentUser } = useAuth()
    const [recruiters, setRecruiters] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchRecruiters()
    }, [])

    const fetchRecruiters = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${API_BASE_URL}/admin/recruiters`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('internlink_token')}`
                }
            })
            if (!response.ok) throw new Error('Failed to fetch recruiters')
            const data = await response.json()
            setRecruiters(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const updateStatus = async (id, currentStatus) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/recruiters/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('internlink_token')}`
                },
                body: JSON.stringify({ is_active: !currentStatus })
            })
            if (!response.ok) throw new Error('Update failed')
            setRecruiters(recruiters.map(r => r.id === id ? { ...r, is_active: !currentStatus } : r))
        } catch (err) {
            alert(err.message)
        }
    }

    const filtered = recruiters.filter(r => (r.company_name || '').toLowerCase().includes(search.toLowerCase()) || r.email.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>🏢 Manage Recruiters</h1>
                <p>Verify and manage recruiter accounts</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <div className="search-bar" style={{ maxWidth: '320px' }}>
                    <FiSearch className="search-icon" />
                    <input placeholder="Search recruiters..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>

            <div className="glass-card admin-table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Email</th>
                            <th>Jobs</th>
                            <th>Applicants</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading recruiters...</td></tr>
                        ) : filtered.map(r => (
                            <tr key={r.id}>
                                <td><strong style={{ color: 'var(--text-primary)' }}>{r.company_name || 'No Company'}</strong></td>
                                <td>{r.email}</td>
                                <td>{r.jobs_count || 0}</td>
                                <td>{r.applicants_count || 0}</td>
                                <td>
                                    <span className={`badge ${r.is_active ? 'badge-selected' : 'badge-rejected'}`}>
                                        {r.is_active ? 'Active' : 'Blocked'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-btns">
                                        <button className={`action-btn ${r.is_active ? 'reject' : 'approve'}`} onClick={() => updateStatus(r.id, r.is_active)}>
                                            {r.is_active ? 'Block' : 'Unblock'}
                                        </button>
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
