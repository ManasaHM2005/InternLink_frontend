import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiHome, FiSearch, FiBriefcase, FiFileText, FiUsers, FiBarChart2, FiSettings, FiChevronLeft, FiChevronRight, FiMessageSquare, FiZap, FiVideo, FiBell, FiTarget, FiShield, FiAlertTriangle, FiCheckSquare, FiTrendingUp, FiLayers, FiBookOpen } from 'react-icons/fi'
import './Sidebar.css'

const userLinks = [
    { to: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { to: '/jobs', icon: <FiSearch />, label: 'Search Jobs' },
    { to: '/applications', icon: <FiBriefcase />, label: 'Applications' },
    { to: '/feed', icon: <FiMessageSquare />, label: 'Social Feed' },
    { to: '/profile', icon: <FiFileText />, label: 'My Profile' },
    { to: '/resume-match', icon: <FiTarget />, label: 'Resume Match' },
    { to: '/skill-gap', icon: <FiTrendingUp />, label: 'Skill Gap' },
    { to: '/recommendations', icon: <FiZap />, label: 'For You' },
    { to: '/ai-interview', icon: <FiBookOpen />, label: 'AI Interview' },
    { to: '/video-interview', icon: <FiVideo />, label: 'Video Interview' },
    { to: '/notifications', icon: <FiBell />, label: 'Notifications' },
]

const recruiterLinks = [
    { to: '/recruiter/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { to: '/recruiter/post-job', icon: <FiLayers />, label: 'Post Job' },
    { to: '/recruiter/applicants', icon: <FiUsers />, label: 'Applicants' },
    { to: '/recruiter/analytics', icon: <FiBarChart2 />, label: 'Analytics' },
]

const adminLinks = [
    { to: '/admin/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { to: '/admin/users', icon: <FiUsers />, label: 'Manage Users' },
    { to: '/admin/recruiters', icon: <FiBriefcase />, label: 'Manage Recruiters' },
    { to: '/admin/internships', icon: <FiCheckSquare />, label: 'Internships' },
    { to: '/admin/disputes', icon: <FiAlertTriangle />, label: 'Disputes' },
    { to: '/admin/analytics', icon: <FiBarChart2 />, label: 'Analytics' },
]

export default function Sidebar({ collapsed, setCollapsed }) {
    const { user } = useAuth()
    const location = useLocation()

    const role = user?.role || 'user'
    const links = role === 'admin' ? adminLinks : role === 'recruiter' ? recruiterLinks : userLinks

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    {!collapsed && <span className="logo-text">Intern<span className="logo-accent">Link</span></span>}
                    {collapsed && <span className="logo-icon">IL</span>}
                </div>
                <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
                    {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
                </button>
            </div>

            <nav className="sidebar-nav">
                {links.map((link) => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                        title={collapsed ? link.label : ''}
                    >
                        <span className="nav-icon">{link.icon}</span>
                        {!collapsed && <span className="nav-label">{link.label}</span>}
                    </Link>
                ))}
            </nav>

            {!collapsed && (
                <div className="sidebar-footer">
                    <div className="sidebar-role-badge">
                        <FiShield />
                        <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
                    </div>
                </div>
            )}
        </aside>
    )
}
