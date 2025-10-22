import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import dayjs from 'dayjs'
import { marked } from 'marked'
import './Post.css'

function Post() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState({ name: '', content: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPost()
    fetchComments()
  }, [id])

  const fetchPost = async () => {
    try {
      const response = await axios.get(`/api/posts/${id}`)
      setPost(response.data)
      // 增加浏览量
      await axios.post(`/api/posts/${id}/view`)
    } catch (error) {
      console.error('获取文章失败:', error)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/posts/${id}/comments`)
      setComments(response.data)
    } catch (error) {
      console.error('获取评论失败:', error)
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!newComment.name || !newComment.content) {
      alert('请填写姓名和评论内容')
      return
    }

    try {
      await axios.post(`/api/posts/${id}/comments`, newComment)
      setNewComment({ name: '', content: '' })
      fetchComments()
    } catch (error) {
      console.error('提交评论失败:', error)
      alert('评论提交失败，请重试')
    }
  }

  if (loading) {
    return <div className="container loading">加载中...</div>
  }

  if (!post) {
    return <div className="container empty-state">文章不存在</div>
  }

  return (
    <div className="post-detail container">
      <article className="post-article">
        <header className="post-detail-header">
          <h1 className="post-detail-title">{post.title}</h1>
          <div className="post-detail-meta">
            <span>发布于 {dayjs(post.date).format('YYYY年MM月DD日')}</span>
            <span>·</span>
            <span>{post.views || 0} 次阅读</span>
            <span>·</span>
            <span>{post.category || '未分类'}</span>
          </div>
        </header>

        <div 
          className="post-content"
          dangerouslySetInnerHTML={{ __html: marked(post.content) }}
        />

        {post.tags && post.tags.length > 0 && (
          <div className="post-detail-tags">
            <span className="tags-label">标签：</span>
            {post.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </article>

      <section className="comments-section">
        <h2 className="comments-title">评论 ({comments.length})</h2>
        
        <form className="comment-form" onSubmit={handleSubmitComment}>
          <input
            type="text"
            placeholder="你的昵称"
            value={newComment.name}
            onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
            required
          />
          <textarea
            placeholder="写下你的评论..."
            rows="4"
            value={newComment.content}
            onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
            required
          />
          <button type="submit" className="submit-btn">发表评论</button>
        </form>

        <div className="comments-list">
          {comments.map((comment, index) => (
            <div key={index} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">{comment.name}</span>
                <span className="comment-date">
                  {dayjs(comment.date).format('YYYY-MM-DD HH:mm')}
                </span>
              </div>
              <div className="comment-content">{comment.content}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Post

