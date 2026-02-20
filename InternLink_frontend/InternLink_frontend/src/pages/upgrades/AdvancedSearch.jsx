import { useState, useEffect, useCallback } from 'react'
import { useAuth, API_BASE_URL } from '../../context/AuthContext'
import { FiMapPin, FiDollarSign, FiBriefcase, FiClock, FiUsers, FiBookmark, FiSave } from 'react-icons/fi'
import './UpgradePages.css'

export default function AdvancedSearch() {
    const { } = useAuth()
    const [jobType, setJobType] = useState([])
    const [locations, setLocations] = useState([])
    const [stipendRange, setStipendRange] = useState(0)
    const [savedSearches, setSavedSearches] = useState(['React Internship in Bengaluru', 'Remote Data Science'])
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(false)

    const token = localStorage.getItem('internlink_token')

    const fetchJobs = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (jobType.length === 1) params.append('job_type', jobType[0].toLowerCase())
            if (locations.length === 1) params.append('location', locations[0])
            if (stipendRange > 0) params.append('stipend_min', stipendRange)
            params.append('page_size', 50)

            const res = await fetch(`${API_BASE_URL}/users/jobs/search?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setJobs(data.jobs || [])
            }
        } catch (err) {
            console.error('Advanced search error:', err)
        } finally {
            setLoading(false)
        }
    }, [jobType, locations, stipendRange, token])

    useEffect(() => {
        fetchJobs()
    }, [fetchJobs])

    const toggleFilter = (arr, setArr, val) => {
        setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
    }

    // Client-side filter for multi-select (backend only supports one value at a time)
    const filtered = jobs.filter(j => {
        const matchType = jobType.length === 0 || jobType.some(t => j.job_type?.toLowerCase() === t.toLowerCase())
        const matchLoc = locations.length === 0 || locations.some(l => j.location?.toLowerCase().includes(l.toLowerCase()) || (l === 'Remote' && j.is_remote))
        const matchStipend = (j.stipend_min || 0) >= stipendRange
        return matchType && matchLoc && matchStipend
    })

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
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        {loading ? 'Searching…' : `${filtered.length} results found`}
                    </p>
                    <div className="jobs-grid">
                        {filtered.map(job => (
                            <div className="job-card" key={job.id}>
                                <div className="job-card-header">
                                    <div className="job-logo">{job.company_name?.[0] || '🏢'}</div>
                                    <div>
                                        <div className="job-title">{job.title}</div>
                                        <div className="job-company">{job.company_name}</div>
                                    </div>
                                    <div className="match-badge" style={{ marginLeft: 'auto' }}>{job.job_type}</div>
                                </div>
                                <div className="job-meta">
                                    <span><FiMapPin /> {job.location}{job.is_remote ? ' (Remote)' : ''}</span>
                                    <span><FiDollarSign /> ₹{job.stipend_min?.toLocaleString()} {job.stipend_max && job.stipend_max !== job.stipend_min ? `- ₹${job.stipend_max?.toLocaleString()}` : ''}</span>
                                    <span><FiBriefcase /> {job.job_type}</span>
                                    <span><FiClock /> {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Open'}</span>
                                </div>
                                <div className="job-card-footer">
                                    <div className="tags-container">
                                        {job.skills_required?.slice(0, 3).map(s => <span className="tag" key={s}>{s}</span>)}
                                    </div>
                                    <span className="applicant-count"><FiUsers /> {job.openings} opening{job.openings !== 1 ? 's' : ''}</span>
                                </div>
                            </div>
                        ))}
                        {!loading && filtered.length === 0 && (
                            <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                No jobs match your filters.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
