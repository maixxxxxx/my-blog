# 🚀 快速开始指南

## 本地开发（5分钟上手）

### 1️⃣ 安装依赖
```bash
npm run install:all
```

### 2️⃣ 启动开发服务器
```bash
npm run dev
```

### 3️⃣ 访问网站
打开浏览器访问：http://localhost:3000

就这么简单！ 🎉

---

## 服务器部署（火山云）

### 快速部署（一键脚本）

```bash
# 1. 上传代码到服务器
scp -r . root@你的服务器IP:/var/www/my-blog

# 2. 登录服务器
ssh root@你的服务器IP

# 3. 运行部署脚本
cd /var/www/my-blog
chmod +x deploy.sh
./deploy.sh
```

### 详细步骤

如果需要详细的部署步骤，请查看：
- 📖 [详细部署指南](./DEPLOYMENT_GUIDE.md)
- 📖 [README 文档](./README.md)

---

## 常用命令

```bash
# 开发环境
npm run dev              # 启动开发服务器

# 生产环境
npm run build            # 构建前端
npm start                # 启动后端服务器

# PM2 管理（服务器）
pm2 start my-blog        # 启动
pm2 stop my-blog         # 停止
pm2 restart my-blog      # 重启
pm2 logs my-blog         # 查看日志
```

---

## 需要帮助？

- 📚 查看 [README.md](./README.md) 了解完整功能
- 📖 查看 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) 了解部署详情
- 🐛 遇到问题？查看常见问题解答

---

祝你使用愉快！ ❤️

