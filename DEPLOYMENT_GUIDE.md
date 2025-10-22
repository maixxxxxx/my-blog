# 🚀 详细部署指南

## 目录
1. [服务器准备](#1-服务器准备)
2. [环境配置](#2-环境配置)
3. [代码部署](#3-代码部署)
4. [Web服务器配置](#4-web服务器配置)
5. [域名配置](#5-域名配置)
6. [SSL证书](#6-ssl证书)
7. [维护与更新](#7-维护与更新)

---

## 1. 服务器准备

### 1.1 登录服务器
```bash
ssh root@你的服务器IP
# 首次登录可能需要输入密码
```

### 1.2 更新系统
```bash
# CentOS/RHEL
yum update -y

# Ubuntu/Debian  
apt update && apt upgrade -y
```

### 1.3 创建项目目录
```bash
mkdir -p /var/www
cd /var/www
```

---

## 2. 环境配置

### 2.1 安装 Node.js（使用 NVM - 推荐）

```bash
# 安装 NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 重新加载配置
source ~/.bashrc

# 安装 Node.js 18
nvm install 18
nvm use 18
nvm alias default 18

# 验证安装
node -v   # 应该显示 v18.x.x
npm -v    # 应该显示 npm 版本
```

### 2.2 安装 PM2
```bash
npm install -g pm2

# 验证安装
pm2 -v
```

### 2.3 安装 Git
```bash
# CentOS/RHEL
yum install git -y

# Ubuntu/Debian
apt install git -y

# 验证安装
git --version
```

---

## 3. 代码部署

### 3.1 上传代码到服务器

#### 方式 A：使用 SCP（从本地上传）
```bash
# 在你的本地电脑运行
scp -r /home/chioooooou/下载/网站/上线的第一个博客网站 root@服务器IP:/var/www/

# 如果文件夹名带中文，建议先重命名
cd /home/chioooooou/下载/网站/
mv 上线的第一个博客网站 my-blog
scp -r my-blog root@服务器IP:/var/www/
```

#### 方式 B：使用 Git（推荐）
```bash
# 在服务器上运行
cd /var/www
git clone https://github.com/你的用户名/你的仓库.git my-blog
cd my-blog
```

### 3.2 安装依赖
```bash
cd /var/www/my-blog

# 安装所有依赖
npm run install:all

# 如果上面命令失败，分别安装
npm install
cd client && npm install
cd ../server && npm install
cd ..
```

### 3.3 构建前端
```bash
cd /var/www/my-blog/client
npm run build

# 验证构建
ls -la dist/
# 应该看到 index.html 和 assets 文件夹
```

### 3.4 配置环境变量
```bash
cd /var/www/my-blog/server

# 创建 .env 文件
cat > .env << EOF
PORT=5000
NODE_ENV=production
EOF

# 验证
cat .env
```

### 3.5 启动应用
```bash
cd /var/www/my-blog

# 使用 PM2 启动
pm2 start ecosystem.config.js

# 或者简单启动
pm2 start server/server.js --name my-blog

# 查看状态
pm2 status

# 查看日志
pm2 logs my-blog

# 设置开机自启
pm2 startup
pm2 save
```

---

## 4. Web服务器配置

### 4.1 安装 Nginx

```bash
# CentOS/RHEL
yum install nginx -y

# Ubuntu/Debian
apt install nginx -y

# 启动并设置开机自启
systemctl start nginx
systemctl enable nginx

# 验证安装
nginx -v
systemctl status nginx
```

### 4.2 配置 Nginx

```bash
# 创建配置文件
nano /etc/nginx/conf.d/blog.conf

# 或者使用 vim
vim /etc/nginx/conf.d/blog.conf
```

粘贴以下配置（替换域名）：
```nginx
server {
    listen 80;
    server_name 你的域名.com www.你的域名.com;
    
    access_log /var/log/nginx/blog_access.log;
    error_log /var/log/nginx/blog_error.log;
    
    client_max_body_size 10M;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
    
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        proxy_pass http://localhost:5000;
        expires 1y;
        add_header Cache-Control "public";
    }
}
```

### 4.3 测试并重启 Nginx
```bash
# 测试配置
nginx -t

# 重启 Nginx
systemctl restart nginx

# 查看状态
systemctl status nginx
```

### 4.4 配置防火墙

#### 使用 firewalld（CentOS/RHEL）
```bash
# 开放端口
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload

# 查看规则
firewall-cmd --list-all
```

#### 使用 ufw（Ubuntu/Debian）
```bash
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
ufw status
```

#### 使用 iptables
```bash
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
service iptables save
```

### 4.5 火山云安全组配置

⚠️ **重要**：还需要在火山云控制台配置安全组！

1. 登录火山云控制台
2. 进入 ECS 实例管理
3. 点击你的服务器实例
4. 进入"安全组"设置
5. 添加入站规则：
   - 协议：TCP
   - 端口：80
   - 源：0.0.0.0/0
   
   - 协议：TCP
   - 端口：443
   - 源：0.0.0.0/0

---

## 5. 域名配置

### 5.1 域名解析

1. 登录你的域名注册商控制台（或火山云域名控制台）
2. 进入 DNS 解析设置
3. 添加 A 记录：
   ```
   记录类型：A
   主机记录：@
   记录值：你的服务器IP
   TTL：600
   ```
4. 添加 www 子域名（可选）：
   ```
   记录类型：A
   主机记录：www
   记录值：你的服务器IP
   TTL：600
   ```

### 5.2 验证域名解析
```bash
# 在本地电脑运行
ping 你的域名.com

# 或者
nslookup 你的域名.com

# 或者使用在线工具
# https://www.whatsmydns.net/
```

等待 DNS 生效（通常 10分钟-2小时）

### 5.3 测试访问
```bash
# 在浏览器访问
http://你的域名.com
```

---

## 6. SSL证书（HTTPS）

### 6.1 安装 Certbot

```bash
# CentOS/RHEL 8+
dnf install certbot python3-certbot-nginx -y

# CentOS/RHEL 7
yum install certbot python2-certbot-nginx -y

# Ubuntu/Debian
apt install certbot python3-certbot-nginx -y
```

### 6.2 获取证书

```bash
# 自动配置（推荐）
certbot --nginx -d 你的域名.com -d www.你的域名.com

# 按提示操作：
# 1. 输入邮箱
# 2. 同意服务条款（输入 A）
# 3. 选择是否重定向 HTTP 到 HTTPS（推荐选择 2）
```

### 6.3 验证 HTTPS
```bash
# 访问
https://你的域名.com
```

### 6.4 设置自动续期
```bash
# Certbot 会自动设置，验证一下
certbot renew --dry-run

# 查看定时任务
systemctl list-timers | grep certbot
```

---

## 7. 维护与更新

### 7.1 查看运行状态
```bash
# PM2 状态
pm2 status

# 查看日志
pm2 logs my-blog --lines 100

# 监控
pm2 monit

# Nginx 状态
systemctl status nginx

# 查看 Nginx 日志
tail -f /var/log/nginx/blog_access.log
tail -f /var/log/nginx/blog_error.log
```

### 7.2 更新网站

#### 如果使用 Git
```bash
cd /var/www/my-blog

# 拉取最新代码
git pull

# 安装新依赖（如果有）
npm run install:all

# 重新构建前端
cd client
npm run build

# 重启服务
pm2 restart my-blog
```

#### 如果手动上传
```bash
# 1. 在本地构建
cd /home/chioooooou/下载/网站/上线的第一个博客网站/client
npm run build

# 2. 上传 dist 文件夹
scp -r dist root@服务器IP:/var/www/my-blog/client/

# 3. 上传修改的服务器文件
scp server/server.js root@服务器IP:/var/www/my-blog/server/

# 4. 重启服务
ssh root@服务器IP "cd /var/www/my-blog && pm2 restart my-blog"
```

### 7.3 备份数据库
```bash
# 备份数据库文件
cp /var/www/my-blog/server/db.json /var/www/my-blog/server/db.json.backup

# 定期备份脚本
cat > /root/backup_blog.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp /var/www/my-blog/server/db.json /var/www/backups/db_$DATE.json
# 只保留最近30天的备份
find /var/www/backups -name "db_*.json" -mtime +30 -delete
EOF

chmod +x /root/backup_blog.sh

# 添加定时任务（每天凌晨2点备份）
crontab -e
# 添加这一行：
0 2 * * * /root/backup_blog.sh
```

### 7.4 性能优化
```bash
# 查看服务器资源使用
htop
# 或
top

# 查看磁盘使用
df -h

# 清理 PM2 日志
pm2 flush

# 清理 npm 缓存
npm cache clean --force
```

---

## 8. 常见问题排查

### 8.1 网站无法访问
```bash
# 1. 检查 PM2 服务
pm2 status
pm2 logs my-blog

# 2. 检查端口监听
netstat -tlnp | grep 5000

# 3. 检查 Nginx
systemctl status nginx
nginx -t

# 4. 检查防火墙
firewall-cmd --list-all
# 或
ufw status

# 5. 测试本地访问
curl http://localhost:5000
```

### 8.2 502 Bad Gateway
```bash
# 通常是后端服务未启动
pm2 restart my-blog

# 查看详细日志
pm2 logs my-blog --lines 200
```

### 8.3 数据库错误
```bash
# 检查数据库文件权限
ls -la /var/www/my-blog/server/db.json

# 修复权限
chmod 644 /var/www/my-blog/server/db.json

# 从备份恢复
cp /var/www/my-blog/server/db.json.backup /var/www/my-blog/server/db.json
pm2 restart my-blog
```

---

## 9. 快速命令参考

```bash
# 启动服务
pm2 start my-blog

# 停止服务
pm2 stop my-blog

# 重启服务
pm2 restart my-blog

# 查看日志
pm2 logs my-blog

# 重启 Nginx
systemctl restart nginx

# 测试 Nginx 配置
nginx -t

# 查看所有进程
pm2 list

# 监控服务
pm2 monit
```

---

## 🎉 完成！

现在你的博客应该已经成功上线了！

访问 https://你的域名.com 查看效果。

如有问题，请查看日志或联系技术支持。

