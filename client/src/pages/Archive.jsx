import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import PostCard from '../components/PostCard'
import './Archive.css'

function Archive() {
  const { category } = useParams()
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
    fetchCategories()
  }, [category])

  const fetchPosts = async () => {
    try {
      const url = category ? `/api/posts?category=${category}` : '/api/posts'
      const response = await axios.get(url)
      setPosts(response.data)
    } catch (error) {
      console.error('获取文章失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories')
      setCategories(response.data)
    } catch (error) {
      console.error('获取分类失败:', error)
    }
  }

  return (
    <div className="archive container">
      <div className="archive-header">
        <h1 className="page-title">
          {category ? `${category} - 归档` : '文章归档'}
        </h1>
      </div>

      <div className="archive-content">
        <aside className="archive-sidebar">
          <h3>分类</h3>
          <ul className="category-list">
            {categories.map((cat, index) => (
              <li key={index}>
                <a href={`/archive/${cat.name}`} className={category === cat.name ? 'active' : ''}>
                  {cat.name} ({cat.count})
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <main className="archive-main">
          {loading ? (
            <div className="loading">加载中...</div>
          ) : posts.length > 0 ? (
            <div className="posts-list">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>该分类下暂无文章</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Archive

