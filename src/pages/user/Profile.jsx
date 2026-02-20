import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { FiUpload, FiEdit2, FiMail, FiMapPin, FiLink, FiCheck } from 'react-icons/fi'
import api from '../../api/api'
import './UserPages.css'

export default function Profile() {
    const { user } = useAuth()
    const [editing, setEditing] = useState(false)
    const [profile, setProfile] = useState(null)
    const [skills, setSkills] = useState([])
    const [formData, setFormData] = useState({
        full_name: '',
        bio: '',
        skills: '',
        location: '',
        github_url: '',
        linkedin_url: ''
    })
    const [resumeFile, setResumeFile] = useState(null)
    const [resumes, setResumes] = useState([])
    const [uploading, setUploading] = useState(false)
    const [uploadSuccess, setUploadSuccess] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadProfile()
        loadResumes()
    }, [])

    const loadProfile = async () => {
        try {
            const data = await api.get('/users/profile')
            setProfile(data)
            setFormData({
                full_name: data.profile?.full_name || '',
                bio: data.profile?.bio || '',
                skills: data.profile?.skills?.join(', ') || '',
                location: data.profile?.location || '',
                github_url: data.profile?.github_url || '',
                linkedin_url: data.profile?.linkedin_url || ''
            })
            setSkills(data.profile?.skills || [])
        } catch (err) {
            console.error('Failed to load profile:', err)
        } finally {
            setLoading(false)
        }
    }

    const loadResumes = async () => {
        try {
            const data = await api.get('/users/resume')
            setResumes(data)
        } catch (err) {
            console.error('Failed to load resumes:', err)
        }
    }

    const handleSaveProfile = async () => {
        try {
            await api.put('/users/profile', {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
            })
            setEditing(false)
            loadProfile()
        } catch (err) {
            console.error('Failed to save profile:', err)
        }
    }

    const handleResumeUpload = async (file) => {
        if (!file) return
        setResumeFile(file)
        setUploading(true)
        setUploadSuccess(null)
        try {
            const uploadData = new FormData()
            uploadData.append('file', file)
            const data = await api.upload('/users/resume/upload', uploadData)
            setUploadSuccess({
                skills: data.parsed_skills?.length || 0,
                filename: file.name
            })
            setSkills(data.parsed_skills || [])
            loadResumes()
            loadProfile()
            setTimeout(() => setUploadSuccess(null), 10000)
        } catch (err) {
            alert('Upload failed: ' + err.message)
        } finally {
            setUploading(false)
        }
    }

    const displayName = profile?.profile?.full_name || user?.name || user?.email?.split('@')[0] || 'User'
    const displayEmail = profile?.email || user?.email || 'user@example.com'
    const displayLocation = profile?.profile?.location || 'Add location'
    const displayLinkedin = profile?.profile?.linkedin_url
    const displayGithub = profile?.profile?.github_url

    if (loading) {
        return <div className="page-container"><div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>Loading profile...</div></div>
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
                        <div className="profile-avatar" style={{ background: 'var(--gradient-primary)' }}>{displayName.charAt(0).toUpperCase()}</div>
                        <h2 className="profile-name">{displayName}</h2>
                        <p className="profile-role">{user?.role === 'recruiter' ? 'Recruiter' : 'Student / Job Seeker'}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            <FiMapPin style={{ verticalAlign: 'middle' }} /> {displayLocation}
                        </p>
                    </div>

                    {/* Resume Upload */}
                    <div className="glass-card">
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>📄 Resume</h3>
                        <div className="resume-upload-area" onClick={() => document.getElementById('resumeInput').click()} style={{
                            border: '2px dashed var(--border-color)',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}>
                            <div className="upload-icon" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: uploading ? 'var(--text-muted)' : 'var(--accent-blue)' }}><FiUpload /></div>
                            {uploading ? (
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Analyzing resume...</p>
                            ) : uploadSuccess ? (
                                <div>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--accent-green)', fontWeight: '600' }}>✓ Resume parsed!</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Found {uploadSuccess.skills} skills.</p>
                                </div>
                            ) : (
                                <>
                                    <p style={{ fontSize: '0.9rem', fontWeight: '500' }}>Click to upload</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>PDF, DOCX up to 5MB</p>
                                </>
                            )}
                        </div>
                        <input id="resumeInput" type="file" accept=".pdf,.doc,.docx,.txt" style={{ display: 'none' }} onChange={e => handleResumeUpload(e.target.files[0])} />

                        {resumes.length > 0 && (
                            <div style={{ marginTop: '1.5rem' }}>
                                <p style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>UPLOADED RESUMES</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {resumes.map(r => (
                                        <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '0.8rem' }}>
                                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>{r.filename}</span>
                                            {r.is_primary && <span className="tag" style={{ fontSize: '0.6rem', padding: '2px 6px' }}>Primary</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Contact */}
                    <div className="glass-card">
                        <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Contact</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            <span><FiMail style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> {displayEmail}</span>
                            {displayLinkedin && (
                                <span><FiLink style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> <a href={displayLinkedin} target="_blank" rel="noreferrer">LinkedIn</a></span>
                            )}
                            {displayGithub && (
                                <span><FiLink style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> <a href={displayGithub} target="_blank" rel="noreferrer">GitHub</a></span>
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
                            <button className="btn btn-sm btn-secondary" onClick={() => editing ? handleSaveProfile() : setEditing(true)}>
                                <FiEdit2 /> {editing ? 'Save' : 'Edit'}
                            </button>
                        </div>
                        {editing ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <input className="input-field" value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} placeholder="Full Name" />
                                <textarea className="input-field" value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} rows={3} placeholder="Tell us about yourself..." />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <input className="input-field" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="Location" />
                                    <input className="input-field" value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} placeholder="Skills (Python, React...)" />
                                </div>
                            </div>
                        ) : (
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                {profile?.profile?.bio || 'No bio set yet. Click Edit to add one.'}
                            </p>
                        )}
                    </div>

                    {/* Skills */}
                    <div className="glass-card profile-section">
                        <h3>🛠️ Skills {skills.length > 0 && <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>({skills.length} detected)</span>}</h3>
                        <div className="tags-container" style={{ marginTop: '0.5rem' }}>
                            {skills.length > 0 ? (
                                skills.map(s => <span className="tag" key={s}>{s}</span>)
                            ) : (
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Upload a resume to auto-detect your skills!</p>
                            )}
                        </div>
                    </div>

                    {/* Education */}
                    <div className="glass-card profile-section">
                        <h3>🎓 Education</h3>
                        <div style={{ marginTop: '0.5rem' }}>
                            {profile?.profile?.education?.length > 0 ? (
                                profile.profile.education.map((edu, i) => (
                                    <div key={i} style={{ padding: '0.5rem 0', borderBottom: i < profile.profile.education.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                                        <strong style={{ fontSize: '1rem', color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>{edu.degree || 'Degree'}</strong>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                            <span style={{ color: 'var(--text-secondary)' }}>{(edu.institution || edu.college || 'Institution').replace(/^[•\s\-\d\.]+/, '').trim()}</span>
                                            <span style={{ color: 'var(--text-muted)' }}>•</span>
                                            <span style={{ color: 'var(--accent-blue)', fontWeight: '500' }}>{edu.year || ''}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No education details added yet. Upload a resume to auto-fill!</p>
                            )}
                        </div>
                    </div>

                    {/* Experience */}
                    <div className="glass-card profile-section">
                        <h3>💼 Experience</h3>
                        <div style={{ marginTop: '0.5rem' }}>
                            {profile?.profile?.experience?.length > 0 ? (
                                profile.profile.experience.map((exp, i) => (
                                    <div key={i} style={{ padding: '0.5rem 0', borderBottom: i < profile.profile.experience.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                                        <strong style={{ fontSize: '1rem', color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>{exp.title || 'Role'}</strong>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--accent-blue)', fontWeight: '500' }}>{exp.company || 'Company'}</p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{exp.duration || ''}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No experience details added yet. Upload a resume to auto-fill!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
