import { useState } from 'react'
import { FiSearch, FiDownload, FiFilter } from 'react-icons/fi'
import './RecruiterPages.css'

const applicantsData = [
    { id: 1, name: 'Manasa H M', email: 'manasa@example.com', job: 'Frontend Developer Intern', skills: ['React', 'JavaScript', 'CSS'], status: 'shortlisted', matchScore: 92, applied: '2026-02-10' },
    { id: 2, name: 'Rahul Kumar', email: 'rahul@example.com', job: 'Frontend Developer Intern', skills: ['Vue', 'JavaScript', 'Node.js'], status: 'applied', matchScore: 78, applied: '2026-02-12' },
    { id: 3, name: 'Sneha Mehta', email: 'sneha@example.com', job: 'Data Science Intern', skills: ['Python', 'ML', 'Pandas'], status: 'interview', matchScore: 85, applied: '2026-02-08' },
    { id: 4, name: 'Vikram Singh', email: 'vikram@example.com', job: 'Backend Developer', skills: ['Python', 'FastAPI', 'Docker'], status: 'applied', matchScore: 70, applied: '2026-02-14' },
    { id: 5, name: 'Ananya Rao', email: 'ananya@example.com', job: 'UI/UX Design Intern', skills: ['Figma', 'Adobe XD', 'Prototyping'], status: 'selected', matchScore: 88, applied: '2026-02-07' },
]

export default function Applicants() {
    const [search, setSearch] = useState('')
    const [skillFilter, setSkillFilter] = useState('')
    const [applicants, setApplicants] = useState(applicantsData)

    const filtered = applicants.filter(a => {
        const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.job.toLowerCase().includes(search.toLowerCase())
        const matchSkill = !skillFilter || a.skills.some(s => s.toLowerCase().includes(skillFilter.toLowerCase()))
        return matchSearch && matchSkill
    })

    const updateStatus = (id, status) => {
        setApplicants(applicants.map(a => a.id === id ? { ...a, status } : a))
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>👥 Applicants</h1>
                <p>Review and manage all applicants</p>
            </div>

            <div className="applicants-controls">
                <div className="search-bar" style={{ maxWidth: '300px' }}>
                    <FiSearch className="search-icon" />
                    <input placeholder="Search by name or job..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <input className="input-field" placeholder="🛠️ Filter by skill..." value={skillFilter} onChange={e => setSkillFilter(e.target.value)} style={{ maxWidth: '200px' }} />
            </div>

            <div className="glass-card">
                {filtered.map(app => (
                    <div className="applicant-row" key={app.id}>
                        <div className="avatar" style={{ background: 'var(--gradient-primary)' }}>{app.name.charAt(0)}</div>
                        <div className="applicant-details">
                            <strong>{app.name}</strong>
                            <small>{app.job} · Applied {app.applied}</small>
                            <div className="applicant-skills">
                                {app.skills.map(s => <span className="tag" key={s} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>{s}</span>)}
                            </div>
                        </div>
                        <div className="match-badge">{app.matchScore}%</div>
                        <div className="applicant-actions">
                            <select className="status-select" value={app.status} onChange={e => updateStatus(app.id, e.target.value)}>
                                <option value="applied">Applied</option>
                                <option value="shortlisted">Shortlisted</option>
                                <option value="interview">Interview</option>
                                <option value="selected">Selected</option>
                                <option value="rejected">Rejected</option>
                            </select>
                            <button className="btn btn-sm btn-secondary" title="Download Resume"><FiDownload /></button>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No applicants found.</p>}
            </div>
        </div>
    )
}
