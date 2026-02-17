import { useState } from 'react'
import { mockJobs } from '../../data/mockData'
import { FiSearch, FiMapPin, FiDollarSign, FiBriefcase, FiClock, FiUsers, FiX } from 'react-icons/fi'
import './UserPages.css'

export default function JobSearch() {
    const [searchTerm, setSearchTerm] = useState('')
    const [location, setLocation] = useState('')
    const [skill, setSkill] = useState('')
    const [minStipend, setMinStipend] = useState('')
    const [selectedJob, setSelectedJob] = useState(null)
    const [applied, setApplied] = useState([])

    const filtered = mockJobs.filter(job => {
        const matchSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.company.toLowerCase().includes(searchTerm.toLowerCase())
        const matchLocation = !location || job.location.toLowerCase().includes(location.toLowerCase())
        const matchSkill = !skill || job.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
        const matchStipend = !minStipend || job.stipendValue >= parseInt(minStipend)
        return matchSearch && matchLocation && matchSkill && matchStipend
    })

    const handleApply = (jobId) => {
        setApplied([...applied, jobId])
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
                Showing {filtered.length} results
            </p>

            {/* Job Cards Grid */}
            <div className="jobs-grid">
                {filtered.map(job => (
                    <div className="job-card" key={job.id} onClick={() => setSelectedJob(job)}>
                        <div className="job-card-header">
                            <div className="job-logo">{job.logo}</div>
                            <div>
                                <div className="job-title">{job.title}</div>
                                <div className="job-company">{job.company}</div>
                            </div>
                            <div className="match-badge" style={{ marginLeft: 'auto' }}>{job.matchScore}%</div>
                        </div>
                        <div className="job-meta">
                            <span><FiMapPin /> {job.location}</span>
                            <span><FiDollarSign /> {job.stipend}</span>
                            <span><FiBriefcase /> {job.type}</span>
                            <span><FiClock /> {job.posted}</span>
                        </div>
                        <div className="job-card-footer">
                            <div className="tags-container">
                                {job.skills.slice(0, 3).map(s => <span className="tag" key={s}>{s}</span>)}
                                {job.skills.length > 3 && <span className="tag">+{job.skills.length - 3}</span>}
                            </div>
                            <span className="applicant-count"><FiUsers /> {job.applicants}</span>
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
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
                            <h2>{selectedJob.logo} {selectedJob.title}</h2>
                            <button className="modal-close" onClick={() => setSelectedJob(null)}><FiX /></button>
                        </div>
                        <div className="job-detail-content">
                            <div>
                                <p style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>{selectedJob.company}</p>
                                <div className="job-meta" style={{ marginTop: '0.5rem' }}>
                                    <span><FiMapPin /> {selectedJob.location}</span>
                                    <span><FiDollarSign /> {selectedJob.stipend}</span>
                                    <span><FiBriefcase /> {selectedJob.type}</span>
                                </div>
                            </div>
                            <div>
                                <h3>Description</h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{selectedJob.description}</p>
                            </div>
                            <div>
                                <h3>Requirements</h3>
                                <ul>
                                    {selectedJob.requirements.map((r, i) => <li key={i}>{r}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h3>Skills</h3>
                                <div className="tags-container">
                                    {selectedJob.skills.map(s => <span className="tag" key={s}>{s}</span>)}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                {applied.includes(selectedJob.id) ? (
                                    <button className="btn btn-success btn-lg" disabled>✓ Applied</button>
                                ) : (
                                    <button className="btn btn-primary btn-lg" onClick={() => handleApply(selectedJob.id)}>Apply Now</button>
                                )}
                                <button className="btn btn-secondary btn-lg">Save Job</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
