import { useState } from 'react'
import { mockPosts } from '../../data/mockData'
import { FiHeart, FiMessageSquare, FiShare2, FiSend, FiUserPlus, FiUserCheck } from 'react-icons/fi'
import './UserPages.css'

export default function Feed() {
    const [posts, setPosts] = useState(mockPosts)
    const [newPost, setNewPost] = useState('')
    const [following, setFollowing] = useState([2])
    const [commentInputs, setCommentInputs] = useState({})

    const toggleLike = (postId) => {
        setPosts(posts.map(p => p.id === postId ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p))
    }

    const toggleFollow = (authorId) => {
        setFollowing(f => f.includes(authorId) ? f.filter(id => id !== authorId) : [...f, authorId])
    }

    const addComment = (postId) => {
        const text = commentInputs[postId]
        if (!text?.trim()) return
        setPosts(posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, { id: Date.now(), author: 'You', text, time: 'Just now' }] } : p))
        setCommentInputs({ ...commentInputs, [postId]: '' })
    }

    const handleNewPost = () => {
        if (!newPost.trim()) return
        const post = {
            id: Date.now(), author: 'You', avatar: 'Y', role: 'Student',
            time: 'Just now', content: newPost, likes: 0, comments: [], shares: 0, liked: false
        }
        setPosts([post, ...posts])
        setNewPost('')
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
                {posts.map(post => (
                    <div className="post-card" key={post.id}>
                        <div className="post-header">
                            <div className="avatar" style={{ background: 'var(--gradient-secondary)' }}>{post.avatar}</div>
                            <div className="post-author-info">
                                <strong>{post.author}</strong>
                                <small>{post.role}</small>
                            </div>
                            <span className="post-time">{post.time}</span>
                            {post.author !== 'You' && (
                                <button className="btn btn-sm btn-secondary" onClick={() => toggleFollow(post.id)} style={{ marginLeft: '0.5rem' }}>
                                    {following.includes(post.id) ? <><FiUserCheck /> Following</> : <><FiUserPlus /> Follow</>}
                                </button>
                            )}
                        </div>

                        <div className="post-content">{post.content}</div>

                        <div className="post-actions">
                            <button className={`post-action-btn ${post.liked ? 'liked' : ''}`} onClick={() => toggleLike(post.id)}>
                                <FiHeart /> {post.likes}
                            </button>
                            <button className="post-action-btn">
                                <FiMessageSquare /> {post.comments.length}
                            </button>
                            <button className="post-action-btn">
                                <FiShare2 /> {post.shares}
                            </button>
                        </div>

                        {/* Comments */}
                        {post.comments.length > 0 && (
                            <div className="post-comments">
                                {post.comments.map(c => (
                                    <div className="comment-item" key={c.id}>
                                        <div className="avatar avatar-sm" style={{ background: 'var(--gradient-success)' }}>{c.author.charAt(0)}</div>
                                        <div className="comment-body">
                                            <strong>{c.author}</strong>
                                            <p>{c.text}</p>
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
