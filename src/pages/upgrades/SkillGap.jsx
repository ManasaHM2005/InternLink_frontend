import { useState, useEffect } from 'react'
import api from '../../api/api'
import './UpgradePages.css'

export default function SkillGap() {
    const [gapData, setGapData] = useState(null)
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
                loadGap(jobList[0].id)
            } else {
                setLoading(false)
            }
        } catch (err) {
            setError('Failed to load jobs')
            setLoading(false)
        }
    }

    const loadGap = async (jobId) => {
        setLoading(true)
        setError('')
        try {
            const data = await api.get(`/ai/skill-gap/${jobId}`)
            setGapData(data)
        } catch (err) {
            setError(err.message || 'Upload a resume first to see skill gap analysis.')
            setGapData(null)
        } finally {
            setLoading(false)
        }
    }

    const handleJobChange = (jobId) => {
        setSelectedJobId(Number(jobId))
        loadGap(Number(jobId))
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>📊 Skill Gap Analysis</h1>
                <p>Compare your skills against job requirements</p>
            </div>

            {jobs.length > 0 && (
                <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Select a job to analyze:</label>
                    <select className="input-field" value={selectedJobId || ''} onChange={e => handleJobChange(e.target.value)} style={{ maxWidth: '400px' }}>
                        {jobs.map(j => <option key={j.id} value={j.id}>{j.title} — {j.company_name || 'Company'}</option>)}
                    </select>
                </div>
            )}

            {loading && <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>Analyzing skill gaps...</div>}

            {error && <div className="glass-card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</p>
                <p>{error}</p>
            </div>}

            {gapData && !loading && (
                <div className="skillgap-layout">
                    <div className="glass-card">
                        <h3>Your Skills vs Required ({gapData.job_title})</h3>
                        <div style={{ marginTop: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                                <div style={{ background: 'rgba(16,185,129,0.1)', padding: '1rem', borderRadius: '0.75rem', flex: 1, minWidth: '120px', textAlign: 'center' }}>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-green)' }}>{(gapData.matched_skills || []).length}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Matched Skills</p>
                                </div>
                                <div style={{ background: 'rgba(239,68,68,0.1)', padding: '1rem', borderRadius: '0.75rem', flex: 1, minWidth: '120px', textAlign: 'center' }}>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444' }}>{(gapData.missing_skills || []).length}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Missing Skills</p>
                                </div>
                                <div style={{ background: 'rgba(59,130,246,0.1)', padding: '1rem', borderRadius: '0.75rem', flex: 1, minWidth: '120px', textAlign: 'center' }}>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-blue)' }}>{Math.round(100 - (gapData.gap_percentage || 0))}%</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Coverage</p>
                                </div>
                            </div>

                            <h4 style={{ marginBottom: '0.5rem', color: 'var(--accent-green)' }}>✅ Skills You Have</h4>
                            <div className="tags-container" style={{ marginBottom: '1rem' }}>
                                {(gapData.matched_skills || []).map(s => <span className="tag" key={s}>{s}</span>)}
                                {(gapData.matched_skills || []).length === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Upload a resume to detect your skills</p>}
                            </div>

                            <h4 style={{ marginBottom: '0.5rem', color: '#ef4444' }}>⚠️ Skills to Learn</h4>
                            <div className="tags-container">
                                {(gapData.missing_skills || []).map(s => <span className="tag" key={s} style={{ borderColor: '#ef4444' }}>{s}</span>)}
                                {(gapData.missing_skills || []).length === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--accent-green)' }}>No gaps! You have all the required skills.</p>}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {gapData.learning_suggestions && gapData.learning_suggestions.length > 0 && (
                            <div className="glass-card">
                                <h3>🎓 Learning Suggestions</h3>
                                <div className="suggestions-list" style={{ marginTop: '0.5rem' }}>
                                    {gapData.learning_suggestions.map((s, i) => (
                                        <div className="suggestion-item" key={i}>
                                            <span className="suggestion-icon">📘</span>
                                            <div><strong>{s}</strong></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="glass-card">
                            <h3>Your Skills Profile</h3>
                            <div className="tags-container" style={{ marginTop: '0.5rem' }}>
                                {(gapData.user_skills || []).map(s => <span className="tag" key={s}>{s}</span>)}
                                {(gapData.user_skills || []).length === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No skills detected. Upload a resume to get started!</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
