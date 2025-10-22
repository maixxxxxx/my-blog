#!/bin/bash

# 博客部署脚本
# 使用方法: ./deploy.sh

echo "🚀 开始部署博客..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到 Node.js，请先安装 Node.js"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"
echo "✅ NPM 版本: $(npm -v)"

# 安装依赖
echo ""
echo "📦 安装依赖..."
npm run install:all

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

# 构建前端
echo ""
echo "🔨 构建前端..."
cd client
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 前端构建失败"
    exit 1
fi

cd ..

# 检查 PM2
echo ""
if ! command -v pm2 &> /dev/null; then
    echo "⚠️  未检测到 PM2，正在安装..."
    npm install -g pm2
fi

# 停止旧进程
echo ""
echo "🛑 停止旧进程..."
pm2 delete my-blog 2>/dev/null || true

# 启动新进程
echo ""
echo "▶️  启动服务..."
pm2 start server/server.js --name "my-blog"

# 保存 PM2 配置
pm2 save

echo ""
echo "✨ 部署完成！"
echo ""
echo "📊 查看状态: pm2 status"
echo "📝 查看日志: pm2 logs my-blog"
echo "🔄 重启服务: pm2 restart my-blog"
echo ""
echo "🌐 访问: http://localhost:5000"

