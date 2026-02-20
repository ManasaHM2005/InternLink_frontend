import { useState, useEffect } from 'react'
import { FiSend } from 'react-icons/fi'
import api from '../../api/api'
import './UpgradePages.css'

export default function AIInterview() {
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Hi! I\'m your AI Interview Coach 🎯\n\nSelect a job below and I\'ll help you prepare with common interview questions, tips, and mock practice.' }
    ])
    const [input, setInput] = useState('')
    const [jobs, setJobs] = useState([])
    const [selectedJobId, setSelectedJobId] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        loadJobs()
    }, [])

    const loadJobs = async () => {
        try {
            const data = await api.get('/users/jobs/search?page_size=10')
            setJobs(data.jobs || [])
        } catch (err) {
            console.error('Failed to load jobs:', err)
        }
    }

    const startPractice = async (jobId) => {
        setSelectedJobId(jobId)
        setLoading(true)
        const job = jobs.find(j => j.id === Number(jobId))
        setMessages(prev => [...prev, { role: 'user', content: `Start interview prep for: ${job?.title || 'this position'}` }])
        try {
            const data = await api.get(`/ai/interview-prep/${jobId}`)
            const response = [
                `Great! Let's prepare for the **${data.job_title || job?.title}** role.`,
                '',
                '**Recommended Focus Areas:**',
                ...(data.focus_areas || []).map(f => `• ${f}`),
                '',
                '**Potential Interview Questions:**',
                ...(data.questions || []).map((q, i) => `${i + 1}. **${q.question}** (${q.difficulty})`),
                '',
                '**Expert Tips:**',
                ...(data.tips || []).map(t => `• ${t}`),
                '',
                'Would you like me to ask you practice questions? Just say "Practice" to begin!'
            ].join('\n')
            setMessages(prev => [...prev, { role: 'ai', content: response }])
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', content: `I couldn't fetch interview prep data: ${err.message}. Try uploading a resume first, then select a job.` }])
        } finally {
            setLoading(false)
        }
    }

    const sendMessage = async () => {
        if (!input.trim()) return
        const userMsg = input.trim()
        setInput('')
        setMessages(prev => [...prev, { role: 'user', content: userMsg }])
        setLoading(true)
        try {
            if (selectedJobId) {
                const data = await api.post(`/ai/interview-chat/${selectedJobId}`, { message: userMsg })
                setMessages(prev => [...prev, { role: 'ai', content: data.response || data.message || 'I don\'t have a response for that. Try asking about specific skills or behavioral questions!' }])
            } else {
                setMessages(prev => [...prev, { role: 'ai', content: 'Please select a job first to start interview preparation!' }])
            }
        } catch (err) {
            // Provide helpful fallback response
            const fallbacks = [
                'That\'s a great question to prepare for! Here are some tips:\n\n• **STAR Method**: Structure your answer using Situation, Task, Action, Result\n• **Be specific**: Use concrete examples from your experience\n• **Stay positive**: Even when discussing challenges, focus on what you learned',
                'Good practice! Remember these interview tips:\n\n• Research the company thoroughly\n• Prepare 2-3 questions to ask the interviewer\n• Practice answering out loud, not just in your head\n• Dress appropriately and arrive early',
            ]
            setMessages(prev => [...prev, { role: 'ai', content: fallbacks[Math.floor(Math.random() * fallbacks.length)] }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>🤖 AI Interview Coach</h1>
                <p>Practice with an AI-powered interview simulator</p>
            </div>

            {jobs.length > 0 && (
                <div className="glass-card" style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Select a job to practice for:</label>
                    <select className="input-field" value={selectedJobId || ''} onChange={e => startPractice(e.target.value)} style={{ maxWidth: '400px' }}>
                        <option value="">-- Choose a job --</option>
                        {jobs.map(j => <option key={j.id} value={j.id}>{j.title} — {j.company_name || 'Company'}</option>)}
                    </select>
                </div>
            )}

            <div className="chat-container">
                <div className="chat-messages">
                    {messages.map((msg, i) => (
                        <div className={`chat-msg ${msg.role}`} key={i}>
                            <div className="msg-avatar">{msg.role === 'ai' ? '🤖' : '👤'}</div>
                            <div className="msg-bubble">
                                {msg.content.split('\n').map((line, j) => (
                                    <p key={j} style={{ marginBottom: line === '' ? '0.5rem' : '0.15rem' }}
                                        dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                ))}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="chat-msg ai">
                            <div className="msg-avatar">🤖</div>
                            <div className="msg-bubble typing">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="chat-input-bar">
                    <input
                        type="text"
                        className="chat-input"
                        placeholder="Ask about interview tips, practice questions..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    />
                    <button className="btn btn-primary chat-send" onClick={sendMessage} disabled={loading}>
                        <FiSend />
                    </button>
                </div>
            </div>
        </div>
    )
}
