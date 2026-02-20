import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, API_BASE_URL } from '../../context/AuthContext'
import { FiSave, FiX } from 'react-icons/fi'
import './RecruiterPages.css'

export default function PostJob() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({
        title: '',
        location: '',
        job_type: 'internship',
        stipend_min: '',
        stipend_max: '',
        description: '',
        requirements: '',
        deadline: '',
        is_remote: false,
        openings: 1,
        duration: ''
    })
    const [skills, setSkills] = useState([])
    const [skillInput, setSkillInput] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        checkProfile()
    }, [])

    const checkProfile = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/recruiter/profile`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('internlink_token')}` }
            })
            if (!res.ok) {
                if (res.status === 404) {
                    setError('Please complete your Company Profile before posting a job.')
                    setTimeout(() => navigate('/recruiter/profile'), 3000)
                }
            }
        } catch (err) {
            console.error(err)
        }
    }

    const update = (key, val) => setForm({ ...form, [key]: val })

    const addSkill = (e) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault()
            if (!skills.includes(skillInput.trim())) setSkills([...skills, skillInput.trim()])
            setSkillInput('')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            const response = await fetch(`${API_BASE_URL}/recruiter/jobs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('internlink_token')}`
                },
                body: JSON.stringify({
                    ...form,
                    openings: parseInt(form.openings) || 1,
                    requirements: form.requirements.split('\n').filter(r => r.trim()),
                    skills_required: skills,
                    stipend_min: parseFloat(form.stipend_min) || 0,
                    stipend_max: parseFloat(form.stipend_max) || 0,
                    deadline: form.deadline ? new Date(form.deadline).toISOString() : null
                })
            })
            if (!response.ok) {
                const err = await response.json()
                // Handle cases where detail might be an array (Pydantic validation errors)
                const detail = Array.isArray(err.detail)
                    ? err.detail.map(d => `${d.loc.join('.')}: ${d.msg}`).join(', ')
                    : err.detail || 'Posting failed'
                throw new Error(detail)
            }
            setSubmitted(true)
            setTimeout(() => navigate('/recruiter/dashboard'), 1500)
        } catch (err) {
            setError(err.message)
        }
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

            {error && <div className="auth-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

            <form className="glass-card post-job-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="input-group">
                        <label>Job Title *</label>
                        <input className="input-field" placeholder="e.g. Frontend Developer Intern" value={form.title} onChange={e => update('title', e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label>Location *</label>
                        <input className="input-field" placeholder="e.g. Bengaluru, India" value={form.location} onChange={e => update('location', e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label>Type</label>
                        <select className="input-field" value={form.job_type} onChange={e => update('job_type', e.target.value)}>
                            <option value="internship">Internship</option>
                            <option value="full-time">Full-time</option>
                            <option value="part-time">Part-time</option>
                            <option value="contract">Contract</option>
                        </select>
                    </div>
                    <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem' }}>
                        <input type="checkbox" checked={form.is_remote} onChange={e => update('is_remote', e.target.checked)} />
                        <label style={{ margin: 0 }}>This is a remote position</label>
                    </div>
                    <div className="input-group">
                        <label>Min Stipend/Salary (Numbers only) *</label>
                        <input className="input-field" type="number" placeholder="e.g. 15000" value={form.stipend_min} onChange={e => update('stipend_min', e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label>Max Stipend/Salary *</label>
                        <input className="input-field" type="number" placeholder="e.g. 25000" value={form.stipend_max} onChange={e => update('stipend_max', e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label>Application Deadline</label>
                        <input className="input-field" type="date" value={form.deadline} onChange={e => update('deadline', e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>Openings</label>
                        <input className="input-field" type="number" value={form.openings} onChange={e => update('openings', e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>Duration (e.g. 6 months)</label>
                        <input className="input-field" placeholder="e.g. 3 months" value={form.duration} onChange={e => update('duration', e.target.value)} />
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
