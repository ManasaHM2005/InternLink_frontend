import { useState, useEffect } from 'react'
import { FiMapPin, FiDollarSign, FiBriefcase } from 'react-icons/fi'
import api from '../../api/api'
import './UpgradePages.css'

export default function Recommendations() {
    const [recommendations, setRecommendations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        loadRecommendations()
    }, [])

    const loadRecommendations = async () => {
        try {
            const data = await api.get('/ai/recommendations')
            setRecommendations(Array.isArray(data) ? data : [])
        } catch (err) {
            // Fallback to search results
            try {
                const searchData = await api.get('/users/jobs/search?page_size=10')
                const jobs = (searchData.jobs || []).map(j => ({
                    job_id: j.id,
                    job_title: j.title,
                    company_name: j.company_name,
                    location: j.location,
                    stipend_min: j.stipend_min,
                    stipend_max: j.stipend_max,
                    job_type: j.job_type,
                    skills_required: j.skills_required || [],
                    match_score: 0,
                    reason: 'Available position',
                }))
                setRecommendations(jobs)
            } catch (_) {
                setError('Upload a resume to get personalized recommendations.')
            }
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="page-container"><div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>Loading recommendations...</div></div>
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>⚡ Personalized Recommendations</h1>
                <p>Jobs and internships curated just for you based on your profile</p>
            </div>

            {error && (
                <div className="glass-card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</p>
                    <p>{error}</p>
                </div>
            )}

            <div className="reco-grid">
                {recommendations.map((job, i) => (
                    <div className="reco-card" key={job.job_id || i}>
                        <div className="reco-match">{job.match_score ? `${Math.round(job.match_score)}%` : '—'}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            <div className="job-logo">💼</div>
                            <div>
                                <div className="job-title">{job.job_title || job.title}</div>
                                <div className="job-company">{job.company_name || 'Company'}</div>
                            </div>
                        </div>
                        <div className="job-meta">
                            <span><FiMapPin /> {job.location || 'Remote'}</span>
                            {job.stipend_min && <span><FiDollarSign /> ₹{job.stipend_min}</span>}
                            <span><FiBriefcase /> {job.job_type || 'Internship'}</span>
                        </div>
                        <div className="tags-container" style={{ margin: '0.5rem 0' }}>
                            {(job.skills_required || []).slice(0, 3).map(s => <span className="tag" key={s}>{s}</span>)}
                        </div>
                        {job.reason && <div className="reco-why">💡 {job.reason}</div>}
                    </div>
                ))}
            </div>

            {recommendations.length === 0 && !error && (
                <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <p>No recommendations available. Upload a resume to get started!</p>
                </div>
            )}
        </div>
    )
}
