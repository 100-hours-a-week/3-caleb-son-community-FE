#!/bin/bash

# 배포 스크립트
# 사용법: ./deploy.sh <EC2-IP> <PEM-KEY-PATH>

if [ "$#" -ne 2 ]; then
    echo "사용법: ./deploy.sh <EC2-IP> <PEM-KEY-PATH>"
    echo "예시: ./deploy.sh 13.125.123.45 ~/my-key.pem"
    exit 1
fi

EC2_IP=$1
PEM_KEY=$2
DEPLOY_DIR="/home/ubuntu/frontend"

echo "🚀 프론트엔드 배포 시작..."

# 1. 배포할 파일 압축
echo "📦 파일 압축 중..."
tar -czf frontend.tar.gz \
    server.js \
    package.json \
    package-lock.json \
    .env.production \
    public/

# 2. EC2로 전송
echo "📤 EC2로 전송 중..."
scp -i "$PEM_KEY" frontend.tar.gz ubuntu@$EC2_IP:/home/ubuntu/

# 3. EC2에서 배포 실행
echo "⚙️  EC2에서 배포 실행 중..."
ssh -i "$PEM_KEY" ubuntu@$EC2_IP << 'ENDSSH'
    # 기존 디렉토리 백업
    if [ -d "/home/ubuntu/frontend" ]; then
        echo "기존 배포본 백업 중..."
        sudo rm -rf /home/ubuntu/frontend.backup
        sudo mv /home/ubuntu/frontend /home/ubuntu/frontend.backup
    fi

    # 새 디렉토리 생성 및 압축 해제
    mkdir -p /home/ubuntu/frontend
    tar -xzf /home/ubuntu/frontend.tar.gz -C /home/ubuntu/frontend
    cd /home/ubuntu/frontend

    # .env 파일 설정
    cp .env.production .env

    # 의존성 설치 (node_modules가 없으면)
    if [ ! -d "node_modules" ]; then
        echo "의존성 설치 중..."
        npm install --production
    fi

    # PM2로 재시작
    pm2 delete frontend 2>/dev/null || true
    pm2 start server.js --name frontend

    # 압축 파일 삭제
    rm /home/ubuntu/frontend.tar.gz

    echo "✅ 프론트엔드 배포 완료!"
ENDSSH

# 로컬 압축 파일 삭제
rm frontend.tar.gz

echo "🎉 배포가 완료되었습니다!"
echo "📍 접속 주소: http://$EC2_IP"

