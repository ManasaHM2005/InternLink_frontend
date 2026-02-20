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

    const [resumes, setResumes] = useState([])

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
            const profileData = data.profile || {
                bio: '',
                skills: [],
                location: '',
                education: [],
                experience: []
            }
            setProfile(profileData)
            setResumes(data.resumes || [])
            setFormData({
                bio: profileData.bio || '',
                skills: profileData.skills?.join(', ') || '',
                location: profileData.location || '',
                github_url: profileData.github_url || '',
                linkedin_url: profileData.linkedin_url || ''
            })

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
                    skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
                    education: profile.education,
                    experience: profile.experience
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
            const result = await response.json()
            setResumeFile(file)
            alert(`Resume uploaded! Found ${result.parsed_skills?.length || 0} skills.`)
            fetchProfile()
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
                        <div className="profile-avatar" style={{ background: 'var(--gradient-primary)' }}>{user?.email?.charAt(0).toUpperCase() || 'U'}</div>
                        <h2 className="profile-name">{user?.email?.split('@')[0]}</h2>
                        <p className="profile-role">{user?.role === 'recruiter' ? 'Recruiter' : 'Student / Job Seeker'}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            <FiMapPin style={{ verticalAlign: 'middle' }} /> {profile?.location || 'Add location'}
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
                            <div className="upload-icon" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--accent-blue)' }}><FiUpload /></div>
                            {uploading ? (
                                <p>Processing...</p>
                            ) : (
                                <>
                                    <p style={{ fontSize: '0.9rem', fontWeight: '500' }}>Click to upload</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>PDF, DOCX up to 5MB</p>
                                </>
                            )}
                        </div>
                        <input id="resumeInput" type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={e => handleResumeUpload(e.target.files[0])} />

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
                            <span><FiMail style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> {user?.email}</span>
                            {profile?.linkedin_url && (
                                <span><FiLink style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> <a href={profile.linkedin_url} target="_blank" rel="noreferrer">LinkedIn</a></span>
                            )}
                            {profile?.github_url && (
                                <span><FiLink style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> <a href={profile.github_url} target="_blank" rel="noreferrer">GitHub</a></span>
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
                                <FiEdit2 /> {editing ? 'Save' : 'Edit'}
                            </button>
                        </div>
                        {editing ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <textarea className="input-field" value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} rows={3} placeholder="Tell us about yourself..." />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <input className="input-field" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="Location" />
                                    <input className="input-field" value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} placeholder="Skills (Python, React...)" />
                                </div>
                            </div>
                        ) : (
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                {profile?.bio || 'No bio set yet. Click Edit to add one.'}
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
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Upload a resume to auto-detect your skills!</p>
                            )}
                        </div>
                    </div>

                    {/* Education */}
                    <div className="glass-card profile-section">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3>🎓 Education</h3>
                            {editing && (
                                <button className="btn btn-sm btn-secondary" onClick={() => {
                                    const newProfile = { ...profile, education: [...(profile.education || []), { degree: '', institution: '', year: '' }] }
                                    setProfile(newProfile)
                                }}>+ Add</button>
                            )}
                        </div>
                        <div style={{ marginTop: '0.5rem' }}>
                            {profile?.education?.length > 0 ? (
                                profile.education.map((edu, i) => (
                                    <div key={i} style={{ marginBottom: '1rem', borderBottom: editing ? '1px solid rgba(255,255,255,0.05)' : 'none', paddingBottom: editing ? '1rem' : 0 }}>
                                        {editing ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                <input className="input-field" value={edu.degree} onChange={e => {
                                                    const newEdu = [...profile.education]
                                                    newEdu[i].degree = e.target.value
                                                    setProfile({ ...profile, education: newEdu })
                                                }} placeholder="Degree (e.g. B.Tech Computer Science)" />
                                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.5rem' }}>
                                                    <input className="input-field" value={edu.institution} onChange={e => {
                                                        const newEdu = [...profile.education]
                                                        newEdu[i].institution = e.target.value
                                                        setProfile({ ...profile, education: newEdu })
                                                    }} placeholder="Institution" />
                                                    <input className="input-field" value={edu.year} onChange={e => {
                                                        const newEdu = [...profile.education]
                                                        newEdu[i].year = e.target.value
                                                        setProfile({ ...profile, education: newEdu })
                                                    }} placeholder="Year" />
                                                </div>
                                                <button className="btn btn-sm btn-danger" onClick={() => {
                                                    const newEdu = profile.education.filter((_, idx) => idx !== i)
                                                    setProfile({ ...profile, education: newEdu })
                                                }} style={{ alignSelf: 'flex-end', padding: '2px 8px' }}>Remove</button>
                                            </div>
                                        ) : (
                                            <>
                                                <strong style={{ fontSize: '0.9rem' }}>{edu.degree}</strong>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{edu.institution} · {edu.year}</p>
                                            </>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No education details added yet. Upload a resume to auto-fill!</p>
                            )}
                        </div>
                    </div>

                    {/* Experience */}
                    <div className="glass-card profile-section">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3>💼 Experience</h3>
                            {editing && (
                                <button className="btn btn-sm btn-secondary" onClick={() => {
                                    const newProfile = { ...profile, experience: [...(profile.experience || []), { title: '', company: '', duration: '' }] }
                                    setProfile(newProfile)
                                }}>+ Add</button>
                            )}
                        </div>
                        <div style={{ marginTop: '0.5rem' }}>
                            {profile?.experience?.length > 0 ? (
                                profile.experience.map((exp, i) => (
                                    <div key={i} style={{ marginBottom: '1rem', borderBottom: editing ? '1px solid rgba(255,255,255,0.05)' : 'none', paddingBottom: editing ? '1rem' : 0 }}>
                                        {editing ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                <input className="input-field" value={exp.title} onChange={e => {
                                                    const newExp = [...profile.experience]
                                                    newExp[i].title = e.target.value
                                                    setProfile({ ...profile, experience: newExp })
                                                }} placeholder="Job Title" />
                                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.5rem' }}>
                                                    <input className="input-field" value={exp.company} onChange={e => {
                                                        const newExp = [...profile.experience]
                                                        newExp[i].company = e.target.value
                                                        setProfile({ ...profile, experience: newExp })
                                                    }} placeholder="Company" />
                                                    <input className="input-field" value={exp.duration} onChange={e => {
                                                        const newExp = [...profile.experience]
                                                        newExp[i].duration = e.target.value
                                                        setProfile({ ...profile, experience: newExp })
                                                    }} placeholder="Duration (e.g. 2022 - 2023)" />
                                                </div>
                                                <button className="btn btn-sm btn-danger" onClick={() => {
                                                    const newExp = profile.experience.filter((_, idx) => idx !== i)
                                                    setProfile({ ...profile, experience: newExp })
                                                }} style={{ alignSelf: 'flex-end', padding: '2px 8px' }}>Remove</button>
                                            </div>
                                        ) : (
                                            <>
                                                <strong style={{ fontSize: '0.9rem' }}>{exp.title}</strong>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--accent-blue)' }}>{exp.company}</p>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{exp.duration}</p>
                                            </>
                                        )}
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
