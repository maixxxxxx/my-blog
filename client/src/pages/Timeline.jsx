import { useState, useEffect } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'
import './Timeline.css'

function Timeline() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/timeline')
      setEvents(response.data)
    } catch (error) {
      console.error('获取时光轴失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="timeline-page container">
      <div className="timeline-header">
        <h1 className="page-title">时光轴</h1>
        <p className="page-subtitle">记录生活的每一个瞬间</p>
      </div>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <div className="timeline">
          {events.map((event, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <div className="timeline-date">
                  {dayjs(event.date).format('YYYY年MM月DD日')}
                </div>
                <h3 className="timeline-title">{event.title}</h3>
                <p className="timeline-description">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Timeline

