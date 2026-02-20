import { useState, useEffect } from 'react'
import { FiSearch, FiMapPin, FiDollarSign, FiBriefcase, FiClock, FiUsers, FiX } from 'react-icons/fi'
import api from '../../api/api'
import './UserPages.css'

export default function JobSearch() {
    const [searchTerm, setSearchTerm] = useState('')
    const [location, setLocation] = useState('')
    const [skill, setSkill] = useState('')
    const [minStipend, setMinStipend] = useState('')
    const [selectedJob, setSelectedJob] = useState(null)
    const [applied, setApplied] = useState([])
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [applyingId, setApplyingId] = useState(null)

    useEffect(() => {
        fetchJobs()
    }, [])

    const fetchJobs = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (searchTerm) params.append('query', searchTerm)
            if (location) params.append('location', location)
            if (skill) params.append('skills', skill)
            if (minStipend) params.append('stipend_min', minStipend)
            params.append('page_size', '50')
            const data = await api.get(`/users/jobs/search?${params.toString()}`)
            setJobs(data.jobs || [])
        } catch (err) {
            console.error('Failed to fetch jobs:', err)
            setJobs([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => fetchJobs(), 500)
        return () => clearTimeout(timer)
    }, [searchTerm, location, skill, minStipend])

    const handleApply = async (jobId) => {
        setApplyingId(jobId)
        try {
            await api.post(`/users/jobs/${jobId}/apply`, {
                job_id: jobId,
                cover_letter: 'I am interested in this position.'
            })
            setApplied([...applied, jobId])
        } catch (err) {
            alert(err.message || 'Failed to apply')
        } finally {
            setApplyingId(null)
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
                            <div className="job-logo">💼</div>
                            <div>
                                <div className="job-title">{job.title}</div>
                                <div className="job-company">{job.company_name || 'Company'}</div>
                            </div>
                        </div>
                        <div className="job-meta">
                            <span><FiMapPin /> {job.location || 'Remote'}</span>
                            {job.stipend_min && <span><FiDollarSign /> ₹{job.stipend_min}{job.stipend_max ? ` - ₹${job.stipend_max}` : ''}</span>}
                            <span><FiBriefcase /> {job.job_type || 'Internship'}</span>
                            {job.created_at && <span><FiClock /> {new Date(job.created_at).toLocaleDateString()}</span>}
                        </div>
                        <div className="job-card-footer">
                            <div className="tags-container">
                                {(job.skills_required || []).slice(0, 3).map(s => <span className="tag" key={s}>{s}</span>)}
                                {(job.skills_required || []).length > 3 && <span className="tag">+{job.skills_required.length - 3}</span>}
                            </div>
                            {job.openings && <span className="applicant-count"><FiUsers /> {job.openings} openings</span>}
                        </div>
                    </div>
                ))}
            </div>

            {!loading && jobs.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</p>
                    <p>No jobs found. Try adjusting your search filters.</p>
                </div>
            )}

            {/* Job Detail Modal */}
            {selectedJob && (
                <div className="modal-overlay" onClick={() => setSelectedJob(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
                        <div className="modal-header">
                            <h2>💼 {selectedJob.title}</h2>
                            <button className="modal-close" onClick={() => setSelectedJob(null)}><FiX /></button>
                        </div>
                        <div className="job-detail-content">
                            <div>
                                <p style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>{selectedJob.company_name || 'Company'}</p>
                                <div className="job-meta" style={{ marginTop: '0.5rem' }}>
                                    <span><FiMapPin /> {selectedJob.location || 'Remote'}</span>
                                    {selectedJob.stipend_min && <span><FiDollarSign /> ₹{selectedJob.stipend_min}</span>}
                                    <span><FiBriefcase /> {selectedJob.job_type || 'Internship'}</span>
                                </div>
                            </div>
                            {selectedJob.description && (
                                <div>
                                    <h3>Description</h3>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{selectedJob.description}</p>
                                </div>
                            )}
                            {selectedJob.requirements && (
                                <div>
                                    <h3>Requirements</h3>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{selectedJob.requirements}</p>
                                </div>
                            )}
                            {selectedJob.skills_required && selectedJob.skills_required.length > 0 && (
                                <div>
                                    <h3>Skills</h3>
                                    <div className="tags-container">
                                        {selectedJob.skills_required.map(s => <span className="tag" key={s}>{s}</span>)}
                                    </div>
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                {applied.includes(selectedJob.id) ? (
                                    <button className="btn btn-success btn-lg" disabled>✓ Applied</button>
                                ) : (
                                    <button className="btn btn-primary btn-lg" onClick={() => handleApply(selectedJob.id)} disabled={applyingId === selectedJob.id}>
                                        {applyingId === selectedJob.id ? 'Applying...' : 'Apply Now'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
