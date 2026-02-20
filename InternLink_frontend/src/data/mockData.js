// =========================================
// InternLink — Mock Data for Demo
// =========================================

export const mockJobs = [
    {
        id: 1,
        title: 'Frontend Developer Intern',
        company: 'TechNova Solutions',
        location: 'Bengaluru, India',
        type: 'Internship',
        stipend: '₹15,000/month',
        stipendValue: 15000,
        skills: ['React', 'JavaScript', 'CSS', 'Git'],
        description: 'Join our dynamic team to build responsive web applications using React. You will work on real projects, collaborate with senior developers, and gain hands-on experience in modern web development.',
        requirements: ['Currently pursuing B.Tech/MCA', 'Knowledge of React & JavaScript', 'Good communication skills'],
        posted: '2 days ago',
        deadline: '2026-03-15',
        applicants: 45,
        logo: '🚀',
        matchScore: 92,
    },
    {
        id: 2,
        title: 'Backend Developer',
        company: 'CloudSync Labs',
        location: 'Hyderabad, India',
        type: 'Full-time',
        stipend: '₹8,00,000/year',
        stipendValue: 66666,
        skills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
        description: 'Design and develop scalable RESTful APIs. Work with microservices architecture and cloud-native technologies.',
        requirements: ['2+ years experience', 'Strong Python skills', 'Database design knowledge'],
        posted: '1 week ago',
        deadline: '2026-03-30',
        applicants: 128,
        logo: '☁️',
        matchScore: 78,
    },
    {
        id: 3,
        title: 'Data Science Intern',
        company: 'AnalytiQ Corp',
        location: 'Mumbai, India',
        type: 'Internship',
        stipend: '₹20,000/month',
        stipendValue: 20000,
        skills: ['Python', 'Pandas', 'Machine Learning', 'SQL'],
        description: 'Analyze large datasets, build ML models, and create insightful dashboards. Perfect for aspiring data scientists.',
        requirements: ['Knowledge of Python & ML', 'Statistics fundamentals', 'Currently pursuing a degree'],
        posted: '3 days ago',
        deadline: '2026-04-01',
        applicants: 89,
        logo: '📊',
        matchScore: 85,
    },
    {
        id: 4,
        title: 'UI/UX Design Intern',
        company: 'PixelCraft Studio',
        location: 'Remote',
        type: 'Internship',
        stipend: '₹12,000/month',
        stipendValue: 12000,
        skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
        description: 'Create stunning user interfaces and conduct user research. Transform complex requirements into elegant designs.',
        requirements: ['Portfolio of design work', 'Figma proficiency', 'UX research experience'],
        posted: '5 days ago',
        deadline: '2026-03-20',
        applicants: 56,
        logo: '🎨',
        matchScore: 70,
    },
    {
        id: 5,
        title: 'DevOps Engineer',
        company: 'InfraEdge Technologies',
        location: 'Pune, India',
        type: 'Full-time',
        stipend: '₹12,00,000/year',
        stipendValue: 100000,
        skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD'],
        description: 'Build and maintain cloud infrastructure. Implement CI/CD pipelines and ensure 99.9% uptime.',
        requirements: ['3+ years DevOps experience', 'AWS certified preferred', 'Strong Linux skills'],
        posted: '1 day ago',
        deadline: '2026-04-15',
        applicants: 34,
        logo: '⚙️',
        matchScore: 65,
    },
    {
        id: 6,
        title: 'Mobile App Developer Intern',
        company: 'AppVerse Inc',
        location: 'Chennai, India',
        type: 'Internship',
        stipend: '₹18,000/month',
        stipendValue: 18000,
        skills: ['React Native', 'JavaScript', 'Firebase', 'REST APIs'],
        description: 'Develop cross-platform mobile applications using React Native. Deploy apps on both iOS and Android.',
        requirements: ['React Native knowledge', 'Published app is a plus', 'API integration experience'],
        posted: '4 days ago',
        deadline: '2026-03-25',
        applicants: 72,
        logo: '📱',
        matchScore: 88,
    },
]

export const mockApplications = [
    {
        id: 1,
        jobId: 1,
        jobTitle: 'Frontend Developer Intern',
        company: 'TechNova Solutions',
        appliedDate: '2026-02-10',
        status: 'shortlisted',
        timeline: [
            { status: 'applied', date: '2026-02-10', note: 'Application submitted' },
            { status: 'shortlisted', date: '2026-02-14', note: 'Profile shortlisted by recruiter' },
        ],
    },
    {
        id: 2,
        jobId: 3,
        jobTitle: 'Data Science Intern',
        company: 'AnalytiQ Corp',
        appliedDate: '2026-02-12',
        status: 'interview',
        timeline: [
            { status: 'applied', date: '2026-02-12', note: 'Application submitted' },
            { status: 'shortlisted', date: '2026-02-13', note: 'Profile shortlisted' },
            { status: 'interview', date: '2026-02-16', note: 'Interview scheduled for Feb 20' },
        ],
    },
    {
        id: 3,
        jobId: 4,
        jobTitle: 'UI/UX Design Intern',
        company: 'PixelCraft Studio',
        appliedDate: '2026-02-08',
        status: 'rejected',
        timeline: [
            { status: 'applied', date: '2026-02-08', note: 'Application submitted' },
            { status: 'rejected', date: '2026-02-11', note: 'Unfortunately not selected this time' },
        ],
    },
    {
        id: 4,
        jobId: 6,
        jobTitle: 'Mobile App Developer Intern',
        company: 'AppVerse Inc',
        appliedDate: '2026-02-15',
        status: 'applied',
        timeline: [
            { status: 'applied', date: '2026-02-15', note: 'Application submitted' },
        ],
    },
    {
        id: 5,
        jobId: 2,
        jobTitle: 'Backend Developer',
        company: 'CloudSync Labs',
        appliedDate: '2026-01-28',
        status: 'selected',
        timeline: [
            { status: 'applied', date: '2026-01-28', note: 'Application submitted' },
            { status: 'shortlisted', date: '2026-01-30', note: 'Profile shortlisted' },
            { status: 'interview', date: '2026-02-05', note: 'Technical interview completed' },
            { status: 'selected', date: '2026-02-10', note: '🎉 Congratulations! You are selected!' },
        ],
    },
]

export const mockPosts = [
    {
        id: 1,
        author: 'Priya Sharma',
        avatar: 'PS',
        role: 'Software Engineer at Google',
        time: '2 hours ago',
        content: "Just completed my 6-month internship at TechNova and got a full-time offer! 🎉 The journey from an intern to a full-time Software Engineer has been amazing. Key takeaway: Never stop learning and always ask questions!",
        likes: 142,
        comments: [
            { id: 1, author: 'Rahul K', text: 'Congratulations Priya! 🎊', time: '1h ago' },
            { id: 2, author: 'Sneha M', text: 'So inspiring! How did you prepare?', time: '45m ago' },
        ],
        shares: 23,
        liked: false,
    },
    {
        id: 2,
        author: 'Aditya Patel',
        avatar: 'AP',
        role: 'Data Scientist at Microsoft',
        time: '5 hours ago',
        content: "📢 Hiring Alert! We're looking for Data Science interns at Microsoft Hyderabad. If you're passionate about ML and AI, drop me a DM. Stipend: ₹50,000/month + mentorship from senior data scientists. #Hiring #DataScience #Internship",
        likes: 289,
        comments: [
            { id: 1, author: 'Vikram S', text: "I'd love to apply! Sending DM now.", time: '3h ago' },
        ],
        shares: 67,
        liked: true,
    },
    {
        id: 3,
        author: 'Neha Gupta',
        avatar: 'NG',
        role: 'Product Designer at Figma',
        time: '1 day ago',
        content: "5 tips for acing your design internship interview:\n1. Show your process, not just final designs\n2. Practice whiteboard challenges\n3. Research the company's design system\n4. Prepare a case study presentation\n5. Ask thoughtful questions about the team culture\n\n#DesignTips #CareerAdvice",
        likes: 456,
        comments: [],
        shares: 89,
        liked: false,
    },
]

export const mockUsers = [
    { id: 1, name: 'Manasa H M', email: 'manasa@example.com', role: 'user', status: 'active', joined: '2026-01-15', applications: 5 },
    { id: 2, name: 'Rahul Kumar', email: 'rahul@example.com', role: 'user', status: 'active', joined: '2026-01-20', applications: 3 },
    { id: 3, name: 'Sneha Mehta', email: 'sneha@example.com', role: 'user', status: 'active', joined: '2026-02-01', applications: 7 },
    { id: 4, name: 'Vikram Singh', email: 'vikram@example.com', role: 'user', status: 'banned', joined: '2025-12-10', applications: 0 },
    { id: 5, name: 'Ananya Rao', email: 'ananya@example.com', role: 'user', status: 'active', joined: '2026-02-05', applications: 2 },
]

export const mockRecruiters = [
    { id: 1, name: 'TechNova Solutions', email: 'hr@technova.com', status: 'verified', jobs: 8, applicants: 234 },
    { id: 2, name: 'CloudSync Labs', email: 'recruit@cloudsync.com', status: 'verified', jobs: 5, applicants: 156 },
    { id: 3, name: 'PixelCraft Studio', email: 'jobs@pixelcraft.com', status: 'pending', jobs: 3, applicants: 78 },
    { id: 4, name: 'AnalytiQ Corp', email: 'hr@analytiq.com', status: 'verified', jobs: 6, applicants: 192 },
    { id: 5, name: 'InfraEdge Tech', email: 'careers@infraedge.com', status: 'blocked', jobs: 0, applicants: 0 },
]

export const mockDisputes = [
    { id: 1, title: 'Misleading job description', reporter: 'Rahul Kumar', against: 'TechNova Solutions', status: 'open', date: '2026-02-15' },
    { id: 2, title: 'Non-payment of stipend', reporter: 'Sneha Mehta', against: 'PixelCraft Studio', status: 'investigating', date: '2026-02-10' },
    { id: 3, title: 'Harassment during interview', reporter: 'Ananya Rao', against: 'InfraEdge Tech', status: 'resolved', date: '2026-01-25' },
]

export const mockNotifications = [
    { id: 1, type: 'application', message: 'Your application for Frontend Developer Intern was shortlisted!', time: '2 min ago', read: false },
    { id: 2, type: 'interview', message: 'Interview scheduled for Data Science Intern — Feb 20, 10:00 AM', time: '1 hour ago', read: false },
    { id: 3, type: 'recommendation', message: '3 new jobs match your profile. Check them out!', time: '3 hours ago', read: true },
    { id: 4, type: 'social', message: 'Priya Sharma started following you', time: '5 hours ago', read: true },
    { id: 5, type: 'system', message: 'Your resume has been parsed. Review your skills profile.', time: '1 day ago', read: true },
]

export const userSkills = ['React', 'JavaScript', 'Python', 'CSS', 'Git', 'Node.js', 'SQL']

export const skillGapData = {
    userSkills: { React: 85, JavaScript: 90, Python: 70, CSS: 80, Git: 75, 'Node.js': 60, SQL: 65 },
    requiredSkills: { React: 90, JavaScript: 85, Python: 80, CSS: 75, Git: 80, 'Node.js': 85, SQL: 70 },
}
