import { useState, useEffect } from 'react'
import { useAuth, API_BASE_URL } from '../../context/AuthContext'
import { FiHeart, FiMessageSquare, FiShare2, FiSend, FiUserPlus, FiUserCheck } from 'react-icons/fi'
import './UserPages.css'

export default function Feed() {
    const { user } = useAuth()
    const [posts, setPosts] = useState([])
    const [newPost, setNewPost] = useState('')
    const [commentInputs, setCommentInputs] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        setLoading(true)
        try {
            // Using explore for now to see all posts, or /social/posts for following feed
            const response = await fetch(`${API_BASE_URL}/social/posts/explore`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('internlink_token')}`
                }
            })
            if (!response.ok) throw new Error('Failed to fetch feed')
            const data = await response.json()
            setPosts(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const toggleLike = async (postId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/social/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('internlink_token')}`
                }
            })
            if (!response.ok) throw new Error('Action failed')
            const result = await response.json()
            setPosts(posts.map(p => p.id === postId ? { ...p, is_liked: result.liked, likes_count: result.liked ? p.likes_count + 1 : p.likes_count - 1 } : p))
        } catch (err) {
            alert(err.message)
        }
    }

    const toggleFollow = async (authorId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/social/users/${authorId}/follow`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('internlink_token')}`
                }
            })
            if (!response.ok) {
                const err = await response.json()
                throw new Error(err.detail || 'Action failed')
            }
            fetchPosts() // Refresh feed to update UI
        } catch (err) {
            alert(err.message)
        }
    }

    const addComment = async (postId) => {
        const text = commentInputs[postId]
        if (!text?.trim()) return
        try {
            const response = await fetch(`${API_BASE_URL}/social/posts/${postId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('internlink_token')}`
                },
                body: JSON.stringify({ content: text })
            })
            if (!response.ok) throw new Error('Comment failed')
            setCommentInputs({ ...commentInputs, [postId]: '' })
            fetchPosts() // Refresh to show new comment
        } catch (err) {
            alert(err.message)
        }
    }

    const handleNewPost = async () => {
        if (!newPost.trim()) return
        try {
            const response = await fetch(`${API_BASE_URL}/social/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('internlink_token')}`
                },
                body: JSON.stringify({ content: newPost })
            })
            if (!response.ok) throw new Error('Post failed')
            setNewPost('')
            fetchPosts()
        } catch (err) {
            alert(err.message)
        }
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>📰 Social Feed</h1>
                <p>Connect with professionals and stay updated</p>
            </div>

            <div className="feed-layout">
                {/* Create Post */}
                <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
                    <div className="create-post">
                        <div className="avatar" style={{ background: 'var(--gradient-primary)' }}>Y</div>
                        <textarea placeholder="Share something with the community..." value={newPost} onChange={e => setNewPost(e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                        <button className="btn btn-primary btn-sm" onClick={handleNewPost}>
                            <FiSend /> Post
                        </button>
                    </div>
                </div>

                {/* Posts */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>Loading feed...</div>
                ) : posts.map(post => (
                    <div className="post-card" key={post.id}>
                        <div className="post-header">
                            <div className="avatar" style={{ background: 'var(--gradient-secondary)' }}>{post.author_name?.[0]}</div>
                            <div className="post-author-info">
                                <strong>{post.author_name}</strong>
                                <small>Full Stack Developer</small>
                            </div>
                            <span className="post-time">{new Date(post.created_at).toLocaleDateString()}</span>
                            {post.user_id !== user?.id && (
                                <button className="btn btn-sm btn-secondary" onClick={() => toggleFollow(post.user_id)} style={{ marginLeft: '0.5rem' }}>
                                    <FiUserPlus /> Follow
                                </button>
                            )}
                        </div>

                        <div className="post-content">{post.content}</div>

                        <div className="post-actions">
                            <button className={`post-action-btn ${post.is_liked ? 'liked' : ''}`} onClick={() => toggleLike(post.id)}>
                                <FiHeart /> {post.likes_count}
                            </button>
                            <button className="post-action-btn">
                                <FiMessageSquare /> {post.comments_count}
                            </button>
                            <button className="post-action-btn">
                                <FiShare2 /> {post.shares_count}
                            </button>
                        </div>

                        {/* Comments */}
                        {post.comments && post.comments.length > 0 && (
                            <div className="post-comments">
                                {post.comments.map(c => (
                                    <div className="comment-item" key={c.id}>
                                        <div className="avatar avatar-sm" style={{ background: 'var(--gradient-success)' }}>{c.author_name?.charAt(0) || 'U'}</div>
                                        <div className="comment-body">
                                            <strong>{c.author_name}</strong>
                                            <p>{c.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Comment Input */}
                        <div className="comment-input">
                            <input
                                placeholder="Write a comment..."
                                value={commentInputs[post.id] || ''}
                                onChange={e => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                                onKeyDown={e => e.key === 'Enter' && addComment(post.id)}
                            />
                            <button className="btn btn-sm btn-primary" onClick={() => addComment(post.id)}>
                                <FiSend />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
