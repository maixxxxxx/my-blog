import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p>Copyright © {new Date().getFullYear()} 我的博客 All Rights Reserved.</p>
          <p className="footer-info">
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
              备案号：xxx
            </a>
          </p>
          <p className="footer-tech">
            Powered by zhoujunteng
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

