# Frontend (Vanilla JS + Express)


## 실행
```bash
npm i
npm run start
# http://localhost:3001
```
`.env`에서 `BACKEND_URL`(기본: http://localhost:8080)과 `PORT` 변경 가능.

## 페이지
- `/` — 게시글 목록 (비로그인 클릭 → /login, 로그인 클릭 → 상세)
- `/login` — 로그인(로컬 userId 저장 → X-USER-ID로 전송)
- `/signup` — 회원가입(성공 시 userId 저장)
- `/posts/new` — 글 작성(로그인 필요)
- `/posts/detail?id={postId}` — 글 상세(로그인 필요)
- `/profile` — 프로필 이미지 URL 로컬 저장(헤더 동작 유지용)
