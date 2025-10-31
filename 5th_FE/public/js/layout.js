// ==================== Layout Functions ====================

// 로그인 상태 변경 시 헤더 업데이트
function updateHeader() {
  const existingHeader = document.querySelector('.header');
  const existingAside = document.getElementById('asideMenu');
  const existingOverlay = document.getElementById('asideOverlay');
  
  if (existingHeader) {
    existingHeader.remove();
  }
  if (existingAside) {
    existingAside.remove();
  }
  if (existingOverlay) {
    existingOverlay.remove();
  }
  
  renderHeader();
}

// 로그인 상태 변경 감지 (localStorage 변경 감지)
window.addEventListener('storage', function(e) {
  if (e.key === 'auth.user') {
    updateHeader();
  }
});

// 전역 함수로 등록
window.updateHeader = updateHeader;
