import { useState } from 'react'
import { mockUsers } from '../../data/mockData'
import { FiSearch } from 'react-icons/fi'
import './AdminPages.css'

export default function ManageUsers() {
    const [users, setUsers] = useState(mockUsers)
    const [search, setSearch] = useState('')

    const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))

    const toggleStatus = (id) => {
        setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'banned' : 'active' } : u))
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>👤 Manage Users</h1>
                <p>View and manage all platform users</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <div className="search-bar" style={{ maxWidth: '320px' }}>
                    <FiSearch className="search-icon" />
                    <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>

            <div className="glass-card admin-table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Joined</th>
                            <th>Applications</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(u => (
                            <tr key={u.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div className="avatar avatar-sm" style={{ background: 'var(--gradient-primary)' }}>{u.name.charAt(0)}</div>
                                        <strong style={{ color: 'var(--text-primary)' }}>{u.name}</strong>
                                    </div>
                                </td>
                                <td>{u.email}</td>
                                <td>{u.joined}</td>
                                <td>{u.applications}</td>
                                <td><span className={`badge ${u.status === 'active' ? 'badge-selected' : 'badge-rejected'}`}>{u.status}</span></td>
                                <td>
                                    <div className="action-btns">
                                        <button className="action-btn view">View</button>
                                        <button className={`action-btn ${u.status === 'active' ? 'reject' : 'approve'}`} onClick={() => toggleStatus(u.id)}>
                                            {u.status === 'active' ? 'Ban' : 'Activate'}
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
