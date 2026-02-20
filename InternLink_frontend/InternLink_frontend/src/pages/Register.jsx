import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiMail, FiLock, FiUser, FiArrowRight } from 'react-icons/fi'
import './Auth.css'

export default function Register() {
    const [step, setStep] = useState(1)
    const [role, setRole] = useState('user')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const { register } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const userData = await register(email, password, role)
            navigate(userData.role === 'admin' ? '/admin/dashboard' : userData.role === 'recruiter' ? '/recruiter/dashboard' : '/dashboard')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const roles = [
        { value: 'user', emoji: '👤', title: 'Student / Job Seeker', desc: 'Search and apply for internships' },
        { value: 'recruiter', emoji: '🏢', title: 'Recruiter', desc: 'Post jobs and find talent' },
        { value: 'admin', emoji: '🛡️', title: 'Admin', desc: 'Manage the platform' },
    ]

    return (
        <div className="auth-page">
            <div className="auth-bg-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <div className="auth-card register-card">
                <div className="auth-header">
                    <h1 className="auth-logo">Intern<span>Link</span></h1>
                    <p>{step === 1 ? 'Choose your role to get started' : 'Create your account'}</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                {step === 1 ? (
                    <div className="role-selection">
                        {roles.map((r) => (
                            <button
                                key={r.value}
                                className={`role-card ${role === r.value ? 'selected' : ''}`}
                                onClick={() => setRole(r.value)}
                            >
                                <span className="role-emoji">{r.emoji}</span>
                                <strong>{r.title}</strong>
                                <small>{r.desc}</small>
                            </button>
                        ))}
                        <button className="btn btn-primary btn-lg auth-submit" onClick={() => setStep(2)}>
                            Continue <FiArrowRight />
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="input-group">
                            <label>Email Address</label>
                            <div className="input-with-icon">
                                <FiMail className="field-icon" />
                                <input type="email" className="input-field" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <div className="input-with-icon">
                                <FiLock className="field-icon" />
                                <input type="password" className="input-field" placeholder="Min 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                        </div>

                        <div className="auth-actions">
                            <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
                            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                {loading ? 'Creating...' : 'Create Account'}
                                <FiArrowRight />
                            </button>
                        </div>
                    </form>
                )}

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Sign In</Link>
                </p>
            </div>
        </div>
    )
}
