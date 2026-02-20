import { useState, useEffect } from 'react'
import { useAuth, API_BASE_URL } from '../../context/AuthContext'
import { FiSearch } from 'react-icons/fi'
import './AdminPages.css'

export default function ManageUsers() {
    const { user: currentUser } = useAuth()
    const [users, setUsers] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${API_BASE_URL}/admin/users?role=user`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('internlink_token')}`
                }
            })
            if (!response.ok) throw new Error('Failed to fetch users')
            const data = await response.json()
            setUsers(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const toggleStatus = async (id, currentStatus) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('internlink_token')}`
                },
                body: JSON.stringify({ is_active: !currentStatus })
            })
            if (!response.ok) throw new Error('Update failed')
            setUsers(users.map(u => u.id === id ? { ...u, is_active: !currentStatus } : u))
        } catch (err) {
            alert(err.message)
        }
    }

    const filtered = users.filter(u =>
        (u.profile?.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    )

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
                        {loading ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading users...</td></tr>
                        ) : filtered.map(u => (
                            <tr key={u.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div className="avatar avatar-sm" style={{ background: 'var(--gradient-primary)' }}>{u.profile?.full_name?.[0] || 'U'}</div>
                                        <strong style={{ color: 'var(--text-primary)' }}>{u.profile?.full_name || 'No Name'}</strong>
                                    </div>
                                </td>
                                <td>{u.email}</td>
                                <td>{new Date(u.created_at).toLocaleDateString()}</td>
                                <td>{u.applications_count || 0}</td>
                                <td><span className={`badge ${u.is_active ? 'badge-selected' : 'badge-rejected'}`}>{u.is_active ? 'Active' : 'Banned'}</span></td>
                                <td>
                                    <div className="action-btns">
                                        <button className="action-btn view">View</button>
                                        <button className={`action-btn ${u.is_active ? 'reject' : 'approve'}`} onClick={() => toggleStatus(u.id, u.is_active)}>
                                            {u.is_active ? 'Ban' : 'Activate'}
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
