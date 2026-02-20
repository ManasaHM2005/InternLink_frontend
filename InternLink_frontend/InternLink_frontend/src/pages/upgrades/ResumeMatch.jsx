import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { API_BASE_URL } from '../../context/AuthContext'
import './UpgradePages.css'

export default function ResumeMatch() {
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
            const response = await fetch(`${API_BASE_URL}/ai/resume-match/${jobId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('internlink_token')}` }
            })
            if (!response.ok) throw new Error('Failed to fetch analysis. Make sure you have uploaded a resume in your profile.')
            const data = await response.json()
            setAnalysis(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="page-container"><p>Analyzing your resume...</p></div>
    if (error) return (
        <div className="page-container">
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                <h2>Oops! Analysis Failed</h2>
                <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>{error}</p>
                <Link to="/profile" className="btn btn-primary">Go to Profile</Link>
            </div>
        </div>
    )
    if (!analysis) return <div className="page-container"><p>Please select a job to see resume match analysis.</p></div>

    const circumference = 2 * Math.PI * 54
    const dashOffset = circumference - (circumference * analysis.overall_score) / 100

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>🎯 Smart Resume Match</h1>
                <p>See how well your resume matches with <strong>{analysis.job_title}</strong></p>
            </div>

            <div className="match-layout">
                <div className="glass-card match-score-card">
                    <h3>Overall Match Score</h3>
                    <div className="score-circle-container">
                        <svg width="140" height="140" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                            <circle cx="60" cy="60" r="54" fill="none" stroke="url(#scoreGradient)" strokeWidth="8"
                                strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset}
                                transform="rotate(-90 60 60)" style={{ transition: 'stroke-dashoffset 1.5s ease' }} />
                            <defs>
                                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#10b981" />
                                </linearGradient>
                            </defs>
                            <text x="60" y="56" textAnchor="middle" fill="white" fontSize="28" fontWeight="800">{Math.round(analysis.overall_score)}%</text>
                            <text x="60" y="74" textAnchor="middle" fill="#94a3b8" fontSize="10">Match Score</text>
                        </svg>
                    </div>
                </div>

                <div className="glass-card">
                    <h3>Skill Matching</h3>
                    <div className="skill-bars">
                        {analysis.matched_skills.map(skill => (
                            <div className="skill-bar-item" key={skill}>
                                <div className="skill-bar-header">
                                    <span>{skill}</span>
                                    <span style={{ color: 'var(--accent-green)' }}>Matched ✓</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: '100%', background: 'var(--gradient-success)' }}></div>
                                </div>
                            </div>
                        ))}
                        {analysis.missing_skills.map(skill => (
                            <div className="skill-bar-item" key={skill}>
                                <div className="skill-bar-header">
                                    <span>{skill}</span>
                                    <span style={{ color: 'var(--accent-warm)' }}>Missing</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: '0%', background: 'var(--gradient-warm)' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="glass-card" style={{ marginTop: '1.5rem' }}>
                <h3>💡 AI Recommendations</h3>
                <div className="suggestions-list">
                    {analysis.recommendations.map((rec, i) => (
                        <div className="suggestion-item" key={i}>
                            <span className="suggestion-icon">{i % 2 === 0 ? '📚' : '🎯'}</span>
                            <div>
                                <strong>{rec}</strong>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
