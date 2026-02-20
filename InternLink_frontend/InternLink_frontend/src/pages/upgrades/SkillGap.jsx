import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { API_BASE_URL } from '../../context/AuthContext'
import './UpgradePages.css'

export default function SkillGap() {
    const { jobId } = useParams()
    const [analysis, setAnalysis] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (jobId) fetchAnalysis()
    }, [jobId])

    const fetchAnalysis = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch(`${API_BASE_URL}/ai/skill-gap/${jobId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('internlink_token')}` }
            })
            if (!response.ok) throw new Error('Failed to fetch skill gap analysis')
            const data = await response.json()
            setAnalysis(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="page-container"><p>Calculating skill gaps...</p></div>
    if (error) return (
        <div className="page-container">
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                <h2>Oops! Analysis Failed</h2>
                <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>{error}</p>
                <Link to="/jobs" className="btn btn-primary">Back to Search</Link>
            </div>
        </div>
    )
    if (!analysis) return <div className="page-container"><p>Please select a job to see skill gap analysis.</p></div>

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>📊 Skill Gap Analysis</h1>
                <p>Compare your skills against <strong>{analysis.job_title}</strong> requirements</p>
            </div>

            <div className="skillgap-layout">
                <div className="glass-card">
                    <h3>Gap Analysis</h3>
                    <div className="radar-placeholder">
                        <div className="radar-bars">
                            {analysis.required_skills.map(skill => {
                                const isMatched = analysis.matched_skills.includes(skill)
                                return (
                                    <div className="radar-bar-item" key={skill}>
                                        <div className="radar-bar-label">
                                            <span>{skill}</span>
                                            <span>{isMatched ? 'Matched' : 'Missing'}</span>
                                        </div>
                                        <div className="radar-bar-track">
                                            <div className="radar-bar-yours" style={{ width: isMatched ? '100%' : '0%', background: isMatched ? 'var(--accent-blue)' : 'var(--accent-warm)' }}></div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-card">
                        <h3>Match Summary</h3>
                        <div className="gap-summary" style={{ marginTop: '0.75rem' }}>
                            <div className="stat-info">
                                <h3>{Math.round(analysis.gap_percentage)}%</h3>
                                <p>Skill Gap Percentage</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3>🎓 AI Learning Suggestions</h3>
                        <div className="suggestions-list" style={{ marginTop: '0.5rem' }}>
                            {analysis.learning_suggestions.map((s, i) => (
                                <div className="suggestion-item" key={i}>
                                    <span className="suggestion-icon">📘</span>
                                    <div>
                                        <strong>{s}</strong>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
