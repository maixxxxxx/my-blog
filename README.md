# 个人博客网站

一个基于 React + Node.js 的现代化个人博客系统，具有简洁优雅的界面和丰富的功能。

## ✨ 特性

- 📝 支持 Markdown 格式文章
- 🌓 支持亮色/暗色主题切换
- 🔤 支持 Serif/Sans-Serif 字体切换
- 💬 文章评论功能
- 📋 留言板
- ⏰ 时光轴
- 📱 完全响应式设计
- ⚡ 快速加载和流畅动画

## 🛠️ 技术栈

### 前端
- React 18
- React Router
- Axios
- Vite
- Marked (Markdown 解析)
- Day.js

### 后端
- Node.js
- Express
- LowDB (JSON 数据库)

## 📦 项目结构

```
.
├── client/                # 前端代码
│   ├── src/
│   │   ├── components/   # React 组件
│   │   ├── pages/        # 页面组件
│   │   ├── App.jsx       # 主应用组件
│   │   └── main.jsx      # 入口文件
│   ├── index.html
│   └── package.json
├── server/               # 后端代码
│   ├── server.js        # Express 服务器
│   ├── db.json          # 数据库文件
│   └── package.json
├── README.md
└── package.json
```

## 🚀 快速开始

### 1. 安装依赖

```bash
# 安装所有依赖（根目录、前端、后端）
npm run install:all

# 或者分别安装
npm install
cd client && npm install
cd ../server && npm install
```

### 2. 开发环境运行

```bash
# 在项目根目录运行（同时启动前端和后端）
npm run dev

# 或者分别运行
# 终端1 - 运行前端（端口 3000）
cd client
npm run dev

# 终端2 - 运行后端（端口 5000）
cd server
npm run dev
```

访问 http://localhost:3000 查看网站

### 3. 生产环境部署

#### 方式一：在本地构建后上传

```bash
# 1. 构建前端
cd client
npm run build

# 2. 将构建文件和服务器代码上传到服务器
# - client/dist/ （前端构建文件）
# - server/ （后端代码）
# - package.json

# 3. 在服务器上安装依赖并启动
cd server
npm install
npm start
```

#### 方式二：直接在服务器上构建（推荐）

**步骤详解：**

**A. 准备服务器环境**

1. 登录火山云服务器
```bash
ssh root@你的服务器IP
```

2. 安装 Node.js（推荐使用 nvm）
```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# 安装 Node.js 18
nvm install 18
nvm use 18

# 验证安装
node -v
npm -v
```

3. 安装 Git
```bash
yum install git -y    # CentOS/RHEL
# 或
apt install git -y    # Ubuntu/Debian
```

4. 安装 PM2（进程管理器）
```bash
npm install -g pm2
```

**B. 部署代码**

1. 克隆或上传代码到服务器
```bash
# 方式1: 使用 Git（如果代码在 GitHub/GitLab）
git clone 你的仓库地址
cd 项目目录

# 方式2: 使用 scp 上传
# 在本地运行：
scp -r /home/chioooooou/下载/网站/上线的第一个博客网站 root@你的服务器IP:/var/www/
```

2. 安装依赖
```bash
cd /var/www/上线的第一个博客网站
npm run install:all
```

3. 构建前端
```bash
cd client
npm run build
cd ..
```

4. 配置环境变量
```bash
cd server
cp .env.example .env
nano .env

# 修改配置：
PORT=5000
NODE_ENV=production
```

5. 使用 PM2 启动服务
```bash
# 在项目根目录
pm2 start server/server.js --name "my-blog"

# 查看状态
pm2 status

# 查看日志
pm2 logs my-blog

# 设置开机自启
pm2 startup
pm2 save
```

**C. 配置 Nginx（推荐）**

1. 安装 Nginx
```bash
yum install nginx -y    # CentOS/RHEL
# 或
apt install nginx -y    # Ubuntu/Debian
```

2. 配置 Nginx
```bash
nano /etc/nginx/conf.d/blog.conf
```

添加以下配置：
```nginx
server {
    listen 80;
    server_name 你的域名.com;  # 替换成你的域名

    # 静态文件
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

3. 启动 Nginx
```bash
nginx -t                    # 测试配置
systemctl start nginx       # 启动
systemctl enable nginx      # 设置开机自启
systemctl status nginx      # 查看状态
```

**D. 配置域名**

1. 在火山云控制台，将域名 A 记录指向服务器 IP
2. 等待 DNS 生效（通常几分钟到几小时）
3. 访问你的域名查看网站

**E. 配置 SSL 证书（HTTPS）**

1. 安装 Certbot
```bash
yum install certbot python3-certbot-nginx -y    # CentOS/RHEL
# 或
apt install certbot python3-certbot-nginx -y    # Ubuntu/Debian
```

2. 获取证书
```bash
certbot --nginx -d 你的域名.com
```

3. 自动续期
```bash
certbot renew --dry-run
```

**F. 防火墙配置**

```bash
# 开放 80 和 443 端口
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload

# 或者使用 iptables
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

**同时在火山云控制台的安全组中开放 80 和 443 端口！**

## 📝 常用命令

### PM2 进程管理

```bash
pm2 start server/server.js --name "my-blog"  # 启动
pm2 stop my-blog                              # 停止
pm2 restart my-blog                           # 重启
pm2 delete my-blog                            # 删除
pm2 logs my-blog                              # 查看日志
pm2 monit                                     # 监控
```

### 更新网站

```bash
# 1. 拉取最新代码（如果使用 Git）
git pull

# 2. 安装新依赖（如果有）
npm run install:all

# 3. 重新构建前端
cd client
npm run build

# 4. 重启服务
pm2 restart my-blog
```

## 🔧 管理文章

### 添加新文章

1. 方式一：直接编辑 `server/db.json`
```json
{
  "posts": [
    {
      "id": "唯一ID",
      "title": "文章标题",
      "content": "# Markdown 内容",
      "excerpt": "摘要",
      "category": "分类",
      "tags": ["标签1", "标签2"],
      "date": "2025-10-17T00:00:00.000Z",
      "views": 0
    }
  ]
}
```

2. 方式二：使用 API
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "文章标题",
    "content": "# Markdown 内容",
    "excerpt": "摘要",
    "category": "技术",
    "tags": ["React", "Node.js"]
  }'
```

## 🐛 常见问题

### 1. 端口被占用
```bash
# 查看端口占用
lsof -i :5000

# 修改端口
# 编辑 server/.env 中的 PORT
```

### 2. PM2 无法启动
```bash
# 查看详细错误
pm2 logs my-blog --lines 100

# 清除 PM2 缓存
pm2 kill
pm2 start server/server.js --name "my-blog"
```

### 3. Nginx 502 错误
```bash
# 检查后端服务是否运行
pm2 status

# 检查 Nginx 配置
nginx -t

# 查看 Nginx 错误日志
tail -f /var/log/nginx/error.log
```

## 📚 更多资源

- [React 文档](https://react.dev/)
- [Express 文档](https://expressjs.com/)
- [Nginx 文档](https://nginx.org/en/docs/)
- [PM2 文档](https://pm2.keymetrics.io/)

## 📄 License

MIT License

## 💖 致谢

感谢所有开源项目的贡献者！

---

如有问题，欢迎提 Issue！

