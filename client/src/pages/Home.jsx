import { useState, useEffect } from 'react'
import axios from 'axios'
import PostCard from '../components/PostCard'
import './Home.css'

function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts')
      setPosts(response.data)
    } catch (error) {
      console.error('获取文章失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="home container">
      <div className="home-header">
        <h1 className="page-title">Discovery</h1>
        <p className="page-subtitle">记录生活，分享技术</p>
      </div>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : posts.length > 0 ? (
        <div className="posts-grid">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>暂无文章，快去创建第一篇文章吧！</p>
        </div>
      )}
    </div>
  )
}

export default Home

