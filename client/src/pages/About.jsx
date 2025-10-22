import './About.css'

function About() {
  return (
    <div className="about container">
      <div className="about-header">
        <h1 className="page-title">关于我</h1>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>👋 你好</h2>
          <p>
            欢迎来到我的个人博客！这里是我记录生活、分享技术、表达想法的地方。
          </p>
        </section>

        <section className="about-section">
          <h2>💻 关于博客</h2>
          <p>
            这个博客使用 React + Node.js 构建，界面简洁优雅，注重阅读体验。
            支持暗色模式、字体切换等个性化功能。
          </p>
        </section>

        <section className="about-section">
          <h2>📝 内容方向</h2>
          <ul className="about-list">
            <li>技术文章分享</li>
            <li>学习笔记记录</li>
            <li>生活感悟思考</li>
            <li>项目经验总结</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>📬 联系方式</h2>
          <p>
            如果你有任何问题或建议，欢迎通过以下方式联系我：
          </p>
          <ul className="contact-list">
            <li>📧 邮箱：2844498914@qq.com</li>
            <li>💬 微信：zhiooooooou</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>🎯 网站信息</h2>
          <div className="site-info">
            <p><strong>建站时间：</strong>{new Date().getFullYear()}年</p>
            <p><strong>技术栈：</strong>React, Node.js, Express</p>
            <p><strong>服务器：</strong>火山云</p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default About

