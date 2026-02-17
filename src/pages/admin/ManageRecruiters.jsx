import { useState } from 'react'
import { mockRecruiters } from '../../data/mockData'
import { FiSearch } from 'react-icons/fi'
import './AdminPages.css'

export default function ManageRecruiters() {
    const [recruiters, setRecruiters] = useState(mockRecruiters)
    const [search, setSearch] = useState('')

    const filtered = recruiters.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))

    const updateStatus = (id, status) => {
        setRecruiters(recruiters.map(r => r.id === id ? { ...r, status } : r))
    }

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
                        {filtered.map(r => (
                            <tr key={r.id}>
                                <td><strong style={{ color: 'var(--text-primary)' }}>{r.name}</strong></td>
                                <td>{r.email}</td>
                                <td>{r.jobs}</td>
                                <td>{r.applicants}</td>
                                <td>
                                    <span className={`badge ${r.status === 'verified' ? 'badge-selected' : r.status === 'pending' ? 'badge-interview' : 'badge-rejected'}`}>
                                        {r.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-btns">
                                        {r.status === 'pending' && <button className="action-btn approve" onClick={() => updateStatus(r.id, 'verified')}>Verify</button>}
                                        {r.status !== 'blocked' && <button className="action-btn reject" onClick={() => updateStatus(r.id, 'blocked')}>Block</button>}
                                        {r.status === 'blocked' && <button className="action-btn approve" onClick={() => updateStatus(r.id, 'verified')}>Unblock</button>}
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
