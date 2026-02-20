import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth, API_BASE_URL } from '../../context/AuthContext'
import { FiSearch, FiMapPin, FiDollarSign, FiBriefcase, FiClock, FiUsers, FiX } from 'react-icons/fi'
import './UserPages.css'

export default function JobSearch() {
    const { user } = useAuth()
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [location, setLocation] = useState('')
    const [skill, setSkill] = useState('')
    const [minStipend, setMinStipend] = useState('')
    const [selectedJob, setSelectedJob] = useState(null)
    const [applied, setApplied] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        fetchJobs()
    }, [searchTerm, location, skill, minStipend])

    const fetchJobs = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (searchTerm) params.append('query', searchTerm)
            if (location) params.append('location', location)
            if (skill) params.append('skills', skill)
            if (minStipend) params.append('stipend_min', minStipend)

            const response = await fetch(`${API_BASE_URL}/users/jobs/search?${params.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('internlink_token')}`
                }
            })
            if (!response.ok) throw new Error('Failed to fetch jobs')
            const data = await response.json()
            setJobs(data.jobs)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleApply = async (jobId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/jobs/${jobId}/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('internlink_token')}`
                },
                body: JSON.stringify({ cover_letter: "I am interested in this position." })
            })
            if (!response.ok) {
                const err = await response.json()
                throw new Error(err.detail || 'Application failed')
            }
            setApplied([...applied, jobId])
            alert('Applied successfully!')
        } catch (err) {
            alert(err.message)
        }
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>🔍 Search Jobs & Internships</h1>
                <p>Find the perfect opportunity that matches your skills</p>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="search-bar" style={{ maxWidth: '280px' }}>
                    <FiSearch className="search-icon" />
                    <input placeholder="Search by title or company..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <div style={{ position: 'relative' }}>
                    <input className="input-field" placeholder="📍 Location" value={location} onChange={e => setLocation(e.target.value)} style={{ paddingLeft: '0.75rem', minWidth: '160px' }} />
                </div>
                <div>
                    <input className="input-field" placeholder="🛠️ Skill" value={skill} onChange={e => setSkill(e.target.value)} style={{ minWidth: '140px' }} />
                </div>
                <div>
                    <input className="input-field" type="number" placeholder="💰 Min Stipend" value={minStipend} onChange={e => setMinStipend(e.target.value)} style={{ minWidth: '140px' }} />
                </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {loading ? 'Searching...' : `Showing ${jobs.length} results`}
            </p>

            {/* Job Cards Grid */}
            <div className="jobs-grid">
                {jobs.map(job => (
                    <div className="job-card" key={job.id} onClick={() => setSelectedJob(job)}>
                        <div className="job-card-header">
                            <div className="job-logo">{job.company_name?.[0] || '🏢'}</div>
                            <div>
                                <div className="job-title">{job.title}</div>
                                <div className="job-company">{job.company_name}</div>
                            </div>
                            <div className="match-badge" style={{ marginLeft: 'auto' }}>{job.matchScore || 0}%</div>
                        </div>
                        <div className="job-meta">
                            <span><FiMapPin /> {job.location}</span>
                            <span><FiDollarSign /> {job.stipend_min} - {job.stipend_max}</span>
                            <span><FiBriefcase /> {job.job_type}</span>
                            <span><FiClock /> {new Date(job.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="job-card-footer">
                            <div className="tags-container">
                                {job.skills_required?.slice(0, 3).map(s => <span className="tag" key={s}>{s}</span>)}
                                {job.skills_required?.length > 3 && <span className="tag">+{job.skills_required.length - 3}</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {!loading && jobs.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</p>
                    <p>No jobs match your filters. Try adjusting your search.</p>
                </div>
            )}

            {/* Job Detail Modal */}
            {selectedJob && (
                <div className="modal-overlay" onClick={() => setSelectedJob(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
                        <div className="modal-header">
                            <h2>🏢 {selectedJob.title}</h2>
                            <button className="modal-close" onClick={() => setSelectedJob(null)}><FiX /></button>
                        </div>
                        <div className="job-detail-content">
                            <div>
                                <p style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>{selectedJob.company_name}</p>
                                <div className="job-meta" style={{ marginTop: '0.5rem' }}>
                                    <span><FiMapPin /> {selectedJob.location}</span>
                                    <span><FiDollarSign /> {selectedJob.stipend_min} - {selectedJob.stipend_max}</span>
                                    <span><FiBriefcase /> {selectedJob.job_type}</span>
                                </div>
                            </div>
                            <div>
                                <h3>Description</h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{selectedJob.description}</p>
                            </div>
                            <div>
                                <h3>Requirements</h3>
                                <p style={{ fontSize: '0.875rem' }}>{selectedJob.requirements}</p>
                            </div>
                            <div>
                                <h3>Skills</h3>
                                <div className="tags-container">
                                    {selectedJob.skills_required?.map(s => <span className="tag" key={s}>{s}</span>)}
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
                                {applied.includes(selectedJob.id) ? (
                                    <button className="btn btn-success btn-lg" style={{ flex: 1 }} disabled>✓ Applied</button>
                                ) : (
                                    <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={() => handleApply(selectedJob.id)}>Apply Now</button>
                                )}
                                <button className="btn btn-secondary btn-lg" style={{ flex: 1 }}>Save Job</button>
                            </div>
                            <div className="glass-card" style={{ marginTop: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>✨ AI-Powered Upgrades Available</p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                                    <Link to={`/resume-match/${selectedJob.id}`} className="btn btn-sm btn-secondary" style={{ fontSize: '0.7rem' }}>Resume Match</Link>
                                    <Link to={`/skill-gap/${selectedJob.id}`} className="btn btn-sm btn-secondary" style={{ fontSize: '0.7rem' }}>Skill Gap</Link>
                                    <Link to={`/ai-interview/${selectedJob.id}`} className="btn btn-sm btn-secondary" style={{ fontSize: '0.7rem' }}>AI Interview</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
