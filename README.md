# 🎨 Caleb Son Community - Frontend

> **Vanilla JavaScript + Express.js** 기반의 커뮤니티 프론트엔드 애플리케이션

## 📋 프로젝트 개요

이 프로젝트는 **Vanilla JavaScript**와 **Express.js**를 사용하여 구축된 커뮤니티 웹 애플리케이션의 프론트엔드입니다. 사용자 인증, 게시글 작성/조회, 댓글 시스템 등 커뮤니티의 핵심 기능을 제공하는 SPA(Single Page Application)입니다.

## 🏗️ 아키텍처

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Browser       │    │   Express.js    │    │   Spring Boot   │
│   (Vanilla JS)  │◄──►│   (Proxy)       │◄──►│   (Backend API) │
│   Port: 3001    │    │   Port: 3001    │    │   Port: 8080    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Static Files  │    │   API Proxy      │    │   Database      │
│   (HTML/CSS/JS) │    │   Middleware     │    │   (MySQL)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 기술 스택

### Frontend Core
- **Language**: Vanilla JavaScript (ES6+)
- **Server**: Express.js 4.19.2
- **Proxy**: http-proxy-middleware 3.0.3
- **Styling**: Pure CSS3
- **Build Tool**: Node.js + npm

### Development Tools
- **Environment**: dotenv 16.4.5
- **Development**: nodemon 3.1.0
- **Package Manager**: npm

## 📁 프로젝트 구조

```
5th_FE/
├── public/                          # 정적 파일
│   ├── css/
│   │   └── style.css                # 메인 스타일시트
│   ├── js/                          # JavaScript 모듈
│   │   ├── api.js                   # API 통신 모듈
│   │   ├── auth.js                  # 인증 관리 모듈
│   │   ├── ui.js                    # UI 렌더링 모듈
│   │   └── aside.js                 # 사이드바 모듈
│   ├── assets/                      # 정적 자산
│   │   ├── images/                  # 이미지 파일
│   │   └── fonts/                   # 폰트 파일
│   ├── index.html                   # 메인 페이지
│   ├── login.html                   # 로그인 페이지
│   ├── signup.html                  # 회원가입 페이지
│   ├── post_new.html                # 게시글 작성 페이지
│   ├── post_detail.html             # 게시글 상세 페이지
│   ├── profile.html                 # 프로필 페이지
│   └── change-password.html         # 비밀번호 변경 페이지
├── server.js                        # Express 서버
├── package.json                     # 의존성 관리
└── README.md                        # 프로젝트 문서
```

## 🔧 설치 및 실행

### 1. 의존성 설치

```bash
cd 5th_FE
npm install
```

### 2. 환경 설정

`.env` 파일 생성:
```bash
PORT=3001
BACKEND_URL=http://localhost:8080
```

### 3. 개발 서버 실행

```bash
# 일반 실행
npm start

# 개발 모드 (nodemon)
npm run dev
```

**프론트엔드 서버**: http://localhost:3001

## 📱 주요 페이지

### 🏠 메인 페이지 (`/`)
- **기능**: 게시글 목록 조회
- **특징**: 
  - 비로그인 시 로그인 페이지로 리다이렉트
  - 로그인 시 게시글 상세 페이지로 이동
  - 스크롤바 자동 숨김/표시 기능
  - 플로팅 새 글 작성 버튼

### 🔐 인증 페이지
- **로그인** (`/login`): 이메일 기반 로그인
- **회원가입** (`/signup`): 신규 사용자 등록
- **특징**: 
  - 로컬 스토리지에 userId 저장
  - X-USER-ID 헤더로 백엔드 인증

### 📝 게시글 관리
- **게시글 작성** (`/posts/new`): 새 게시글 작성
- **게시글 상세** (`/posts/detail?id={postId}`): 게시글 상세 조회
- **특징**: 
  - 로그인 필요
  - 이미지 업로드 지원

### 👤 프로필 관리
- **프로필** (`/profile`): 사용자 프로필 관리
- **비밀번호 변경** (`/change-password`): 보안 강화
- **특징**: 
  - 프로필 이미지 URL 로컬 저장
  - 헤더 동작 유지

## 🎨 UI/UX 특징

### 🎯 반응형 디자인
- **모바일 최적화**: 터치 친화적 인터페이스
- **데스크톱 지원**: 넓은 화면 활용
- **적응형 레이아웃**: 다양한 화면 크기 대응

### ⚡ 실시간 업데이트
- **로그인 상태 동기화**: localStorage 변경 감지
- **헤더 자동 업데이트**: 인증 상태 변경 시 즉시 반영
- **스크롤 최적화**: 자동 스크롤바 숨김/표시

### 🎨 사용자 경험
- **직관적 네비게이션**: 명확한 메뉴 구조
- **플로팅 버튼**: 빠른 글 작성 접근
- **시각적 피드백**: 로딩 상태 및 에러 처리

## 🔌 API 통신

### 📡 API 모듈 (`api.js`)
```javascript
// 기본 API 호출 함수
async function apiFetch(url, options = {}) {
  // X-USER-ID 헤더 자동 추가
  // 에러 처리 및 응답 파싱
}

// 사용 예시
const posts = await apiFetch('/posts');
const user = await apiFetch('/users/profile');
```

### 🔐 인증 관리 (`auth.js`)
```javascript
// 로그인 상태 확인
function isLoggedIn() {
  return localStorage.getItem('auth.user') !== null;
}

// 사용자 정보 가져오기
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('auth.user'));
}
```

### 🎨 UI 렌더링 (`ui.js`)
```javascript
// 헤더 렌더링
function renderHeader() {
  // 로그인 상태에 따른 헤더 표시
}

// 게시글 카드 렌더링
function renderCardPost(post) {
  // 게시글 카드 HTML 생성
}
```

## 🛠️ 개발 도구

### 📦 패키지 관리
```json
{
  "dependencies": {
    "dotenv": "^16.4.5",           // 환경 변수 관리
    "express": "^4.19.2",          // 웹 서버
    "http-proxy-middleware": "^3.0.3"  // API 프록시
  },
  "devDependencies": {
    "nodemon": "^3.1.0"            // 개발 서버 자동 재시작
  }
}
```

### 🔧 개발 스크립트
```json
{
  "scripts": {
    "start": "node server.js",      // 프로덕션 실행
    "dev": "nodemon server.js"     // 개발 모드
  }
}
```

## 🎯 핵심 기능

### 🔐 사용자 인증
- **로그인/로그아웃**: 세션 기반 인증
- **회원가입**: 이메일 중복 검사
- **프로필 관리**: 닉네임, 프로필 이미지 수정
- **비밀번호 변경**: 보안 강화

### 📝 게시글 시스템
- **게시글 작성**: 제목, 내용, 이미지 첨부
- **게시글 조회**: 목록, 상세, 검색
- **게시글 수정/삭제**: 작성자 권한 관리
- **이미지 업로드**: 드래그 앤 드롭 지원

### 💬 댓글 시스템
- **댓글 작성**: 실시간 댓글 추가
- **댓글 조회**: 시간순 정렬
- **댓글 수정/삭제**: 작성자 권한 관리

### 🎨 UI 컴포넌트
- **헤더**: 로그인 상태 표시, 네비게이션
- **사이드바**: 사용자 메뉴
- **게시글 카드**: 제목, 내용, 메타데이터
- **댓글 박스**: 댓글 입력 및 표시

## 🚀 성능 최적화

### 📱 프론트엔드 최적화
- **모듈화**: 기능별 JavaScript 모듈 분리
- **캐싱**: 브라우저 캐시 활용
- **이미지 최적화**: S3 CDN 활용
- **번들 최적화**: 필요한 모듈만 로드

### ⚡ 사용자 경험
- **로딩 상태**: 사용자 피드백 제공
- **에러 처리**: 친화적인 에러 메시지
- **반응성**: 빠른 UI 업데이트

**Made with  by Caleb Son**