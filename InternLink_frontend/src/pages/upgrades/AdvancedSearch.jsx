import { useState } from 'react'
import { mockJobs } from '../../data/mockData'
import { FiMapPin, FiDollarSign, FiBriefcase, FiClock, FiUsers, FiBookmark, FiSave } from 'react-icons/fi'
import './UpgradePages.css'

export default function AdvancedSearch() {
    const [jobType, setJobType] = useState([])
    const [locations, setLocations] = useState([])
    const [stipendRange, setStipendRange] = useState(0)
    const [savedSearches, setSavedSearches] = useState(['React Internship in Bengaluru', 'Remote Data Science'])

    const toggleFilter = (arr, setArr, val) => {
        setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
    }

    const filtered = mockJobs.filter(j => {
        const matchType = jobType.length === 0 || jobType.includes(j.type)
        const matchLoc = locations.length === 0 || locations.some(l => j.location.toLowerCase().includes(l.toLowerCase()))
        const matchStipend = j.stipendValue >= stipendRange
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
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{filtered.length} results found</p>
                    <div className="jobs-grid">
                        {filtered.map(job => (
                            <div className="job-card" key={job.id}>
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
                                    </div>
                                    <span className="applicant-count"><FiUsers /> {job.applicants}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
