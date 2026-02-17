import { mockJobs, userSkills, skillGapData } from '../../data/mockData'
import './UpgradePages.css'

export default function ResumeMatch() {
    const job = mockJobs[0]
    const matchScore = job.matchScore

    const circumference = 2 * Math.PI * 54
    const dashOffset = circumference - (circumference * matchScore) / 100

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>🎯 Smart Resume Match</h1>
                <p>See how well your resume matches with job requirements</p>
            </div>

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
                            <text x="60" y="56" textAnchor="middle" fill="white" fontSize="28" fontWeight="800">{matchScore}%</text>
                            <text x="60" y="74" textAnchor="middle" fill="#94a3b8" fontSize="10">Match Score</text>
                        </svg>
                    </div>
                    <p className="match-description">Your resume is a <strong>strong match</strong> for {job.title} at {job.company}</p>
                </div>

                <div className="glass-card">
                    <h3>Skill Breakdown</h3>
                    <div className="skill-bars">
                        {Object.entries(skillGapData.userSkills).map(([skill, value]) => (
                            <div className="skill-bar-item" key={skill}>
                                <div className="skill-bar-header">
                                    <span>{skill}</span>
                                    <span>{value}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${value}%`, background: value >= 80 ? 'var(--gradient-success)' : value >= 60 ? 'var(--gradient-primary)' : 'var(--gradient-warm)' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="glass-card" style={{ marginTop: '1.5rem' }}>
                <h3>💡 Improvement Suggestions</h3>
                <div className="suggestions-list">
                    <div className="suggestion-item">
                        <span className="suggestion-icon">📚</span>
                        <div>
                            <strong>Add Node.js projects to your portfolio</strong>
                            <p>Including backend projects would increase your match by ~10%</p>
                        </div>
                    </div>
                    <div className="suggestion-item">
                        <span className="suggestion-icon">🏆</span>
                        <div>
                            <strong>Highlight your SQL experience</strong>
                            <p>Mention specific database projects and query optimization</p>
                        </div>
                    </div>
                    <div className="suggestion-item">
                        <span className="suggestion-icon">🎯</span>
                        <div>
                            <strong>Customize your resume keywords</strong>
                            <p>Match the job description keywords more closely</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
