import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { userSkills } from '../../data/mockData'
import { FiUpload, FiEdit2, FiMail, FiMapPin, FiLink } from 'react-icons/fi'
import './UserPages.css'

export default function Profile() {
    const { user } = useAuth()
    const [editing, setEditing] = useState(false)
    const [bio, setBio] = useState('Passionate software developer with a focus on full-stack web development. Currently pursuing B.Tech in Computer Science. Looking for exciting internship opportunities to grow my skills and contribute to innovative projects.')
    const [resumeFile, setResumeFile] = useState(null)

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>👤 My Profile</h1>
                <p>Manage your profile and resume</p>
            </div>

            <div className="profile-layout">
                <div className="profile-sidebar">
                    <div className="glass-card profile-card">
                        <div className="profile-avatar">{user?.name?.charAt(0) || 'U'}</div>
                        <h2 className="profile-name">{user?.name || 'User'}</h2>
                        <p className="profile-role">Software Developer</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            <FiMapPin style={{ verticalAlign: 'middle' }} /> Bengaluru, India
                        </p>

                        <div className="profile-stats-row">
                            <div className="profile-stat">
                                <strong>5</strong>
                                <small>Applications</small>
                            </div>
                            <div className="profile-stat">
                                <strong>12</strong>
                                <small>Followers</small>
                            </div>
                            <div className="profile-stat">
                                <strong>8</strong>
                                <small>Following</small>
                            </div>
                        </div>
                    </div>

                    {/* Resume Upload */}
                    <div className="glass-card">
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>📄 Resume</h3>
                        <div className="resume-upload-area" onClick={() => document.getElementById('resumeInput').click()}>
                            <div className="upload-icon"><FiUpload /></div>
                            {resumeFile ? (
                                <p style={{ color: 'var(--accent-green)' }}>✓ {resumeFile.name} uploaded</p>
                            ) : (
                                <>
                                    <p><strong>Click to upload</strong> or drag and drop</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>PDF, DOC up to 5MB</p>
                                </>
                            )}
                        </div>
                        <input id="resumeInput" type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={e => setResumeFile(e.target.files[0])} />
                    </div>

                    {/* Contact */}
                    <div className="glass-card">
                        <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Contact</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            <span><FiMail style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> {user?.email || 'user@example.com'}</span>
                            <span><FiLink style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> linkedin.com/in/user</span>
                            <span><FiLink style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> github.com/user</span>
                        </div>
                    </div>
                </div>

                {/* Main Profile Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* About */}
                    <div className="glass-card profile-section">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3>About</h3>
                            <button className="btn btn-sm btn-secondary" onClick={() => setEditing(!editing)}>
                                <FiEdit2 /> {editing ? 'Save' : 'Edit'}
                            </button>
                        </div>
                        {editing ? (
                            <textarea className="input-field" value={bio} onChange={e => setBio(e.target.value)} rows={4} />
                        ) : (
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{bio}</p>
                        )}
                    </div>

                    {/* Skills */}
                    <div className="glass-card profile-section">
                        <h3>🛠️ Skills</h3>
                        <div className="tags-container" style={{ marginTop: '0.5rem' }}>
                            {userSkills.map(s => <span className="tag" key={s}>{s}</span>)}
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
