import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// 中间件
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// 静态文件
app.use(express.static(path.join(__dirname, '../client/dist')))

// 初始化数据库
const adapter = new JSONFile(path.join(__dirname, 'db.json'))
const db = new Low(adapter, {})

// 初始化数据
await db.read()
db.data ||= {
  posts: [],
  comments: [],
  guestbook: [],
  timeline: [],
  categories: []
}
await db.write()

// ============ API 路由 ============

// 获取所有文章
app.get('/api/posts', async (req, res) => {
  await db.read()
  let posts = db.data.posts || []
  
  const { category } = req.query
  if (category) {
    posts = posts.filter(post => post.category === category)
  }
  
  // 按日期排序（最新的在前）
  posts.sort((a, b) => new Date(b.date) - new Date(a.date))
  
  res.json(posts)
})

// 获取单篇文章
app.get('/api/posts/:id', async (req, res) => {
  await db.read()
  const post = db.data.posts.find(p => p.id === req.params.id)
  
  if (!post) {
    return res.status(404).json({ error: '文章不存在' })
  }
  
  res.json(post)
})

// 创建文章
app.post('/api/posts', async (req, res) => {
  await db.read()
  
  const newPost = {
    id: Date.now().toString(),
    title: req.body.title,
    content: req.body.content,
    excerpt: req.body.excerpt || '',
    category: req.body.category || '未分类',
    tags: req.body.tags || [],
    date: new Date().toISOString(),
    views: 0,
    comments: []
  }
  
  db.data.posts.push(newPost)
  await db.write()
  
  res.status(201).json(newPost)
})

// 更新文章
app.put('/api/posts/:id', async (req, res) => {
  await db.read()
  const index = db.data.posts.findIndex(p => p.id === req.params.id)
  
  if (index === -1) {
    return res.status(404).json({ error: '文章不存在' })
  }
  
  db.data.posts[index] = {
    ...db.data.posts[index],
    ...req.body,
    id: req.params.id // 保持ID不变
  }
  
  await db.write()
  res.json(db.data.posts[index])
})

// 删除文章
app.delete('/api/posts/:id', async (req, res) => {
  await db.read()
  const index = db.data.posts.findIndex(p => p.id === req.params.id)
  
  if (index === -1) {
    return res.status(404).json({ error: '文章不存在' })
  }
  
  db.data.posts.splice(index, 1)
  await db.write()
  
  res.json({ message: '删除成功' })
})

// 增加文章浏览量
app.post('/api/posts/:id/view', async (req, res) => {
  await db.read()
  const post = db.data.posts.find(p => p.id === req.params.id)
  
  if (!post) {
    return res.status(404).json({ error: '文章不存在' })
  }
  
  post.views = (post.views || 0) + 1
  await db.write()
  
  res.json({ views: post.views })
})

// 获取文章评论
app.get('/api/posts/:id/comments', async (req, res) => {
  await db.read()
  const comments = (db.data.comments || []).filter(c => c.postId === req.params.id)
  comments.sort((a, b) => new Date(b.date) - new Date(a.date))
  res.json(comments)
})

// 添加文章评论
app.post('/api/posts/:id/comments', async (req, res) => {
  await db.read()
  
  const newComment = {
    id: Date.now().toString(),
    postId: req.params.id,
    name: req.body.name,
    content: req.body.content,
    date: new Date().toISOString()
  }
  
  db.data.comments = db.data.comments || []
  db.data.comments.push(newComment)
  await db.write()
  
  res.status(201).json(newComment)
})

// 获取留言板消息
app.get('/api/guestbook', async (req, res) => {
  await db.read()
  const messages = db.data.guestbook || []
  messages.sort((a, b) => new Date(b.date) - new Date(a.date))
  res.json(messages)
})

// 添加留言
app.post('/api/guestbook', async (req, res) => {
  await db.read()
  
  const newMessage = {
    id: Date.now().toString(),
    name: req.body.name,
    content: req.body.content,
    date: new Date().toISOString()
  }
  
  db.data.guestbook = db.data.guestbook || []
  db.data.guestbook.push(newMessage)
  await db.write()
  
  res.status(201).json(newMessage)
})

// 获取时光轴事件
app.get('/api/timeline', async (req, res) => {
  await db.read()
  const events = db.data.timeline || []
  events.sort((a, b) => new Date(b.date) - new Date(a.date))
  res.json(events)
})

// 添加时光轴事件
app.post('/api/timeline', async (req, res) => {
  await db.read()
  
  const newEvent = {
    id: Date.now().toString(),
    title: req.body.title,
    description: req.body.description,
    date: req.body.date || new Date().toISOString()
  }
  
  db.data.timeline = db.data.timeline || []
  db.data.timeline.push(newEvent)
  await db.write()
  
  res.status(201).json(newEvent)
})

// 获取分类列表
app.get('/api/categories', async (req, res) => {
  await db.read()
  const posts = db.data.posts || []
  
  const categoryMap = {}
  posts.forEach(post => {
    const cat = post.category || '未分类'
    categoryMap[cat] = (categoryMap[cat] || 0) + 1
  })
  
  const categories = Object.keys(categoryMap).map(name => ({
    name,
    count: categoryMap[name]
  }))
  
  res.json(categories)
})

// 所有其他路由返回 React 应用
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'))
})

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`)
})

