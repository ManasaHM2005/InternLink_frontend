import { useState, useEffect } from 'react'
import { FiMapPin, FiDollarSign, FiBriefcase, FiClock, FiUsers, FiBookmark, FiSave } from 'react-icons/fi'
import api from '../../api/api'
import './UpgradePages.css'

export default function AdvancedSearch() {
    const [jobType, setJobType] = useState([])
    const [locations, setLocations] = useState([])
    const [stipendRange, setStipendRange] = useState(0)
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(false)
    const [savedSearches, setSavedSearches] = useState(['React Internship in Bengaluru', 'Remote Data Science'])

    const toggleFilter = (arr, setArr, val) => {
        setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
    }

    useEffect(() => {
        fetchJobs()
    }, [jobType, locations, stipendRange])

    const fetchJobs = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (locations.length > 0) params.append('location', locations.join(','))
            if (stipendRange > 0) params.append('stipend_min', stipendRange)
            if (jobType.length > 0) params.append('job_type', jobType.join(','))
            params.append('page_size', '50')
            const data = await api.get(`/users/jobs/search?${params.toString()}`)
            setJobs(data.jobs || [])
        } catch (err) {
            console.error('Search error:', err)
            setJobs([])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>🔎 Advanced Search</h1>
                <p>Fine-tune your search with powerful filters</p>
            </div>

            {savedSearches.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <FiBookmark style={{ color: 'var(--text-muted)' }} />
                    {savedSearches.map((s, i) => (
                        <span className="saved-search-tag" key={i}>{s}</span>
                    ))}
                </div>
            )}

            <div className="advanced-search-panel">
                {/* Filters Panel */}
                <div className="glass-card filter-panel">
                    <div className="filter-section">
                        <h4>Job Type</h4>
                        <div className="checkbox-group">
                            {['Internship', 'Full-time', 'Part-time', 'Contract'].map(t => (
                                <label key={t}>
                                    <input type="checkbox" checked={jobType.includes(t)} onChange={() => toggleFilter(jobType, setJobType, t)} />
                                    {t}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="filter-section">
                        <h4>Location</h4>
                        <div className="checkbox-group">
                            {['Bengaluru', 'Hyderabad', 'Mumbai', 'Pune', 'Chennai', 'Remote'].map(l => (
                                <label key={l}>
                                    <input type="checkbox" checked={locations.includes(l)} onChange={() => toggleFilter(locations, setLocations, l)} />
                                    {l}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="filter-section">
                        <h4>Min Stipend</h4>
                        <div className="range-slider">
                            <input type="range" min="0" max="100000" step="5000" value={stipendRange} onChange={e => setStipendRange(Number(e.target.value))} />
                            <div className="range-labels">
                                <span>₹0</span>
                                <span>₹{stipendRange.toLocaleString()}</span>
                                <span>₹1,00,000</span>
                            </div>
                        </div>
                    </div>

                    <button className="btn btn-secondary btn-sm" onClick={() => { setSavedSearches([...savedSearches, `Search ${savedSearches.length + 1}`]) }}>
                        <FiSave /> Save This Search
                    </button>
                </div>

                {/* Results */}
                <div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{loading ? 'Searching...' : `${jobs.length} results found`}</p>
                    <div className="jobs-grid">
                        {jobs.map(job => (
                            <div className="job-card" key={job.id}>
                                <div className="job-card-header">
                                    <div className="job-logo">💼</div>
                                    <div>
                                        <div className="job-title">{job.title}</div>
                                        <div className="job-company">{job.company_name || 'Company'}</div>
                                    </div>
                                </div>
                                <div className="job-meta">
                                    <span><FiMapPin /> {job.location || 'Remote'}</span>
                                    {job.stipend_min && <span><FiDollarSign /> ₹{job.stipend_min}</span>}
                                    <span><FiBriefcase /> {job.job_type || 'Internship'}</span>
                                    {job.created_at && <span><FiClock /> {new Date(job.created_at).toLocaleDateString()}</span>}
                                </div>
                                <div className="job-card-footer">
                                    <div className="tags-container">
                                        {(job.skills_required || []).slice(0, 3).map(s => <span className="tag" key={s}>{s}</span>)}
                                    </div>
                                    {job.openings && <span className="applicant-count"><FiUsers /> {job.openings} openings</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
