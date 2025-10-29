# 쿠키/세션 기반 인증

## 🔧 백엔드 구현

### 주요 설정
- **Spring Security**: 세션 기반 인증/인가
- **세션 만료**: 30분
- **동시 세션**: 한 사용자당 1개 세션만 허용

### 핵심 API
- `POST /api/users/login` - 로그인 (세션 생성)
- `GET /api/users/session-info` - 세션 정보 확인
- `POST /api/users/logout` - 로그아웃 (세션 무효화)

### 세션 확인 패턴
```java
HttpSession session = request.getSession(false);
if (session == null || session.getAttribute("userId") == null) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new ApiResponse<>("unauthorized", "로그인이 필요합니다."));
}
Integer userId = (Integer) session.getAttribute("userId");
```


## 🔄 인증 플로우

### 로그인
1. 사용자가 로그인 요청
2. 서버에서 사용자 인증
3. 세션 생성 및 쿠키 설정
4. 클라이언트에 사용자 정보 저장

### API 호출
1. 브라우저가 자동으로 쿠키 포함
2. 서버에서 세션 확인
3. 세션 있으면 → 정상 처리
4. 세션 없으면 → 401 오류 → 자동 로그아웃

### 로그아웃
1. 서버 세션 무효화
2. 클라이언트 정보 정리
3. 로그인 페이지로 이동

## 🛡️ 보안 특징

- **서버 사이드 세션**: 사용자 정보를 서버에 안전하게 저장
- **자동 쿠키 관리**: 브라우저가 세션 쿠키를 자동으로 관리
- **실시간 동기화**: 서버와 클라이언트 상태 자동 동기화
- **자동 로그아웃**: 세션 만료 시 자동 처리

## 🔧 사용법

### 기본 사용
```javascript
// 로그인 상태 확인
if (Auth.isLoggedIn()) {
    console.log('사용자 ID:', Auth.userId());
}

// 세션 상태 확인
const result = await Auth.checkSession();
if (result.success) {
    console.log('세션 정보:', result.sessionInfo);
}
```

### 세션 모니터링
```javascript
// 1분마다 세션 확인
const monitorId = Auth.startSessionMonitoring(60000);
// 중지: clearInterval(monitorId);
```

## 📊 데이터 구조

### 서버 세션
```json
{
  "userId": 123,
  "email": "user@example.com", 
  "nickname": "사용자닉네임",
  "sessionId": "ABC123DEF456",
  "maxInactiveInterval": 1800
}
```

### 클라이언트 LocalStorage
```json
{
  "userId": 123,
  "profile": {
    "email": "user@example.com",
    "nickname": "사용자닉네임"
  }
}
```

## 🚀 장점

- **보안성**: 서버 사이드 세션으로 더 안전
- **자동화**: 브라우저가 쿠키를 자동 관리
- **동기화**: 서버와 클라이언트 상태 자동 동기화
- **표준화**: Spring Security를 통한 표준 보안 처리

## 📝 주의사항

- **세션 만료**: 30분 후 자동 만료
- **동시 세션**: 한 사용자당 1개 세션만 허용
- **메모리 사용**: 서버 메모리에 세션 저장
- **CORS 설정**: 다른 도메인 사용 시 쿠키 설정 필요
