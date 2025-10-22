import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import './PostCard.css'

function PostCard({ post }) {
  return (
    <article className="post-card">
      <Link to={`/post/${post.id}`} className="post-link">
        <div className="post-header">
          <h2 className="post-title">{post.title}</h2>
          <div className="post-meta">
            <span className="post-date">
              发布于 {dayjs(post.date).format('YYYY-MM-DD')}
            </span>
            <span className="post-heat">
              {post.views || 0} 热度
            </span>
            {post.comments && post.comments.length > 0 && (
              <span className="post-comments">
                {post.comments.length} 条评论
              </span>
            )}
            <span className="post-category">{post.category || '日常'}</span>
          </div>
        </div>
        
        <div className="post-excerpt">
          {post.excerpt || post.content.substring(0, 150) + '...'}
        </div>
        
        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </Link>
    </article>
  )
}

export default PostCard

