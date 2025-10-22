import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Archive from './pages/Archive'
import Post from './pages/Post'
import Guestbook from './pages/Guestbook'
import Timeline from './pages/Timeline'
import About from './pages/About'
import './App.css'

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
  const [font, setFont] = useState(localStorage.getItem('font') || 'sans-serif')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute('data-font', font)
    localStorage.setItem('font', font)
  }, [font])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const toggleFont = () => {
    setFont(prev => prev === 'sans-serif' ? 'serif' : 'sans-serif')
  }

  return (
    <Router>
      <div className="app">
        <Header theme={theme} font={font} toggleTheme={toggleTheme} toggleFont={toggleFont} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/archive/:category" element={<Archive />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/guestbook" element={<Guestbook />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

