import { useState } from 'react'
import { mockDisputes } from '../../data/mockData'
import './AdminPages.css'

export default function Disputes() {
    const [disputes, setDisputes] = useState(mockDisputes)

    const updateStatus = (id, status) => {
        setDisputes(disputes.map(d => d.id === id ? { ...d, status } : d))
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
                        {disputes.map(d => (
                            <tr key={d.id}>
                                <td><strong style={{ color: 'var(--text-primary)' }}>{d.title}</strong></td>
                                <td>{d.reporter}</td>
                                <td>{d.against}</td>
                                <td>{d.date}</td>
                                <td>
                                    <span className={`badge ${d.status === 'open' ? 'badge-applied' : d.status === 'investigating' ? 'badge-interview' : 'badge-selected'}`}>
                                        {d.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-btns">
                                        {d.status === 'open' && <button className="action-btn warn" onClick={() => updateStatus(d.id, 'investigating')}>Investigate</button>}
                                        {d.status === 'investigating' && <button className="action-btn approve" onClick={() => updateStatus(d.id, 'resolved')}>Resolve</button>}
                                        {d.status === 'resolved' && <span style={{ fontSize: '0.75rem', color: 'var(--accent-green)' }}>✓ Resolved</span>}
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
