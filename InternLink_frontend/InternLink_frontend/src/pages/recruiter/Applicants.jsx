import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth, API_BASE_URL } from '../../context/AuthContext'
import { FiSearch, FiDownload, FiFilter } from 'react-icons/fi'
import './RecruiterPages.css'

export default function Applicants() {
    const { jobId } = useParams()
    const { user } = useAuth()
    const [search, setSearch] = useState('')
    const [skillFilter, setSkillFilter] = useState('')
    const [applicants, setApplicants] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchApplicants()
    }, [jobId])

    const fetchApplicants = async () => {
        setLoading(true)
        try {
            let url = ''
            if (jobId) {
                url = `${API_BASE_URL}/recruiter/jobs/${jobId}/applicants`
            } else {
                // If no jobId, find all jobs first then fetch applicants
                const jobsRes = await fetch(`${API_BASE_URL}/recruiter/jobs`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('internlink_token')}` }
                })
                const jobs = await jobsRes.json()
                const allApps = await Promise.all(jobs.map(async (job) => {
                    const res = await fetch(`${API_BASE_URL}/recruiter/jobs/${job.id}/applicants`, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('internlink_token')}` }
                    })
                    return res.ok ? await res.json() : []
                }))
                setApplicants(allApps.flat())
                setLoading(false)
                return
            }

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('internlink_token')}`
                }
            })
            if (!response.ok) throw new Error('Failed to fetch applicants')
            const data = await response.json()
            setApplicants(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const updateStatus = async (id, status) => {
        try {
            const response = await fetch(`${API_BASE_URL}/recruiter/applications/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('internlink_token')}`
                },
                body: JSON.stringify({ status, notes: `Status changed to ${status}` })
            })
            if (!response.ok) throw new Error('Update failed')
            setApplicants(applicants.map(a => a.id === id ? { ...a, status } : a))
        } catch (err) {
            alert(err.message)
        }
    }

    const downloadResume = async (app) => {
        try {
            const response = await fetch(`${API_BASE_URL}/recruiter/applicants/${app.id}/resume/download`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('internlink_token')}`
                }
            })
            if (!response.ok) throw new Error('Download failed')
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `resume_${app.applicant_name.replace(/ /g, '_')}.pdf`
            document.body.appendChild(a)
            a.click()
            a.remove()
        } catch (err) {
            alert(err.message)
        }
    }

    const filtered = applicants.filter(a => {
        const nameMatch = (a.applicant_name || '').toLowerCase().includes(search.toLowerCase())
        const jobMatch = (a.job_title || '').toLowerCase().includes(search.toLowerCase())
        return nameMatch || jobMatch
    })

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>👥 {jobId ? 'Job Applicants' : 'All Applicants'}</h1>
                <p>{jobId ? 'Manage candidates for this listing' : 'Review and manage all applicants across your jobs'}</p>
            </div>

            <div className="applicants-controls">
                <div className="search-bar" style={{ maxWidth: '300px' }}>
                    <FiSearch className="search-icon" />
                    <input placeholder="Search by name or job..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>

            <div className="glass-card">
                {loading ? (
                    <p style={{ textAlign: 'center', padding: '2rem' }}>Loading applicants...</p>
                ) : filtered.map(app => (
                    <div className="applicant-row" key={app.id}>
                        <div className="avatar" style={{ background: 'var(--gradient-primary)' }}>{app.applicant_name?.[0]}</div>
                        <div className="applicant-details">
                            <strong>{app.applicant_name}</strong>
                            <small>{app.job_title} · Applied {new Date(app.applied_at).toLocaleDateString()}</small>
                            <div className="applicant-skills">
                                <span className="tag" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>{Math.round(app.matching_score || 0)}% Match</span>
                            </div>
                        </div>
                        <div className="applicant-actions">
                            <select className="status-select" value={app.status} onChange={e => updateStatus(app.id, e.target.value)}>
                                <option value="applied">Applied</option>
                                <option value="shortlisted">Shortlisted</option>
                                <option value="interview_scheduled">Interview</option>
                                <option value="selected">Selected</option>
                                <option value="rejected">Rejected</option>
                            </select>
                            <button className="btn btn-sm btn-secondary" title="Download Resume" onClick={() => downloadResume(app)}><FiDownload /></button>
                        </div>
                    </div>
                ))}
                {!loading && filtered.length === 0 && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No applicants found.</p>}
            </div>
        </div>
    )
}
