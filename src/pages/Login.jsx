import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi'
import api from '../api/api'
import './Auth.css'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const data = await api.post('/auth/login', { email, password })
            login(
                { id: data.user_id, email, role: data.role, name: email.split('@')[0] },
                data.access_token
            )
            navigate(data.role === 'admin' ? '/admin/dashboard' : data.role === 'recruiter' ? '/recruiter/dashboard' : '/dashboard')
        } catch (err) {
            setError(err.message || 'Invalid email or password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-bg-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-logo">Intern<span>Link</span></h1>
                    <p>Welcome back! Sign in to continue</p>
                </div>

                {error && <div className="auth-error" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label>Email Address</label>
                        <div className="input-with-icon">
                            <FiMail className="field-icon" />
                            <input
                                type="email"
                                className="input-field"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <div className="input-with-icon">
                            <FiLock className="field-icon" />
                            <input
                                type="password"
                                className="input-field"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="auth-options">
                        <label className="remember-me">
                            <input type="checkbox" />
                            <span>Remember me</span>
                        </label>
                        <a href="#" className="forgot-link">Forgot password?</a>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                        <FiArrowRight />
                    </button>
                </form>

                <div className="auth-divider">
                    <span>or continue with</span>
                </div>

                <div className="social-login">
                    <button className="social-btn">🔵 Google</button>
                    <button className="social-btn">⚫ GitHub</button>
                    <button className="social-btn">🔷 LinkedIn</button>
                </div>

                <p className="auth-footer">
                    Don't have an account? <Link to="/register">Create Account</Link>
                </p>
            </div>
        </div>
    )
}
