import { useState, useEffect } from 'react'
import { FiSearch, FiDownload, FiFilter, FiLoader } from 'react-icons/fi'
import api from '../../api/api'
import './RecruiterPages.css'

export default function Applicants() {
    const [search, setSearch] = useState('')
    const [skillFilter, setSkillFilter] = useState('')
    const [applicants, setApplicants] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [expandedApp, setExpandedApp] = useState(null)

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search)
        const jobId = queryParams.get('job_id')
        fetchApplicants(jobId)
    }, [])

    const fetchApplicants = async (jobId = null) => {
        setLoading(true)
        setError('')
        try {
            const url = jobId ? `/recruiter/jobs/${jobId}/applicants` : '/recruiter/applicants'
            const data = await api.get(url)
            setApplicants(data)
        } catch (err) {
            setError(err.message || 'Failed to load applicants')
        } finally {
            setLoading(false)
        }
    }

    const filtered = applicants.filter(a => {
        const name = a.applicant_name || 'Unknown'
        const job = a.job_title || 'Unknown'
        const skills = (a.skills || []).join(' ')

        const matchSearch = name.toLowerCase().includes(search.toLowerCase()) ||
            job.toLowerCase().includes(search.toLowerCase()) ||
            skills.toLowerCase().includes(search.toLowerCase())

        const matchSkill = !skillFilter || (a.skills && a.skills.some(s => s.toLowerCase().includes(skillFilter.toLowerCase())))
        return matchSearch && matchSkill
    })

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/recruiter/applications/${id}/status`, { status })
            setApplicants(applicants.map(a => a.id === id ? { ...a, status } : a))
        } catch (err) {
            alert(err.message || 'Failed to update status')
        }
    }

    const downloadResume = async (applicationId) => {
        try {
            // Browsers handle direct downloads better with window.open or a link for files
            const token = localStorage.getItem('internlink_token')
            const url = `${import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000'}/recruiter/applicants/${applicationId}/resume/download`

            // Create a temporary link to download the file
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) throw new Error('Download failed')

            const blob = await response.blob()
            const downloadUrl = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = downloadUrl

            // Try to get filename from content-disposition header if possible
            const contentDisposition = response.headers.get('content-disposition')
            let filename = 'resume.pdf'
            if (contentDisposition && contentDisposition.includes('filename=')) {
                filename = contentDisposition.split('filename=')[1].replace(/"/g, '')
            }

            link.setAttribute('download', filename)
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (err) {
            alert(err.message || 'Failed to download resume')
        }
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>👥 Applicants</h1>
                <p>Review and manage all applicants</p>
            </div>

            <div className="applicants-controls">
                <div className="search-bar" style={{ maxWidth: '300px' }}>
                    <FiSearch className="search-icon" />
                    <input placeholder="Search name, job, or skills..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <input className="input-field" placeholder="🛠️ Filter by skill..." value={skillFilter} onChange={e => setSkillFilter(e.target.value)} style={{ maxWidth: '200px' }} />
                <button className="btn btn-secondary" onClick={() => fetchApplicants()} title="Refresh"><FiLoader className={loading ? 'spin' : ''} /></button>
            </div>

            {error && <div className="error-message" style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}

            <div className="glass-card">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <FiLoader className="spin" style={{ fontSize: '2rem', color: 'var(--accent-primary)' }} />
                        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading applicants...</p>
                    </div>
                ) : (
                    <>
                        {filtered.map(app => (
                            <div className={`applicant-container ${expandedApp === app.id ? 'expanded' : ''}`} key={app.id} style={{ marginBottom: '1rem' }}>
                                <div className="applicant-row" onClick={() => setExpandedApp(expandedApp === app.id ? null : app.id)} style={{ cursor: 'pointer' }}>
                                    <div className="avatar" style={{ background: 'var(--gradient-primary)' }}>{(app.applicant_name || 'U').charAt(0)}</div>
                                    <div className="applicant-details">
                                        <strong>{app.applicant_name || 'Anonymous User'}</strong>
                                        <small>{app.job_title} · Applied {new Date(app.applied_at).toLocaleDateString()}</small>
                                        <div className="applicant-skills">
                                            {app.skills && app.skills.slice(0, 5).map(s => <span className="tag" key={s} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>{s}</span>)}
                                            {app.skills?.length > 5 && <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>+{app.skills.length - 5} more</span>}
                                        </div>
                                    </div>
                                    <div className="match-badge" title="Matching Score" style={{ background: (app.matching_score || 0) >= 70 ? 'var(--gradient-success)' : (app.matching_score || 0) >= 40 ? 'var(--gradient-warm)' : 'rgba(255,255,255,0.1)' }}>
                                        {app.matching_score !== null ? `${Math.round(app.matching_score)}%` : 'N/A'}
                                    </div>
                                    <div className="applicant-actions" onClick={e => e.stopPropagation()}>
                                        <select className="status-select" value={app.status} onChange={e => updateStatus(app.id, e.target.value)}>
                                            <option value="applied">Applied</option>
                                            <option value="shortlisted">Shortlisted</option>
                                            <option value="interview_scheduled">Interview</option>
                                            <option value="selected">Selected</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                        <button className="btn btn-sm btn-secondary" title="Download Resume" onClick={() => downloadResume(app.id)} disabled={!app.resume_id}><FiDownload /></button>
                                    </div>
                                </div>

                                {expandedApp === app.id && (
                                    <div className="applicant-details-expanded" style={{ padding: '1.5rem', borderTop: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.02)' }}>
                                        <div className="grid grid-2">
                                            <div>
                                                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--accent-blue)' }}>🎓 Education</h4>
                                                {app.education?.length > 0 ? app.education.map((edu, i) => (
                                                    <div key={i} style={{ marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                                                        <strong>{edu.degree}</strong>
                                                        <div style={{ color: 'var(--text-secondary)' }}>{edu.institution}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{edu.year}</div>
                                                    </div>
                                                )) : <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No education history found.</p>}
                                            </div>
                                            <div>
                                                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--accent-green)' }}>💼 Experience</h4>
                                                {app.experience?.length > 0 ? app.experience.map((exp, i) => (
                                                    <div key={i} style={{ marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                                                        <strong>{exp.title}</strong>
                                                        <div style={{ color: 'var(--text-secondary)' }}>{exp.company}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{exp.duration}</div>
                                                    </div>
                                                )) : <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No experience history found.</p>}
                                            </div>
                                        </div>
                                        {app.cover_letter && (
                                            <div style={{ marginTop: '1rem' }}>
                                                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>✉️ Cover Letter</h4>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>"{app.cover_letter}"</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                        {filtered.length === 0 && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No applicants found.</p>}
                    </>
                )}
            </div>
        </div>
    )
}
