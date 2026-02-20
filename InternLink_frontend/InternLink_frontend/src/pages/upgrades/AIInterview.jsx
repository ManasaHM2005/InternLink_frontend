import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiSend, FiArrowLeft } from 'react-icons/fi'
import { API_BASE_URL } from '../../context/AuthContext'
import './UpgradePages.css'

export default function AIInterview() {
    const { jobId } = useParams()
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [prepData, setPrepData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (jobId) {
            fetchPrep()
        } else {
            setMessages([{
                role: 'ai',
                text: "Hello! I'm your AI Interview Coach. 👋\n\nTo start a targeted mock interview, please select a job from the search page. I'll then generate specific questions based on that job's requirements and your profile."
            }])
            setLoading(false)
        }
    }, [jobId])

    const fetchPrep = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch(`${API_BASE_URL}/ai/interview-prep/${jobId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('internlink_token')}` }
            })
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}))
                throw new Error(errData.detail || 'Failed to fetch interview preparation')
            }
            const data = await response.json()
            setPrepData(data)
            setMessages([
                { role: 'ai', text: `Hello! I've prepared a mock interview for the **${data.job_title}** position. 👋` },
                { role: 'ai', text: `Let's start! Here's the first question based on the job requirements:\n\n**${data.questions[0]}**` }
            ])
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const sendMessage = () => {
        if (!input.trim()) return
        const newMessages = [...messages, { role: 'user', text: input }]
        setMessages(newMessages)
        setInput('')

        // Simulate AI follow-up
        setTimeout(() => {
            const nextQ = prepData?.questions[messages.filter(m => m.role === 'user').length + 1]
            if (nextQ) {
                setMessages(prev => [...prev, { role: 'ai', text: `Great! Next question:\n\n**${nextQ}**` }])
            } else {
                setMessages(prev => [...prev, { role: 'ai', text: "That's all the questions I have for now! You're doing great. Check the tips on the right for more guidance." }])
            }
        }, 1000)
    }

    if (loading) return (
        <div className="page-container">
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                <div className="loader" style={{ margin: '0 auto 1.5rem' }}></div>
                <p>Generating personalized interview questions...</p>
            </div>
        </div>
    )

    if (error) return (
        <div className="page-container">
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                <h2 style={{ color: '#ef4444' }}>Preparation Failed</h2>
                <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>{error}</p>
                <Link to="/jobs" className="btn btn-primary">Back to Search</Link>
            </div>
        </div>
    )

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>🤖 AI Interview Preparation</h1>
                <p>{prepData ? `Practicing for ${prepData.job_title}` : 'Practice mock interviews with our AI coach'}</p>
            </div>

            <div className="interview-layout">
                {!jobId && (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', marginBottom: '2rem' }}>
                        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎙️</div>
                        <h3>No Job Selected</h3>
                        <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>
                            Select a job from the search page to start a realistic mock interview tailored to that role.
                        </p>
                        <Link to="/jobs" className="btn btn-primary">Find a Job to Practice</Link>
                    </div>
                )}

                <div className="glass-card ai-chat-card" style={{ display: 'flex', flexDirection: 'column', height: '600px', padding: 0, overflow: 'hidden' }}>
                    <div className="chat-container" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                        {messages.map((msg, i) => (
                            <div className={`chat-message ${msg.role === 'ai' ? 'ai' : 'user'}`} key={i} style={{
                                display: 'flex',
                                gap: '1rem',
                                marginBottom: '1.5rem',
                                flexDirection: msg.role === 'ai' ? 'row' : 'row-reverse'
                            }}>
                                <div className="msg-avatar" style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: msg.role === 'ai' ? 'var(--gradient-primary)' : 'var(--gradient-secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.2rem',
                                    flexShrink: 0
                                }}>{msg.role === 'ai' ? '🤖' : '👤'}</div>
                                <div className="msg-bubble" style={{
                                    maxWidth: '75%',
                                    padding: '1rem 1.25rem',
                                    borderRadius: '16px',
                                    background: msg.role === 'ai' ? 'rgba(255,255,255,0.05)' : 'var(--gradient-primary)',
                                    color: 'white',
                                    border: msg.role === 'ai' ? '1px solid var(--border-glass)' : 'none',
                                    borderTopLeftRadius: msg.role === 'ai' ? '4px' : '16px',
                                    borderTopRightRadius: msg.role === 'ai' ? '16px' : '4px',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.6',
                                    whiteSpace: 'pre-wrap'
                                }}>{msg.text}</div>
                            </div>
                        ))}
                    </div>
                    <div className="chat-input-bar" style={{
                        padding: '1.25rem',
                        background: 'rgba(255,255,255,0.02)',
                        borderTop: '1px solid var(--border-glass)',
                        display: 'flex',
                        gap: '0.75rem'
                    }}>
                        <input
                            placeholder={jobId ? "Type your answer..." : "Select a job first..."}
                            value={input}
                            disabled={!jobId}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMessage()}
                            style={{
                                flex: 1,
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid var(--border-glass)',
                                borderRadius: '12px',
                                padding: '0.75rem 1rem',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                        <button className="btn btn-primary" onClick={sendMessage} disabled={!jobId || !input.trim()} style={{ borderRadius: '12px', padding: '0 1.25rem' }}><FiSend /></button>
                    </div>
                </div>

                {prepData && (
                    <div className="glass-card" style={{ marginTop: '1.5rem' }}>
                        <h3 className="section-title">📋 Preparation Tips & Focus Areas</h3>
                        <div className="suggestions-list" style={{ marginTop: '1rem' }}>
                            {prepData.tips.map((tip, i) => (
                                <div className="suggestion-item" key={i}>
                                    <span className="suggestion-icon">💡</span>
                                    <div><strong>Tip {i + 1}</strong><p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{tip}</p></div>
                                </div>
                            ))}
                            {prepData.focus_areas.map((area, i) => (
                                <div className="suggestion-item" key={`area-${i}`}>
                                    <span className="suggestion-icon">🎯</span>
                                    <div><strong>Focus Area</strong><p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{area}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
