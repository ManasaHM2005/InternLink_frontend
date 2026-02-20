import { useState } from 'react'
import { FiMic, FiCamera, FiPhoneOff, FiMonitor, FiMessageSquare } from 'react-icons/fi'
import './UpgradePages.css'

export default function VideoInterview() {
    const [inCall, setInCall] = useState(false)
    const [micOn, setMicOn] = useState(true)
    const [camOn, setCamOn] = useState(true)

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>🎥 Video Interview</h1>
                <p>Join your scheduled video interviews</p>
            </div>

            <div className="video-layout">
                <div>
                    <div className="video-main">
                        {inCall ? (
                            <>
                                <div style={{ fontSize: '4rem' }}>📹</div>
                                <p style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Interview In Progress</p>
                                <p>Connected · 00:05:23</p>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    {!micOn && <span className="badge badge-rejected">Mic Off</span>}
                                    {!camOn && <span className="badge badge-rejected">Camera Off</span>}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="camera-icon">📷</div>
                                <p>Your camera preview will appear here</p>
                                <button className="btn btn-primary btn-lg" onClick={() => setInCall(true)}>Join Interview</button>
                            </>
                        )}
                    </div>

                    {inCall && (
                        <div className="video-controls">
                            <button className={`video-ctrl-btn mic ${!micOn ? 'btn-danger' : ''}`} style={!micOn ? { background: 'var(--accent-red)', color: 'white' } : {}} onClick={() => setMicOn(!micOn)}>
                                <FiMic />
                            </button>
                            <button className={`video-ctrl-btn cam ${!camOn ? 'btn-danger' : ''}`} style={!camOn ? { background: 'var(--accent-red)', color: 'white' } : {}} onClick={() => setCamOn(!camOn)}>
                                <FiCamera />
                            </button>
                            <button className="video-ctrl-btn screen"><FiMonitor /></button>
                            <button className="video-ctrl-btn end" onClick={() => setInCall(false)}><FiPhoneOff /></button>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="glass-card video-sidebar-card">
                        <h3>Interview Details</h3>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <p><strong>Role:</strong> Data Science Intern</p>
                            <p><strong>Company:</strong> AnalytiQ Corp</p>
                            <p><strong>Date:</strong> Feb 20, 2026</p>
                            <p><strong>Time:</strong> 10:00 AM IST</p>
                            <p><strong>Duration:</strong> 45 minutes</p>
                        </div>
                    </div>

                    <div className="glass-card video-sidebar-card">
                        <h3>Participants</h3>
                        <div className="participant">
                            <div className="avatar avatar-sm" style={{ background: 'var(--gradient-primary)' }}>Y</div>
                            <div><strong style={{ fontSize: '0.85rem' }}>You</strong></div>
                            <div className="participant-status"></div>
                        </div>
                        <div className="participant">
                            <div className="avatar avatar-sm" style={{ background: 'var(--gradient-secondary)' }}>A</div>
                            <div><strong style={{ fontSize: '0.85rem' }}>Aditya Patel</strong><br /><small style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Interviewer</small></div>
                            <div className="participant-status" style={{ background: inCall ? 'var(--accent-green)' : 'var(--text-muted)' }}></div>
                        </div>
                    </div>

                    <div className="glass-card video-sidebar-card">
                        <h3>💬 Chat</h3>
                        <div style={{ padding: '1rem 0', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                            {inCall ? 'Chat is available during the interview' : 'Join the call to start chatting'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
