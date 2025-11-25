#!/bin/bash

# 프론트엔드 배포 스크립트 (백엔드 URL 자동 설정)
# 사용법: ./deploy-frontend.sh <프론트엔드-EC2-IP> <백엔드-EC2-IP> <PEM-KEY-PATH>

if [ "$#" -ne 3 ]; then
    echo "사용법: ./deploy-frontend.sh <프론트엔드-EC2-IP> <백엔드-EC2-IP> <PEM-KEY-PATH>"
    echo "예시: ./deploy-frontend.sh 54.123.45.67 13.125.123.45 ~/my-key.pem"
    exit 1
fi

FRONTEND_IP=$1
BACKEND_IP=$2
PEM_KEY=$3
DEPLOY_DIR="/home/ubuntu/frontend"
BACKEND_URL="http://${BACKEND_IP}:8080"

echo "🚀 프론트엔드 배포 시작..."
echo "프론트엔드 EC2: $FRONTEND_IP"
echo "백엔드 URL: $BACKEND_URL"

# 1. .env.production 파일 생성 또는 업데이트
echo "📝 환경변수 파일 생성 중..."
if [ -f ".env.production" ]; then
    echo "기존 .env.production 파일을 백업합니다..."
    cp .env.production .env.production.backup
fi

cat > .env.production << EOF
PORT=3003
BACKEND_URL=${BACKEND_URL}
EOF

echo "✅ 환경변수 파일 생성 완료:"
cat .env.production

# 2. 배포할 파일 압축
echo "📦 파일 압축 중..."
tar -czf frontend.tar.gz \
    server.js \
    package.json \
    package-lock.json \
    .env.production \
    public/

# 3. EC2로 전송
echo "📤 EC2로 전송 중..."
scp -i "$PEM_KEY" frontend.tar.gz ubuntu@$FRONTEND_IP:/home/ubuntu/

# 4. EC2에서 배포 실행
echo "🔧 EC2에서 배포 실행 중..."
ssh -i "$PEM_KEY" ubuntu@$FRONTEND_IP << ENDSSH
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
    echo "환경변수 확인:"
    cat .env

    # 의존성 설치
    echo "의존성 설치 중..."
    npm install --production

    # PM2로 재시작
    pm2 delete frontend 2>/dev/null || true
    pm2 start server.js --name frontend
    pm2 save

    # 압축 파일 삭제
    rm /home/ubuntu/frontend.tar.gz

    echo "✅ 프론트엔드 배포 완료!"
    pm2 status
ENDSSH

# 로컬 압축 파일 삭제
rm frontend.tar.gz

echo ""
echo "🎉 배포가 완료되었습니다!"
echo "프론트엔드 접속 주소: http://$FRONTEND_IP"
echo ""
echo "⚠️  확인 사항:"
echo "  1. 프론트엔드가 정상적으로 작동하는지 확인: http://$FRONTEND_IP"
echo "  2. 백엔드 API 연결이 정상인지 확인"
echo "  3. 브라우저 콘솔에서 CORS 오류가 없는지 확인"

