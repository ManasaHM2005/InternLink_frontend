import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { API_BASE_URL } from '../../context/AuthContext'
import './UpgradePages.css'

export default function ResumeMatch() {
    const { jobId } = useParams()
    const [analysis, setAnalysis] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (jobId) {
            fetchAnalysis()
        } else {
            setLoading(false)
        }
    }, [jobId])

    const fetchAnalysis = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch(`${API_BASE_URL}/ai/resume-match/${jobId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('internlink_token')}` }
            })
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}))
                throw new Error(errData.detail || 'Failed to fetch analysis. Make sure you have uploaded a resume in your profile.')
            }
            const data = await response.json()
            setAnalysis(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return (
        <div className="page-container">
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                <div className="loader" style={{ margin: '0 auto 1.5rem' }}></div>
                <p>Analyzing your resume... This may take a moment.</p>
            </div>
        </div>
    )

    if (error) return (
        <div className="page-container">
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                <h2 style={{ color: '#ef4444' }}>Oops! Analysis Failed</h2>
                <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>{error}</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link to="/profile" className="btn btn-primary">Go to Profile</Link>
                    <Link to="/jobs" className="btn btn-secondary">Back to Jobs</Link>
                </div>
            </div>
        </div>
    )

    if (!jobId || !analysis) return (
        <div className="page-container">
            <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🎯</div>
                <h2>Smart Resume Match</h2>
                <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '1rem auto 2rem' }}>
                    Get instant feedback on how well your resume matches with your dream internships. We'll show you exactly which keywords are missing and how to improve your score.
                </p>
                <Link to="/jobs" className="btn btn-primary btn-lg">Browse Jobs to Match</Link>
            </div>
        </div>
    )

    const circumference = 2 * Math.PI * 54
    const dashOffset = circumference - (circumference * analysis.overall_score) / 100

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>🎯 Smart Resume Match</h1>
                <p>See how well your resume matches with <strong>{analysis.job_title}</strong></p>
            </div>

            <div className="match-layout" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem', alignItems: 'start' }}>
                <div className="glass-card match-score-card" style={{ textAlign: 'center', padding: '2rem' }}>
                    <h3 className="section-title" style={{ justifyContent: 'center' }}>Match Confidence</h3>
                    <div className="score-circle-outer" style={{ position: 'relative', width: '160px', height: '160px', margin: '1.5rem auto' }}>
                        <svg width="160" height="160" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                            <circle cx="60" cy="60" r="54" fill="none" stroke="url(#scoreGradient)" strokeWidth="8"
                                strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset}
                                transform="rotate(-90 60 60)" style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} />
                            <defs>
                                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#10b981" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>{Math.round(analysis.overall_score)}%</span>
                        </div>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Resume Compatibility</p>
                </div>

                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <h3 className="section-title">Skill Matching</h3>
                    <div className="skill-bars" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
                        {[...analysis.matched_skills.map(s => ({ name: s, matched: true })),
                        ...analysis.missing_skills.map(s => ({ name: s, matched: false }))].map((skill, idx) => (
                            <div className="skill-item-card" key={idx} style={{
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid var(--border-glass)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: skill.matched ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                    color: skill.matched ? '#10b981' : '#f59e0b',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.9rem'
                                }}>{skill.matched ? '✓' : '⚠'}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>{skill.name}</div>
                                    <div style={{ fontSize: '0.7rem', color: skill.matched ? '#10b981' : '#f59e0b', marginTop: '0.15rem', fontWeight: 500 }}>
                                        {skill.matched ? 'MATCHED' : 'MISSING'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="glass-card" style={{ marginTop: '1.5rem', padding: '1.5rem' }}>
                <h3 className="section-title">💡 Strategic AI Recommendations</h3>
                <div className="recommendations-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '1rem' }}>
                    {analysis.recommendations.map((rec, i) => (
                        <div className="reco-item" key={i} style={{
                            display: 'flex',
                            gap: '1rem',
                            padding: '1.25rem',
                            background: 'rgba(255,255,255,0.01)',
                            border: '1px solid var(--border-glass)',
                            borderRadius: '16px'
                        }}>
                            <span className="suggestion-icon" style={{ fontSize: '1.5rem' }}>{['🎯', '📈', '🚀', '💡'][i % 4]}</span>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>{rec}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
