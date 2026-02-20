import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiMapPin, FiDollarSign, FiBriefcase } from 'react-icons/fi'
import { API_BASE_URL } from '../../context/AuthContext'
import './UpgradePages.css'

export default function Recommendations() {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchRecommendations()
    }, [])

    const fetchRecommendations = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch(`${API_BASE_URL}/ai/recommendations`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('internlink_token')}` }
            })
            if (!response.ok) throw new Error('Failed to fetch recommendations')
            const data = await response.json()
            setJobs(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="page-container"><p>Curating your recommendations...</p></div>
    if (error) return <div className="page-container"><p style={{ color: 'var(--accent-warm)' }}>{error}</p></div>

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>⚡ Personalized Recommendations</h1>
                <p>Jobs and internships curated just for you based on your profile</p>
            </div>

            {jobs.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p>No recommendations yet. Try updating your profile skills!</p>
                    <Link to="/profile" className="btn btn-primary" style={{ marginTop: '1rem' }}>Update Profile</Link>
                </div>
            ) : (
                <div className="reco-grid">
                    {jobs.map((job) => (
                        <div className="reco-card" key={job.id}>
                            <div className="reco-match">{Math.round(job.score * 100)}%</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                <div className="job-logo">{job.company_name?.charAt(0) || 'J'}</div>
                                <div>
                                    <div className="job-title">{job.title}</div>
                                    <div className="job-company">{job.company_name}</div>
                                </div>
                            </div>
                            <div className="job-meta">
                                <span><FiMapPin /> {job.location}</span>
                                <span><FiDollarSign /> {job.stipend || 'Competitive'}</span>
                                <span><FiBriefcase /> {job.type}</span>
                            </div>
                            <div className="tags-container" style={{ margin: '0.5rem 0' }}>
                                {job.skills?.slice(0, 3).map(s => <span className="tag" key={s}>{s}</span>)}
                            </div>
                            <div className="reco-why">💡 Matches your top skills and interests</div>
                            <Link to={`/jobs?id=${job.id}`} className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem', width: '100%', justifyContent: 'center' }}>View & Apply</Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
