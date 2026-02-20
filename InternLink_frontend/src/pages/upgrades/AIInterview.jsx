import { useState } from 'react'
import { FiSend } from 'react-icons/fi'
import './UpgradePages.css'

const initialMessages = [
    { role: 'ai', text: "Hello! I'm your AI Interview Coach. 👋 I'll help you prepare for technical and behavioral interviews. Which role are you preparing for?" },
]

const aiResponses = [
    "Great choice! Let me start with a common question for that role.\n\n**Tell me about yourself and why you're interested in this position.**\n\nTip: Structure your answer using the Present-Past-Future formula.",
    "That's a good start! Here are some improvements:\n\n✅ **Strengths**: You gave concrete examples\n⚠️ **Improve**: Add more specific metrics and outcomes\n\n**Next question**: Describe a challenging project you worked on. What was your role, and what was the outcome?",
    "Excellent! You're doing well. Let me ask a technical question now.\n\n**What is the difference between == and === in JavaScript?**\n\nTake your time to think through the answer.",
    "Perfect answer! 🎯\n\n**Your interview readiness score: 78/100**\n\nKey areas to improve:\n1. Add more quantitative results to behavioral answers\n2. Practice system design questions\n3. Work on time management during coding challenges\n\nWould you like to continue practicing?",
]

export default function AIInterview() {
    const [messages, setMessages] = useState(initialMessages)
    const [input, setInput] = useState('')
    const [responseIdx, setResponseIdx] = useState(0)

    const sendMessage = () => {
        if (!input.trim()) return
        const newMessages = [...messages, { role: 'user', text: input }]
        setMessages(newMessages)
        setInput('')

        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'ai', text: aiResponses[responseIdx % aiResponses.length] }])
            setResponseIdx(i => i + 1)
        }, 1000)
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>🤖 AI Interview Preparation</h1>
                <p>Practice mock interviews with our AI coach</p>
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
                    <h3>📋 Interview Tips</h3>
                    <div className="suggestions-list">
                        <div className="suggestion-item"><span className="suggestion-icon">🎯</span><div><strong>Use the STAR Method</strong><p>Situation, Task, Action, Result</p></div></div>
                        <div className="suggestion-item"><span className="suggestion-icon">⏱️</span><div><strong>Keep answers under 2 minutes</strong><p>Be concise but thorough</p></div></div>
                        <div className="suggestion-item"><span className="suggestion-icon">💡</span><div><strong>Ask clarifying questions</strong><p>Shows critical thinking</p></div></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
