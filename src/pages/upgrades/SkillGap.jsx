import { skillGapData } from '../../data/mockData'
import './UpgradePages.css'

export default function SkillGap() {
    const { userSkills, requiredSkills } = skillGapData
    const skills = Object.keys(userSkills)

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>📊 Skill Gap Analysis</h1>
                <p>Compare your skills against job requirements</p>
            </div>

            <div className="skillgap-layout">
                <div className="glass-card">
                    <h3>Your Skills vs Required</h3>
                    <div className="radar-placeholder">
                        <div className="radar-bars">
                            {skills.map(skill => (
                                <div className="radar-bar-item" key={skill}>
                                    <div className="radar-bar-label">
                                        <span>{skill}</span>
                                        <span>{userSkills[skill]}% / {requiredSkills[skill]}%</span>
                                    </div>
                                    <div className="radar-bar-track">
                                        <div className="radar-bar-yours" style={{ width: `${userSkills[skill]}%` }}></div>
                                        <div className="radar-bar-required" style={{ left: `${requiredSkills[skill]}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="chart-legend" style={{ marginTop: '1.25rem' }}>
                            <span><span className="legend-dot" style={{ background: 'var(--accent-blue)' }}></span> Your Level</span>
                            <span><span className="legend-dot" style={{ background: 'var(--accent-yellow)' }}></span> Required</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-card">
                        <h3>Gap Summary</h3>
                        <div className="gap-summary" style={{ marginTop: '0.75rem' }}>
                            {skills.map(skill => {
                                const diff = userSkills[skill] - requiredSkills[skill]
                                return (
                                    <div className="gap-item" key={skill}>
                                        <span className="gap-skill">{skill}</span>
                                        <span className={`gap-diff ${diff >= 0 ? 'positive' : 'negative'}`}>
                                            {diff >= 0 ? `+${diff}%` : `${diff}%`}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3>🎓 Recommended Courses</h3>
                        <div className="suggestions-list" style={{ marginTop: '0.5rem' }}>
                            {[
                                { title: 'Advanced Node.js', provider: 'Udemy', icon: '📗' },
                                { title: 'SQL Masterclass', provider: 'Coursera', icon: '📘' },
                                { title: 'Python for Data Science', provider: 'edX', icon: '📙' },
                            ].map((c, i) => (
                                <div className="suggestion-item" key={i}>
                                    <span className="suggestion-icon">{c.icon}</span>
                                    <div>
                                        <strong>{c.title}</strong>
                                        <p>{c.provider}</p>
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
