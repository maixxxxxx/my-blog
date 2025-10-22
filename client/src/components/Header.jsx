import { Link } from 'react-router-dom'
import { useState } from 'react'
import './Header.css'

function Header({ theme, font, toggleTheme, toggleFont }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>我的博客</h1>
          </Link>
          
          <button 
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

          <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
            <ul className="nav-list">
              <li><Link to="/" onClick={() => setMenuOpen(false)}>首页</Link></li>
              <li className="dropdown">
                <Link to="/archive" onClick={() => setMenuOpen(false)}>归档</Link>
                <ul className="dropdown-menu">
                  <li><Link to="/archive/技术" onClick={() => setMenuOpen(false)}>技术</Link></li>
                  <li><Link to="/archive/生活" onClick={() => setMenuOpen(false)}>生活</Link></li>
                  <li><Link to="/archive/学习" onClick={() => setMenuOpen(false)}>学习</Link></li>
                </ul>
              </li>
              <li><Link to="/guestbook" onClick={() => setMenuOpen(false)}>留言板</Link></li>
              <li><Link to="/timeline" onClick={() => setMenuOpen(false)}>时光轴</Link></li>
              <li><Link to="/about" onClick={() => setMenuOpen(false)}>关于</Link></li>
            </ul>
            
            <div className="theme-controls">
              <button 
                onClick={toggleTheme}
                className="theme-btn"
                title={theme === 'light' ? '切换到暗色模式' : '切换到亮色模式'}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              <button 
                onClick={toggleFont}
                className="font-btn"
                title={font === 'sans-serif' ? '切换到衬线字体' : '切换到无衬线字体'}
              >
                {font === 'sans-serif' ? 'Serif' : 'Sans'}
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header

