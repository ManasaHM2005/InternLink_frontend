import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { API_BASE_URL } from '../../context/AuthContext'
import './UpgradePages.css'

export default function SkillGap() {
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
            const response = await fetch(`${API_BASE_URL}/ai/skill-gap/${jobId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('internlink_token')}` }
            })
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}))
                throw new Error(errData.detail || 'Failed to fetch skill gap analysis')
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
                <p>Analyzing skill gaps... Please wait.</p>
            </div>
        </div>
    )

    if (error) return (
        <div className="page-container">
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                <h2 style={{ color: '#ef4444' }}>Oops! Analysis Failed</h2>
                <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>{error}</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link to="/jobs" className="btn btn-primary">Try Another Job</Link>
                    <Link to="/profile" className="btn btn-secondary">Update My Skills</Link>
                </div>
            </div>
        </div>
    )

    if (!jobId || !analysis) return (
        <div className="page-container">
            <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📊</div>
                <h2>Skill Gap Analysis</h2>
                <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '1rem auto 2rem' }}>
                    Compare your profile skills against specific job requirements to see where you stand and get personalized learning recommendations.
                </p>
                <Link to="/jobs" className="btn btn-primary btn-lg">Browse Jobs to Compare</Link>
            </div>
        </div>
    )

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>📊 Skill Gap Analysis</h1>
                <p>Compare your skills against <strong>{analysis.job_title}</strong> requirements</p>
            </div>

            <div className="skillgap-layout">
                <div className="glass-card gap-analysis-card">
                    <h3 className="section-title">Gap Analysis</h3>
                    <div className="radar-placeholder">
                        <div className="radar-bars" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {analysis.required_skills.map(skill => {
                                const isMatched = analysis.matched_skills.includes(skill)
                                return (
                                    <div className="radar-bar-item" key={skill}>
                                        <div className="radar-bar-label" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                            <span style={{ fontWeight: 600, color: 'white' }}>{skill}</span>
                                            <span style={{ color: isMatched ? '#10b981' : '#f59e0b', fontSize: '0.8rem', fontWeight: 600 }}>{isMatched ? 'MATCHED ✓' : 'MISSING ⚠'}</span>
                                        </div>
                                        <div className="radar-bar-track" style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                            <div className="radar-bar-yours" style={{
                                                width: isMatched ? '100%' : '20%',
                                                height: '100%',
                                                background: isMatched ? 'var(--gradient-success)' : 'rgba(245, 158, 11, 0.2)',
                                                transition: 'width 1s ease-in-out',
                                                borderRadius: '10px'
                                            }}></div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-card stat-card" style={{ textAlign: 'center' }}>
                        <h3 className="section-title" style={{ justifyContent: 'center' }}>Match Confidence</h3>
                        <div className="gap-summary" style={{ marginTop: '1rem' }}>
                            <div className="stat-info">
                                <h1 style={{ fontSize: '3.5rem', fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    {Math.round(100 - analysis.gap_percentage)}%
                                </h1>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Overall Compatibility</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3 className="section-title">🎓 Personalized Learning Path</h3>
                        <div className="suggestions-list" style={{ marginTop: '1rem' }}>
                            {analysis.learning_suggestions.map((s, i) => (
                                <div className="suggestion-item" key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                                    <span className="suggestion-icon" style={{ fontSize: '1.2rem' }}>{['📘', '🚀', '💡', '🎓'][i % 4]}</span>
                                    <div style={{ marginLeft: '1rem' }}>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{s}</p>
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
