import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiSend } from 'react-icons/fi'
import { API_BASE_URL } from '../../context/AuthContext'
import './UpgradePages.css'

export default function AIInterview() {
    const { jobId } = useParams()
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [prepData, setPrepData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (jobId) fetchPrep()
        else {
            setMessages([{ role: 'ai', text: "Hello! I'm your AI Interview Coach. 👋 Please select a job from the search page to start a targeted mock interview." }])
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
            if (!response.ok) throw new Error('Failed to fetch interview preparation')
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

        // Simulate AI follow-up (in a real app, this would call an AI chat endpoint)
        setTimeout(() => {
            const nextQ = prepData?.questions[messages.filter(m => m.role === 'user').length + 1]
            if (nextQ) {
                setMessages(prev => [...prev, { role: 'ai', text: `Great! Next question:\n\n**${nextQ}**` }])
            } else {
                setMessages(prev => [...prev, { role: 'ai', text: "That's all the questions I have for now! You're doing great. Check the tips on the right for more guidance." }])
            }
        }, 1000)
    }

    if (loading) return <div className="page-container"><p>Generating interview questions...</p></div>
    if (error) return (
        <div className="page-container">
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                <h2>Oops! Preparation Failed</h2>
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
                <div className="glass-card">
                    <div className="chat-container">
                        {messages.map((msg, i) => (
                            <div className={`chat-message ${msg.role}`} key={i}>
                                <div className="msg-avatar">{msg.role === 'ai' ? '🤖' : '👤'}</div>
                                <div className="msg-bubble" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                            </div>
                        ))}
                    </div>
                    <div className="chat-input-bar">
                        <input
                            placeholder="Type your answer..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMessage()}
                        />
                        <button className="btn btn-primary" onClick={sendMessage}><FiSend /></button>
                    </div>
                </div>

                <div className="glass-card" style={{ marginTop: '1.5rem' }}>
                    <h3>📋 Preparation Tips & Focus Areas</h3>
                    <div className="suggestions-list">
                        {prepData?.tips.map((tip, i) => (
                            <div className="suggestion-item" key={i}>
                                <span className="suggestion-icon">💡</span>
                                <div><strong>Tip {i + 1}</strong><p>{tip}</p></div>
                            </div>
                        ))}
                        {prepData?.focus_areas.map((area, i) => (
                            <div className="suggestion-item" key={`area-${i}`}>
                                <span className="suggestion-icon">🎯</span>
                                <div><strong>Focus: {area}</strong></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
