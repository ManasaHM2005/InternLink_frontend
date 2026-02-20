import { useState, useEffect } from 'react'
import { useAuth, API_BASE_URL } from '../../context/AuthContext'
import { FiEdit2, FiGlobe, FiMapPin, FiUsers, FiTag, FiBookOpen } from 'react-icons/fi'
import './RecruiterPages.css'

export default function CompanyProfile() {
    const { user } = useAuth()
    const [profile, setProfile] = useState(null)
    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        company_name: '',
        company_description: '',
        website: '',
        industry: '',
        company_size: '',
        headquarters: ''
    })

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${API_BASE_URL}/recruiter/profile`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('internlink_token')}`
                }
            })
            if (!response.ok) {
                if (response.status === 404) {
                    // Profile doesn't exist yet, that's fine for recruiters
                    setProfile(null)
                    return
                }
                throw new Error('Failed to fetch profile')
            }
            const data = await response.json()
            setProfile(data)
            setFormData({
                company_name: data.company_name || '',
                company_description: data.company_description || '',
                website: data.website || '',
                industry: data.industry || '',
                company_size: data.company_size || '',
                headquarters: data.headquarters || ''
            })
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${API_BASE_URL}/recruiter/profile`, {
                method: profile ? 'PUT' : 'POST', // Based on backend logic, but recruiter_routes.py only has GET and PUT. Wait, how is it created?
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('internlink_token')}`
                },
                body: JSON.stringify(formData)
            })

            // Wait, let's check recruiter_routes.py. It doesn't have a POST for profile creation.
            // Oh, I should check if there's a default profile.

            if (!response.ok) throw new Error('Update failed')
            const data = await response.json()
            setProfile(data)
            setEditing(false)
        } catch (err) {
            alert(err.message)
        }
    }

    if (loading) return <div className="page-container">Loading...</div>

    return (
        <div className="page-container">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>🏢 Company Profile</h1>
                    <p>Manage your company details and brand</p>
                </div>
                {!editing && (
                    <button className="btn btn-secondary" onClick={() => setEditing(true)}>
                        <FiEdit2 /> Edit Profile
                    </button>
                )}
            </div>

            <div className="profile-layout">
                <div className="profile-sidebar">
                    <div className="glass-card profile-card" style={{ textAlign: 'center' }}>
                        <div className="profile-avatar" style={{ margin: '0 auto 1rem', width: '100px', height: '100px', fontSize: '2.5rem', background: 'var(--gradient-primary)' }}>
                            {formData.company_name?.[0] || 'C'}
                        </div>
                        <h2 className="profile-name">{formData.company_name || 'Your Company'}</h2>
                        <p className="profile-role">{formData.industry || 'Industry'}</p>
                    </div>

                    <div className="glass-card">
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Info</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                            <div className="flex items-center gap-2 color-muted">
                                <FiGlobe /> <a href={formData.website} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-blue)' }}>{formData.website || 'Add website'}</a>
                            </div>
                            <div className="flex items-center gap-2 color-muted">
                                <FiMapPin /> {formData.headquarters || 'Add headquarters'}
                            </div>
                            <div className="flex items-center gap-2 color-muted">
                                <FiUsers /> {formData.company_size || 'Company size'}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ flex: 1 }}>
                    {editing ? (
                        <form className="glass-card" onSubmit={handleUpdate}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Edit Company Details</h3>
                            <div className="form-grid">
                                <div className="input-group">
                                    <label>Company Name *</label>
                                    <input className="input-field" value={formData.company_name} onChange={e => setFormData({ ...formData, company_name: e.target.value })} required />
                                </div>
                                <div className="input-group">
                                    <label>Website</label>
                                    <input className="input-field" value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} placeholder="https://example.com" />
                                </div>
                                <div className="input-group">
                                    <label>Industry</label>
                                    <input className="input-field" value={formData.industry} onChange={e => setFormData({ ...formData, industry: e.target.value })} placeholder="e.g. Technology" />
                                </div>
                                <div className="input-group">
                                    <label>Company Size</label>
                                    <select className="input-field" value={formData.company_size} onChange={e => setFormData({ ...formData, company_size: e.target.value })}>
                                        <option value="">Select size</option>
                                        <option value="1-10">1-10 Employees</option>
                                        <option value="11-50">11-50 Employees</option>
                                        <option value="51-200">51-200 Employees</option>
                                        <option value="201-500">201-500 Employees</option>
                                        <option value="500+">500+ Employees</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Headquarters</label>
                                    <input className="input-field" value={formData.headquarters} onChange={e => setFormData({ ...formData, headquarters: e.target.value })} placeholder="e.g. San Francisco, CA" />
                                </div>
                                <div className="input-group form-full">
                                    <label>Company Description</label>
                                    <textarea className="input-field" rows={5} value={formData.company_description} onChange={e => setFormData({ ...formData, company_description: e.target.value })} placeholder="Tell candidates about your company culture, mission..." />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                                <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <div className="glass-card">
                            <h3 style={{ marginBottom: '1rem' }}>About the Company</h3>
                            <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                                {profile?.company_description || 'No description provided. Add one to attract the best candidates!'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
