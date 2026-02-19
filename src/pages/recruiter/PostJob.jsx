import { useState } from 'react'
import { FiPlus, FiX, FiCheckCircle } from 'react-icons/fi'
import api from '../../api/api'
import '../upgrades/UpgradePages.css'

export default function PostJob() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        location: '',
        job_type: 'Internship',
        stipend_min: '',
        stipend_max: '',
        duration: '',
        openings: 1,
        application_deadline: '',
    })
    const [skills, setSkills] = useState([])
    const [skillInput, setSkillInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value })
    }

    const addSkill = () => {
        if (skillInput.trim() && !skills.includes(skillInput.trim())) {
            setSkills([...skills, skillInput.trim()])
            setSkillInput('')
        }
    }

    const removeSkill = (s) => setSkills(skills.filter(sk => sk !== s))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const payload = {
                ...formData,
                skills_required: skills,
                stipend_min: formData.stipend_min ? Number(formData.stipend_min) : null,
                stipend_max: formData.stipend_max ? Number(formData.stipend_max) : null,
                openings: Number(formData.openings) || 1,
            }
            await api.post('/recruiter/jobs', payload)
            setSuccess(true)
        } catch (err) {
            setError(err.message || 'Failed to post job')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="page-container">
                <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <FiCheckCircle style={{ fontSize: '3rem', color: 'var(--accent-green)', marginBottom: '1rem' }} />
                    <h2>Job Posted Successfully! 🎉</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Your job listing is now live.</p>
                    <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => { setSuccess(false); setFormData({ title: '', description: '', requirements: '', location: '', job_type: 'Internship', stipend_min: '', stipend_max: '', duration: '', openings: 1, application_deadline: '' }); setSkills([]) }}>
                        Post Another Job
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>📝 Post a Job</h1>
                <p>Create a new job listing to find talented candidates</p>
            </div>

            {error && <div style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}

            <form className="glass-card" onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                        <label>Job Title *</label>
                        <input className="input-field" placeholder="e.g. Frontend Developer Intern" value={formData.title} onChange={e => handleChange('title', e.target.value)} required />
                    </div>

                    <div className="input-group">
                        <label>Location</label>
                        <input className="input-field" placeholder="e.g. Bengaluru or Remote" value={formData.location} onChange={e => handleChange('location', e.target.value)} />
                    </div>

                    <div className="input-group">
                        <label>Job Type</label>
                        <select className="input-field" value={formData.job_type} onChange={e => handleChange('job_type', e.target.value)}>
                            <option>Internship</option>
                            <option>Full-time</option>
                            <option>Part-time</option>
                            <option>Contract</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Min Stipend (₹)</label>
                        <input className="input-field" type="number" placeholder="5000" value={formData.stipend_min} onChange={e => handleChange('stipend_min', e.target.value)} />
                    </div>

                    <div className="input-group">
                        <label>Max Stipend (₹)</label>
                        <input className="input-field" type="number" placeholder="15000" value={formData.stipend_max} onChange={e => handleChange('stipend_max', e.target.value)} />
                    </div>

                    <div className="input-group">
                        <label>Duration</label>
                        <input className="input-field" placeholder="e.g. 3 months" value={formData.duration} onChange={e => handleChange('duration', e.target.value)} />
                    </div>

                    <div className="input-group">
                        <label>Openings</label>
                        <input className="input-field" type="number" min="1" value={formData.openings} onChange={e => handleChange('openings', e.target.value)} />
                    </div>

                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                        <label>Description *</label>
                        <textarea className="input-field" rows={4} placeholder="Describe the role, responsibilities..." value={formData.description} onChange={e => handleChange('description', e.target.value)} required />
                    </div>

                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                        <label>Requirements</label>
                        <textarea className="input-field" rows={3} placeholder="List the requirements..." value={formData.requirements} onChange={e => handleChange('requirements', e.target.value)} />
                    </div>

                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                        <label>Required Skills</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input className="input-field" placeholder="Add a skill" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
                            <button type="button" className="btn btn-secondary" onClick={addSkill}><FiPlus /></button>
                        </div>
                        <div className="tags-container" style={{ marginTop: '0.5rem' }}>
                            {skills.map(s => (
                                <span className="tag" key={s} style={{ cursor: 'pointer' }} onClick={() => removeSkill(s)}>
                                    {s} <FiX style={{ fontSize: '0.7rem' }} />
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Application Deadline</label>
                        <input className="input-field" type="date" value={formData.application_deadline} onChange={e => handleChange('application_deadline', e.target.value)} />
                    </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '1.5rem' }} disabled={loading}>
                    {loading ? 'Posting...' : '🚀 Post Job'}
                </button>
            </form>
        </div>
    )
}
