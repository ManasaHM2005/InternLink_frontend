import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { FiUpload, FiEdit2, FiMail, FiMapPin, FiLink, FiCheck } from 'react-icons/fi'
import api from '../../api/api'
import './UserPages.css'

export default function Profile() {
    const { user } = useAuth()
    const [editing, setEditing] = useState(false)
    const [profile, setProfile] = useState(null)
    const [bio, setBio] = useState('')
    const [skills, setSkills] = useState([])
    const [resumeFile, setResumeFile] = useState(null)
    const [resumes, setResumes] = useState([])
    const [uploading, setUploading] = useState(false)
    const [uploadMsg, setUploadMsg] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadProfile()
        loadResumes()
    }, [])

    const loadProfile = async () => {
        try {
            const data = await api.get('/users/profile')
            setProfile(data)
            setBio(data.profile?.bio || '')
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
            await api.put('/users/profile', { bio, skills })
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
        setUploadMsg('')
        try {
            const formData = new FormData()
            formData.append('file', file)
            const data = await api.upload('/users/resume/upload', formData)
            setUploadMsg(`✓ Resume parsed! Found ${data.parsed_skills?.length || 0} skills.`)
            setSkills(data.parsed_skills || [])
            loadResumes()
            loadProfile()
        } catch (err) {
            setUploadMsg('✗ Upload failed: ' + err.message)
        } finally {
            setUploading(false)
        }
    }

    const displayName = profile?.profile?.full_name || user?.name || 'User'
    const displayEmail = profile?.email || user?.email || 'user@example.com'
    const displayLocation = profile?.profile?.location || 'Not set'
    const displayLinkedin = profile?.profile?.linkedin_url || 'Not set'
    const displayGithub = profile?.profile?.github_url || 'Not set'

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
                        <div className="profile-avatar">{displayName?.charAt(0) || 'U'}</div>
                        <h2 className="profile-name">{displayName}</h2>
                        <p className="profile-role">{user?.role === 'recruiter' ? 'Recruiter' : 'Job Seeker'}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            <FiMapPin style={{ verticalAlign: 'middle' }} /> {displayLocation}
                        </p>
                    </div>

                    {/* Resume Upload */}
                    <div className="glass-card">
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>📄 Resume</h3>
                        <div className="resume-upload-area" onClick={() => document.getElementById('resumeInput').click()}>
                            <div className="upload-icon"><FiUpload /></div>
                            {uploading ? (
                                <p style={{ color: 'var(--accent-blue)' }}>⏳ Uploading & parsing...</p>
                            ) : uploadMsg ? (
                                <p style={{ color: uploadMsg.startsWith('✓') ? 'var(--accent-green)' : '#ef4444' }}>{uploadMsg}</p>
                            ) : resumeFile ? (
                                <p style={{ color: 'var(--accent-green)' }}>✓ {resumeFile.name} uploaded</p>
                            ) : (
                                <>
                                    <p><strong>Click to upload</strong> or drag and drop</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>PDF, DOC, TXT up to 10MB</p>
                                </>
                            )}
                        </div>
                        <input id="resumeInput" type="file" accept=".pdf,.doc,.docx,.txt" style={{ display: 'none' }} onChange={e => handleResumeUpload(e.target.files[0])} />

                        {resumes.length > 0 && (
                            <div style={{ marginTop: '0.75rem' }}>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Uploaded resumes:</p>
                                {resumes.map(r => (
                                    <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                        <FiCheck style={{ color: 'var(--accent-green)' }} />
                                        <span>{r.filename}</span>
                                        {r.is_primary && <span style={{ fontSize: '0.7rem', background: 'var(--accent-blue)', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>Primary</span>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Contact */}
                    <div className="glass-card">
                        <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Contact</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            <span><FiMail style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> {displayEmail}</span>
                            <span><FiLink style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> {displayLinkedin}</span>
                            <span><FiLink style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> {displayGithub}</span>
                        </div>
                    </div>
                </div>

                {/* Main Profile Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* About */}
                    <div className="glass-card profile-section">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3>About</h3>
                            <button className="btn btn-sm btn-secondary" onClick={() => editing ? handleSaveProfile() : setEditing(true)}>
                                <FiEdit2 /> {editing ? 'Save' : 'Edit'}
                            </button>
                        </div>
                        {editing ? (
                            <textarea className="input-field" value={bio} onChange={e => setBio(e.target.value)} rows={4} />
                        ) : (
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{bio || 'No bio set yet. Click Edit to add one.'}</p>
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
                                    <div key={i} style={{ marginBottom: '0.5rem' }}>
                                        <strong style={{ fontSize: '0.9rem' }}>{edu.degree || 'Degree'}</strong>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{edu.college || 'College'} · {edu.year || ''}</p>
                                    </div>
                                ))
                            ) : (
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No education details added yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Experience */}
                    <div className="glass-card profile-section">
                        <h3>💼 Experience</h3>
                        <div style={{ marginTop: '0.5rem' }}>
                            {profile?.profile?.experience?.length > 0 ? (
                                profile.profile.experience.map((exp, i) => (
                                    <div key={i} style={{ marginBottom: '0.5rem' }}>
                                        <strong style={{ fontSize: '0.9rem' }}>{exp.title || 'Role'}</strong>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--accent-blue)' }}>{exp.company || 'Company'}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{exp.duration || ''}</p>
                                    </div>
                                ))
                            ) : (
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No experience details added yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
