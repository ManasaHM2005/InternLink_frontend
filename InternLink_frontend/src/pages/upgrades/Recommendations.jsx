import { mockJobs } from '../../data/mockData'
import { FiMapPin, FiDollarSign, FiBriefcase } from 'react-icons/fi'
import './UpgradePages.css'

export default function Recommendations() {
    const recommended = [...mockJobs].sort((a, b) => b.matchScore - a.matchScore)
    const reasons = ['Skills match your profile', 'Similar to your past applications', 'Trending in your field', 'Location preference match', 'Stipend matches your expectation', 'High success rate for similar profiles']

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>⚡ Personalized Recommendations</h1>
                <p>Jobs and internships curated just for you based on your profile</p>
            </div>

            <div className="reco-grid">
                {recommended.map((job, i) => (
                    <div className="reco-card" key={job.id}>
                        <div className="reco-match">{job.matchScore}%</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            <div className="job-logo">{job.logo}</div>
                            <div>
                                <div className="job-title">{job.title}</div>
                                <div className="job-company">{job.company}</div>
                            </div>
                        </div>
                        <div className="job-meta">
                            <span><FiMapPin /> {job.location}</span>
                            <span><FiDollarSign /> {job.stipend}</span>
                            <span><FiBriefcase /> {job.type}</span>
                        </div>
                        <div className="tags-container" style={{ margin: '0.5rem 0' }}>
                            {job.skills.slice(0, 3).map(s => <span className="tag" key={s}>{s}</span>)}
                        </div>
                        <div className="reco-why">💡 {reasons[i % reasons.length]}</div>
                        <button className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem', width: '100%', justifyContent: 'center' }}>View & Apply</button>
                    </div>
                ))}
            </div>
        </div>
    )
}
