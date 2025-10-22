import { useState, useEffect } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'
import './Guestbook.css'

function Guestbook() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState({ name: '', content: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await axios.get('/api/guestbook')
      setMessages(response.data)
    } catch (error) {
      console.error('获取留言失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newMessage.name || !newMessage.content) {
      alert('请填写昵称和留言内容')
      return
    }

    try {
      await axios.post('/api/guestbook', newMessage)
      setNewMessage({ name: '', content: '' })
      fetchMessages()
    } catch (error) {
      console.error('提交留言失败:', error)
      alert('留言提交失败，请重试')
    }
  }

  return (
    <div className="guestbook container">
      <div className="guestbook-header">
        <h1 className="page-title">留言板</h1>
        <p className="page-subtitle">欢迎留下你的足迹</p>
      </div>

      <div className="guestbook-content">
        <form className="message-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="你的昵称"
            value={newMessage.name}
            onChange={(e) => setNewMessage({ ...newMessage, name: e.target.value })}
            required
          />
          <textarea
            placeholder="写下你想说的话..."
            rows="5"
            value={newMessage.content}
            onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
            required
          />
          <button type="submit" className="submit-btn">提交留言</button>
        </form>

        {loading ? (
          <div className="loading">加载中...</div>
        ) : (
          <div className="messages-list">
            <h2 className="messages-title">所有留言 ({messages.length})</h2>
            {messages.map((message, index) => (
              <div key={index} className="message-item">
                <div className="message-header">
                  <span className="message-author">{message.name}</span>
                  <span className="message-date">
                    {dayjs(message.date).format('YYYY-MM-DD HH:mm')}
                  </span>
                </div>
                <div className="message-content">{message.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Guestbook

