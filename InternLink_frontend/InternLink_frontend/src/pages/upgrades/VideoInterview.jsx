import { useState } from 'react'
import { FiMic, FiCamera, FiPhoneOff, FiMonitor, FiMessageSquare } from 'react-icons/fi'
import './UpgradePages.css'

export default function VideoInterview() {
    const [inCall, setInCall] = useState(false)
    const [micOn, setMicOn] = useState(true)
    const [camOn, setCamOn] = useState(true)
    const [messages, setMessages] = useState([
        { id: 1, user: 'Aditya Patel', text: 'Hello! Can you hear me clearly?', time: '10:02 AM' }
    ])
    const [msgInput, setMsgInput] = useState('')

    const sendMessage = (e) => {
        e.preventDefault()
        if (!msgInput.trim()) return
        setMessages([...messages, {
            id: Date.now(),
            user: 'You',
            text: msgInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }])
        setMsgInput('')
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>🎥 Video Interview</h1>
                <p>Join your scheduled video interviews</p>
            </div>

            <div className="video-layout">
                <div className="video-section">
                    <div className="video-main">
                        {inCall ? (
                            <div className="active-call">
                                <div className="video-placeholder">
                                    <div className="camera-icon" style={{ fontSize: '4rem', opacity: 1 }}>📹</div>
                                    <p className="status-text" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Interview In Progress</p>
                                    <p className="timer">Connected · 00:05:23</p>
                                </div>
                                <div className="self-view">
                                    {camOn ? <div className="self-avatar">You</div> : <div className="self-avatar off">🚫</div>}
                                </div>
                            </div>
                        ) : (
                            <div className="pre-call">
                                <div className="camera-icon">📷</div>
                                <p>Your camera preview will appear here</p>
                                <button className="btn btn-primary btn-lg" onClick={() => setInCall(true)}>Join Interview</button>
                            </div>
                        )}
                    </div>

                    {inCall && (
                        <div className="video-controls">
                            <button className={`video-ctrl-btn mic ${!micOn ? 'off' : ''}`} onClick={() => setMicOn(!micOn)}>
                                <FiMic />
                            </button>
                            <button className={`video-ctrl-btn cam ${!camOn ? 'off' : ''}`} onClick={() => setCamOn(!camOn)}>
                                <FiCamera />
                            </button>
                            <button className="video-ctrl-btn screen"><FiMonitor /></button>
                            <button className="video-ctrl-btn end" onClick={() => setInCall(false)}><FiPhoneOff /></button>
                        </div>
                    )}
                </div>

                <div className="video-sidebar">
                    <div className="glass-card">
                        <h3 className="section-title">Interview Details</h3>
                        <div className="details-grid">
                            <div className="detail-item">
                                <span className="label">Role:</span>
                                <span className="value">Data Science Intern</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Company:</span>
                                <span className="value">AnalytiQ Corp</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Date:</span>
                                <span className="value">Feb 20, 2026</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Time:</span>
                                <span className="value">10:00 AM IST</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Duration:</span>
                                <span className="value">45 minutes</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3 className="section-title">Participants</h3>
                        <div className="participants-list">
                            <div className="participant-item">
                                <div className="avatar avatar-sm" style={{ background: 'var(--gradient-primary)' }}>Y</div>
                                <div className="participant-info">
                                    <span className="name">You</span>
                                    <span className="status-dot online"></span>
                                </div>
                            </div>
                            <div className="participant-item">
                                <div className="avatar avatar-sm" style={{ background: 'var(--gradient-secondary)' }}>A</div>
                                <div className="participant-info">
                                    <div className="name-role">
                                        <span className="name">Aditya Patel</span>
                                        <span className="role">Interviewer</span>
                                    </div>
                                    <span className={`status-dot ${inCall ? 'online' : ''}`}></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card chat-card">
                        <h3 className="section-title"><FiMessageSquare style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> Chat</h3>
                        <div className="chat-box">
                            {inCall ? (
                                <>
                                    <div className="messages-area">
                                        {messages.map(m => (
                                            <div key={m.id} className={`chat-msg ${m.user === 'You' ? 'mine' : 'theirs'}`}>
                                                <div className="msg-header">
                                                    <span className="sender">{m.user}</span>
                                                    <span className="time">{m.time}</span>
                                                </div>
                                                <div className="msg-text">{m.text}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <form className="chat-input" onSubmit={sendMessage}>
                                        <input
                                            placeholder="Type a message..."
                                            value={msgInput}
                                            onChange={e => setMsgInput(e.target.value)}
                                        />
                                        <button type="submit" className="btn btn-sm btn-primary">Send</button>
                                    </form>
                                </>
                            ) : (
                                <div className="chat-placeholder">
                                    Chat is available during the interview
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
