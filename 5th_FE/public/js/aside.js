// ==================== Aside Menu Functions ====================

// Aside 메뉴 토글 함수
function asideMenu() {
  const asideMenu = document.getElementById('asideMenu');
  const overlay = document.getElementById('asideOverlay');
  
  if (asideMenu && overlay) {
    asideMenu.classList.toggle('show');
    overlay.classList.toggle('show');
  }
}

// Aside 메뉴 닫기 함수
function closeAsideMenu() {
  const asideMenu = document.getElementById('asideMenu');
  const overlay = document.getElementById('asideOverlay');
  
  if (asideMenu && overlay) {
    asideMenu.classList.remove('show');
    overlay.classList.remove('show');
  }
}

// Aside 메뉴 렌더링 함수
function renderAsideMenu() {
  const isLoggedIn = Auth.isLoggedIn();
  const userProfile = Auth.profile();
  
  const asideMenu = document.createElement('div');
  asideMenu.id = 'asideMenu';
  asideMenu.className = 'aside-menu';
  
  // 로그인 상태에 따른 인사말
  const greeting = isLoggedIn && userProfile.nickname 
    ? `${userProfile.nickname}님, 안녕하세요!`
    : '커뮤니티에 오신 것을 환영합니다';
  
  const asideContent = `
    <div class="aside-header">
      <button class="aside-close-btn" onclick="closeAsideMenu()">×</button>
      <h2 class="aside-title">아무 말 대잔치</h2>
      <p class="aside-subtitle">${greeting}</p>
    </div>
    
    <div class="aside-content">
      <div class="aside-actions">
        ${isLoggedIn ? `
          <a href="/" class="aside-action-btn primary" onclick="closeAsideMenu()">홈</a>
          <a href="/post_new" class="aside-action-btn primary" onclick="closeAsideMenu()">글쓰기</a>
          <a href="/profile" class="aside-action-btn secondary" onclick="closeAsideMenu()">내 프로필</a>
          <a href="/change-password" class="aside-action-btn secondary" onclick="closeAsideMenu()">비밀번호 변경</a>
          <a href="#" class="aside-action-btn tertiary" onclick="handleLogout(); closeAsideMenu();">로그아웃</a>
        ` : `
          <a href="/" class="aside-action-btn primary" onclick="closeAsideMenu()">홈</a>
          <a href="/login" class="aside-action-btn primary" onclick="closeAsideMenu()">로그인</a>
          <a href="/signup" class="aside-action-btn secondary" onclick="closeAsideMenu()">회원가입</a>
        `}
      </div>
      
      <div class="aside-footer">
        <a href="/privacy" class="aside-footer-link" onclick="closeAsideMenu()">개인정보처리방침</a>
      </div>
    </div>
  `;
  
  asideMenu.innerHTML = asideContent;
  
  // 오버레이 생성
  const overlay = document.createElement('div');
  overlay.id = 'asideOverlay';
  overlay.className = 'aside-overlay';
  overlay.onclick = closeAsideMenu;
  
  // body에 추가
  document.body.appendChild(asideMenu);
  document.body.appendChild(overlay);
}


// 전역 함수로 등록
window.asideMenu = asideMenu;
window.closeAsideMenu = closeAsideMenu;
window.renderAsideMenu = renderAsideMenu;
