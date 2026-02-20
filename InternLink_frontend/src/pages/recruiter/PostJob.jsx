import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSave, FiX } from 'react-icons/fi'
import './RecruiterPages.css'

export default function PostJob() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ title: '', company: '', location: '', type: 'Internship', stipend: '', description: '', requirements: '', deadline: '' })
    const [skills, setSkills] = useState([])
    const [skillInput, setSkillInput] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const update = (key, val) => setForm({ ...form, [key]: val })

    const addSkill = (e) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault()
            if (!skills.includes(skillInput.trim())) setSkills([...skills, skillInput.trim()])
            setSkillInput('')
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
        setTimeout(() => navigate('/recruiter/dashboard'), 1500)
    }

    if (submitted) {
        return (
            <div className="page-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                <h2>Job Posted Successfully!</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Your listing is now live. Redirecting...</p>
            </div>
        )
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>📝 Post New Job / Internship</h1>
                <p>Fill in the details below to create a new listing</p>
            </div>

            <form className="glass-card post-job-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="input-group">
                        <label>Job Title *</label>
                        <input className="input-field" placeholder="e.g. Frontend Developer Intern" value={form.title} onChange={e => update('title', e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label>Company Name *</label>
                        <input className="input-field" placeholder="e.g. TechNova Solutions" value={form.company} onChange={e => update('company', e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label>Location *</label>
                        <input className="input-field" placeholder="e.g. Bengaluru, India" value={form.location} onChange={e => update('location', e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label>Type</label>
                        <select className="input-field" value={form.type} onChange={e => update('type', e.target.value)}>
                            <option>Internship</option>
                            <option>Full-time</option>
                            <option>Part-time</option>
                            <option>Contract</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label>Stipend / Salary *</label>
                        <input className="input-field" placeholder="e.g. ₹15,000/month" value={form.stipend} onChange={e => update('stipend', e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label>Application Deadline</label>
                        <input className="input-field" type="date" value={form.deadline} onChange={e => update('deadline', e.target.value)} />
                    </div>
                    <div className="input-group form-full">
                        <label>Description *</label>
                        <textarea className="input-field" rows={4} placeholder="Describe the role, responsibilities..." value={form.description} onChange={e => update('description', e.target.value)} required />
                    </div>
                    <div className="input-group form-full">
                        <label>Requirements</label>
                        <textarea className="input-field" rows={3} placeholder="One requirement per line" value={form.requirements} onChange={e => update('requirements', e.target.value)} />
                    </div>
                    <div className="input-group form-full">
                        <label>Required Skills</label>
                        <div className="skills-input-area">
                            {skills.map(s => (
                                <span className="skill-tag" key={s}>
                                    {s} <button type="button" onClick={() => setSkills(skills.filter(x => x !== s))}>×</button>
                                </span>
                            ))}
                            <input placeholder="Type a skill & press Enter" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={addSkill} />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                    <button type="submit" className="btn btn-primary btn-lg"><FiSave /> Publish Listing</button>
                    <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate(-1)}><FiX /> Cancel</button>
                </div>
            </form>
        </div>
    )
}
