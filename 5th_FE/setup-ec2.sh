#!/bin/bash

# EC2 초기 설정 스크립트
# EC2에 SSH 접속 후 실행하세요
# curl -O https://your-url/setup-ec2.sh && bash setup-ec2.sh

echo "🔧 EC2 서버 설정 시작..."

# 1. 시스템 업데이트
echo "📦 시스템 업데이트 중..."
sudo apt update && sudo apt upgrade -y

# 2. Node.js 18.x 설치
echo "📦 Node.js 설치 중..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 3. PM2 설치 (프로세스 관리자)
echo "📦 PM2 설치 중..."
sudo npm install -g pm2

# 4. Nginx 설치
echo "📦 Nginx 설치 중..."
sudo apt install -y nginx

# 5. MySQL 설치 (백엔드용)
echo "📦 MySQL 설치 중..."
sudo apt install -y mysql-server

# 6. Java 17 설치 (백엔드용)
echo "📦 Java 17 설치 중..."
sudo apt install -y openjdk-17-jdk

# 7. 방화벽 설정
echo "🔒 방화벽 설정 중..."
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw --force enable

# 8. 디렉토리 생성
echo "📁 디렉토리 생성 중..."
mkdir -p /home/ubuntu/frontend
mkdir -p /home/ubuntu/backend
mkdir -p /home/ubuntu/logs

# 9. Nginx 설정
echo "⚙️  Nginx 설정 중..."
sudo tee /etc/nginx/sites-available/default > /dev/null <<'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name _;
    
    # 로그 설정
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;
    
    # 프론트엔드 (/)
    location / {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 백엔드 API (/api)
    location /api/ {
        rewrite ^/api/(.*)$ /$1 break;
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 백엔드 프라이버시 페이지
    location /privacy {
        proxy_pass http://localhost:8080/privacy;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

# 10. MySQL 초기 설정
echo "🗄️  MySQL 설정 중..."
sudo mysql -e "CREATE DATABASE IF NOT EXISTS community_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'community_user'@'localhost' IDENTIFIED BY 'Gun1996gun!';"
sudo mysql -e "GRANT ALL PRIVILEGES ON community_db.* TO 'community_user'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# 11. PM2 startup 설정
echo "🚀 PM2 자동 시작 설정 중..."
pm2 startup | tail -n 1 | bash
pm2 save

# 12. 버전 확인
echo "✅ 설치 완료! 버전 확인:"
echo "Node.js: $(node -v)"
echo "npm: $(npm -v)"
echo "PM2: $(pm2 -v)"
echo "Nginx: $(nginx -v 2>&1)"
echo "MySQL: $(mysql --version)"
echo "Java: $(java -version 2>&1 | head -n 1)"

echo ""
echo "🎉 EC2 서버 설정이 완료되었습니다!"
echo ""
echo "⚠️  다음 단계:"
echo "1. MySQL 비밀번호를 변경하세요: sudo mysql -u root -p"
echo "2. application.yml에 MySQL 정보를 설정하세요"
echo "3. .env 파일에 백엔드 URL을 설정하세요"
echo "4. 배포 스크립트를 실행하세요: ./deploy.sh <EC2-IP> <PEM-KEY>"

