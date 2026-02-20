import { useState, useEffect } from 'react'
import { useAuth, API_BASE_URL } from '../../context/AuthContext'
import { FiUpload, FiEdit2, FiMail, FiMapPin, FiLink } from 'react-icons/fi'
import './UserPages.css'

export default function Profile() {
    const { user } = useAuth()
    const [profile, setProfile] = useState(null)
    const [editing, setEditing] = useState(false)
    const [formData, setFormData] = useState({
        bio: '',
        skills: '',
        location: '',
        github_url: '',
        linkedin_url: ''
    })
    const [resumeFile, setResumeFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${API_BASE_URL}/users/profile`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('internlink_token')}`
                }
            })
            if (!response.ok) throw new Error('Failed to fetch profile')
            const data = await response.json()
            setProfile(data.profile)
            if (data.profile) {
                setFormData({
                    bio: data.profile.bio || '',
                    skills: data.profile.skills?.join(', ') || '',
                    location: data.profile.location || '',
                    github_url: data.profile.github_url || '',
                    linkedin_url: data.profile.linkedin_url || ''
                })
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateProfile = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('internlink_token')}`
                },
                body: JSON.stringify({
                    ...formData,
                    skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
                })
            })
            if (!response.ok) throw new Error('Update failed')
            setEditing(false)
            fetchProfile()
        } catch (err) {
            alert(err.message)
        }
    }

    const handleResumeUpload = async (file) => {
        if (!file) return
        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await fetch(`${API_BASE_URL}/users/resume/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('internlink_token')}`
                },
                body: formData
            })
            if (!response.ok) throw new Error('Upload failed')
            setResumeFile(file)
            alert('Resume uploaded and parsed!')
            fetchProfile() // Refresh to get parsed skills
        } catch (err) {
            alert(err.message)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>👤 My Profile</h1>
                <p>Manage your profile and resume</p>
            </div>

            <div className="profile-layout">
                <div className="profile-sidebar">
                    <div className="glass-card profile-card">
                        <div className="profile-avatar">{user?.email?.charAt(0).toUpperCase() || 'U'}</div>
                        <h2 className="profile-name">{user?.email?.split('@')[0]}</h2>
                        <p className="profile-role">{user?.role === 'recruiter' ? 'Recruiter' : 'Student / Job Seeker'}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            <FiMapPin style={{ verticalAlign: 'middle' }} /> {profile?.location || 'Add location'}
                        </p>
                    </div>

                    {/* Resume Upload */}
                    <div className="glass-card">
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>📄 Resume</h3>
                        <div className="resume-upload-area" onClick={() => document.getElementById('resumeInput').click()}>
                            <div className="upload-icon"><FiUpload /></div>
                            {uploading ? (
                                <p>Uploading...</p>
                            ) : resumeFile ? (
                                <p style={{ color: 'var(--accent-green)' }}>✓ {resumeFile.name} uploaded</p>
                            ) : (
                                <>
                                    <p><strong>Click to upload</strong> or drag and drop</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>PDF, DOC up to 5MB</p>
                                </>
                            )}
                        </div>
                        <input id="resumeInput" type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={e => handleResumeUpload(e.target.files[0])} />
                    </div>

                    {/* Contact */}
                    <div className="glass-card">
                        <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Contact</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            <span><FiMail style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> {user?.email}</span>
                            {profile?.linkedin_url && (
                                <span><FiLink style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> {profile.linkedin_url}</span>
                            )}
                            {profile?.github_url && (
                                <span><FiLink style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> {profile.github_url}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Profile Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
                    {/* About */}
                    <div className="glass-card profile-section">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3>About</h3>
                            <button className="btn btn-sm btn-secondary" onClick={() => editing ? handleUpdateProfile() : setEditing(true)}>
                                <FiEdit2 /> {editing ? 'Save Changes' : 'Edit Profile'}
                            </button>
                        </div>
                        {editing ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Bio</label>
                                    <textarea className="input-field" value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} rows={4} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Location</label>
                                        <input className="input-field" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Skills (comma separated)</label>
                                        <input className="input-field" value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem' }}>GitHub URL</label>
                                        <input className="input-field" value={formData.github_url} onChange={e => setFormData({ ...formData, github_url: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem' }}>LinkedIn URL</label>
                                        <input className="input-field" value={formData.linkedin_url} onChange={e => setFormData({ ...formData, linkedin_url: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                {profile?.bio || 'No bio yet. Click edit to add one!'}
                            </p>
                        )}
                    </div>

                    {/* Skills */}
                    <div className="glass-card profile-section">
                        <h3>🛠️ Skills</h3>
                        <div className="tags-container" style={{ marginTop: '0.5rem' }}>
                            {profile?.skills?.length > 0 ? (
                                profile.skills.map(s => <span className="tag" key={s}>{s}</span>)
                            ) : (
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No skills added yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Education */}
                    <div className="glass-card profile-section">
                        <h3>🎓 Education</h3>
                        <div style={{ marginTop: '0.5rem' }}>
                            <strong style={{ fontSize: '0.9rem' }}>B.Tech in Computer Science</strong>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>XYZ Engineering College · 2023 - 2027</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>CGPA: 8.5/10</p>
                        </div>
                    </div>

                    {/* Experience */}
                    <div className="glass-card profile-section">
                        <h3>💼 Experience</h3>
                        <div style={{ marginTop: '0.5rem' }}>
                            <strong style={{ fontSize: '0.9rem' }}>Frontend Developer Intern</strong>
                            <p style={{ fontSize: '0.8rem', color: 'var(--accent-blue)' }}>TechNova Solutions</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Jan 2026 - Present · 2 months</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.6 }}>
                                Building responsive web applications using React. Working on component design, API integration, and performance optimization.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
