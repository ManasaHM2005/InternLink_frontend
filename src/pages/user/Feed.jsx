import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { FiHeart, FiMessageCircle, FiShare2, FiSend } from 'react-icons/fi'
import api from '../../api/api'
import './UserPages.css'

export default function Feed() {
    const { user } = useAuth()
    const [posts, setPosts] = useState([])
    const [newPost, setNewPost] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadFeed()
    }, [])

    const loadFeed = async () => {
        try {
            const data = await api.get('/social/feed')
            setPosts(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('Failed to load feed:', err)
            // Use empty feed on error
            setPosts([])
        } finally {
            setLoading(false)
        }
    }

    const handleCreatePost = async () => {
        if (!newPost.trim()) return
        try {
            const data = await api.post('/social/posts', { content: newPost })
            setPosts([data, ...posts])
            setNewPost('')
        } catch (err) {
            // Add locally if API not available
            const local = {
                id: Date.now(),
                content: newPost,
                author_name: user?.name || 'You',
                created_at: new Date().toISOString(),
                likes_count: 0,
                comments_count: 0,
                liked_by_user: false,
            }
            setPosts([local, ...posts])
            setNewPost('')
        }
    }

    const handleLike = async (postId) => {
        try {
            await api.post(`/social/posts/${postId}/like`, {})
        } catch (_) { /* ignore */ }
        setPosts(posts.map(p => p.id === postId ? { ...p, likes_count: (p.likes_count || 0) + 1, liked_by_user: true } : p))
    }

    if (loading) {
        return <div className="page-container"><div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>Loading feed...</div></div>
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>📰 Community Feed</h1>
                <p>Share insights and connect with the community</p>
            </div>

            {/* Create Post */}
            <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div className="profile-avatar" style={{ width: '38px', height: '38px', fontSize: '0.9rem', flexShrink: 0 }}>
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div style={{ flex: 1 }}>
                        <textarea
                            className="input-field"
                            placeholder="Share something with the community..."
                            rows={3}
                            value={newPost}
                            onChange={e => setNewPost(e.target.value)}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                            <button className="btn btn-primary btn-sm" onClick={handleCreatePost} disabled={!newPost.trim()}>
                                <FiSend /> Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Posts */}
            <div className="feed-posts">
                {posts.map(post => (
                    <div className="glass-card feed-post" key={post.id}>
                        <div className="post-header">
                            <div className="profile-avatar" style={{ width: '36px', height: '36px', fontSize: '0.85rem' }}>
                                {(post.author_name || 'U').charAt(0)}
                            </div>
                            <div>
                                <strong style={{ fontSize: '0.9rem' }}>{post.author_name || 'User'}</strong>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{post.created_at ? new Date(post.created_at).toLocaleDateString() : ''}</p>
                            </div>
                        </div>
                        <p className="post-content">{post.content}</p>
                        <div className="post-actions">
                            <button className={`post-action ${post.liked_by_user ? 'liked' : ''}`} onClick={() => handleLike(post.id)}>
                                <FiHeart /> {post.likes_count || 0}
                            </button>
                            <button className="post-action"><FiMessageCircle /> {post.comments_count || 0}</button>
                            <button className="post-action"><FiShare2 /> Share</button>
                        </div>
                    </div>
                ))}
                {posts.length === 0 && (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📰</p>
                        <p>No posts yet. Be the first to share something!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
