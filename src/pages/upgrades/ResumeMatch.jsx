import { useState, useEffect } from 'react'
import api from '../../api/api'
import './UpgradePages.css'

export default function ResumeMatch() {
    const [matchData, setMatchData] = useState(null)
    const [jobs, setJobs] = useState([])
    const [selectedJobId, setSelectedJobId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        loadJobs()
    }, [])

    const loadJobs = async () => {
        try {
            const data = await api.get('/users/jobs/search?page_size=10')
            const jobList = data.jobs || []
            setJobs(jobList)
            if (jobList.length > 0) {
                setSelectedJobId(jobList[0].id)
                loadMatch(jobList[0].id)
            } else {
                setLoading(false)
            }
        } catch (err) {
            setError('Failed to load jobs')
            setLoading(false)
        }
    }

    const loadMatch = async (jobId) => {
        setLoading(true)
        setError('')
        try {
            const data = await api.get(`/ai/resume-match/${jobId}`)
            setMatchData(data)
        } catch (err) {
            setError(err.message || 'Upload a resume first to see match results.')
            setMatchData(null)
        } finally {
            setLoading(false)
        }
    }

    const handleJobChange = (jobId) => {
        setSelectedJobId(Number(jobId))
        loadMatch(Number(jobId))
    }

    const score = matchData?.overall_score || 0
    const circumference = 2 * Math.PI * 54
    const dashOffset = circumference - (circumference * score) / 100

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>🎯 Smart Resume Match</h1>
                <p>See how well your resume matches with job requirements</p>
            </div>

            {jobs.length > 0 && (
                <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Select a job to match against:</label>
                    <select className="input-field" value={selectedJobId || ''} onChange={e => handleJobChange(e.target.value)} style={{ maxWidth: '400px' }}>
                        {jobs.map(j => <option key={j.id} value={j.id}>{j.title} — {j.company_name || 'Company'}</option>)}
                    </select>
                </div>
            )}

            {loading && <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>Analyzing your resume against job requirements...</div>}

            {error && <div className="glass-card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</p>
                <p>{error}</p>
            </div>}

            {matchData && !loading && (
                <>
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
                                    <text x="60" y="56" textAnchor="middle" fill="white" fontSize="28" fontWeight="800">{Math.round(score)}%</text>
                                    <text x="60" y="74" textAnchor="middle" fill="#94a3b8" fontSize="10">Match Score</text>
                                </svg>
                            </div>
                            <p className="match-description">
                                {score >= 80 ? 'Excellent match!' : score >= 60 ? 'Good match' : score >= 40 ? 'Moderate match' : 'Low match'} for <strong>{matchData.job_title}</strong>
                            </p>
                            <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                <p>Skill Match: <strong>{Math.round(matchData.skill_match_score || 0)}%</strong> · Keyword Match: <strong>{Math.round(matchData.keyword_match_score || 0)}%</strong></p>
                            </div>
                        </div>

                        <div className="glass-card">
                            <h3>Matched Skills ✅</h3>
                            <div className="tags-container" style={{ marginTop: '0.5rem' }}>
                                {(matchData.matched_skills || []).length > 0 ? (
                                    matchData.matched_skills.map(s => <span className="tag" key={s} style={{ borderColor: '#10b981' }}>{s}</span>)
                                ) : (
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No matching skills found yet. Upload a resume to get started.</p>
                                )}
                            </div>

                            <h3 style={{ marginTop: '1.5rem' }}>Missing Skills ⚠️</h3>
                            <div className="tags-container" style={{ marginTop: '0.5rem' }}>
                                {(matchData.missing_skills || []).length > 0 ? (
                                    matchData.missing_skills.map(s => <span className="tag" key={s} style={{ borderColor: '#ef4444' }}>{s}</span>)
                                ) : (
                                    <p style={{ fontSize: '0.85rem', color: 'var(--accent-green)' }}>You have all the required skills! 🎉</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {matchData.recommendations && matchData.recommendations.length > 0 && (
                        <div className="glass-card" style={{ marginTop: '1.5rem' }}>
                            <h3>💡 Improvement Suggestions</h3>
                            <div className="suggestions-list">
                                {matchData.recommendations.map((rec, i) => (
                                    <div className="suggestion-item" key={i}>
                                        <span className="suggestion-icon">📚</span>
                                        <div><strong>{rec}</strong></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
