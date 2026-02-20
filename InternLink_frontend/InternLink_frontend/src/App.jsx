import { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Layout
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'

// Auth
import Login from './pages/Login'
import Register from './pages/Register'

// User Pages
import UserDashboard from './pages/user/Dashboard'
import Profile from './pages/user/Profile'
import JobSearch from './pages/user/JobSearch'
import ApplicationTracker from './pages/user/ApplicationTracker'
import Feed from './pages/user/Feed'

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/Dashboard'
import PostJob from './pages/recruiter/PostJob'
import Applicants from './pages/recruiter/Applicants'
import CompanyProfile from './pages/recruiter/CompanyProfile'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import ManageUsers from './pages/admin/ManageUsers'
import ManageRecruiters from './pages/admin/ManageRecruiters'
import ApproveInternships from './pages/admin/ApproveInternships'
import Disputes from './pages/admin/Disputes'

// Upgrade Features
import ResumeMatch from './pages/upgrades/ResumeMatch'
import AIInterview from './pages/upgrades/AIInterview'
import SkillGap from './pages/upgrades/SkillGap'
import Recommendations from './pages/upgrades/Recommendations'
import VideoInterview from './pages/upgrades/VideoInterview'
import Notifications from './pages/upgrades/Notifications'
import AdvancedSearch from './pages/upgrades/AdvancedSearch'

function ProtectedRoute({ children }) {
    const { user } = useAuth()
    if (!user) return <Navigate to="/login" replace />
    return children
}

function AppLayout() {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <div className="app-layout">
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            <div className={`main-content ${collapsed ? 'collapsed' : ''}`}>
                <Navbar onToggleSidebar={() => setCollapsed(!collapsed)} />
                <Routes>
                    {/* User */}
                    <Route path="/dashboard" element={<UserDashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/jobs" element={<JobSearch />} />
                    <Route path="/applications" element={<ApplicationTracker />} />
                    <Route path="/feed" element={<Feed />} />

                    {/* Recruiter */}
                    <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
                    <Route path="/recruiter/post-job" element={<PostJob />} />
                    <Route path="/recruiter/applicants/:jobId?" element={<Applicants />} />
                    <Route path="/recruiter/jobs/:jobId/applicants" element={<Applicants />} />
                    <Route path="/recruiter/profile" element={<CompanyProfile />} />
                    <Route path="/recruiter/analytics" element={<RecruiterDashboard />} />

                    {/* Admin */}
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<ManageUsers />} />
                    <Route path="/admin/recruiters" element={<ManageRecruiters />} />
                    <Route path="/admin/internships" element={<ApproveInternships />} />
                    <Route path="/admin/disputes" element={<Disputes />} />
                    <Route path="/admin/analytics" element={<AdminDashboard />} />

                    {/* Upgrades */}
                    <Route path="/resume-match/:jobId?" element={<ResumeMatch />} />
                    <Route path="/ai-interview/:jobId?" element={<AIInterview />} />
                    <Route path="/skill-gap/:jobId?" element={<SkillGap />} />
                    <Route path="/recommendations" element={<Recommendations />} />
                    <Route path="/video-interview" element={<VideoInterview />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/advanced-search" element={<AdvancedSearch />} />

                    {/* Default */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </div>
        </div>
    )
}

export default function App() {
    const location = useLocation()
    const isAuthPage = ['/login', '/register'].includes(location.pathname)

    if (isAuthPage) {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        )
    }

    return (
        <ProtectedRoute>
            <AppLayout />
        </ProtectedRoute>
    )
}
