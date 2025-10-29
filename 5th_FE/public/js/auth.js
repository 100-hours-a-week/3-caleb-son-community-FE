const Auth = (() => {
  const USER_KEY = 'auth.user';
  
  function getUser(){ try { return JSON.parse(localStorage.getItem(USER_KEY) || '{}'); } catch { return {}; } }
  function setUser(user){ localStorage.setItem(USER_KEY, JSON.stringify(user || {})); }
  
  function clear(){ 
    localStorage.removeItem(USER_KEY);
  }
  
  function isLoggedIn(){ 
    const user = getUser();
    return user && user.userId;
  }
  
  function userId(){ return getUser().userId || null; }
  function profile(){ return getUser().profile || {}; }
  function setUserId(id){ const cur=getUser(); cur.userId=Number(id); setUser(cur); }
  function setProfile(p){ const cur=getUser(); cur.profile={...(cur.profile||{}), ...p}; setUser(cur); }
  
  // 로그인 함수
  async function login(email, password) {
    try {
      const response = await apiFetch('/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        credentials: 'include' // 쿠키 포함
      });
      
      if (response && response.data) {
        const { 
          userId, 
          email: userEmail, 
          nickname, 
          profileImageUrl
        } = response.data;
        
        // 사용자 정보 저장
        setUserId(userId);
        setProfile({ 
          email: userEmail, 
          nickname, 
          imageUrl: profileImageUrl 
        });
        
        // 로그인 성공 시 헤더 업데이트
        if (typeof updateHeader === 'function') {
          updateHeader();
        }
        
        return { success: true };
      } else {
        return { success: false, error: '로그인에 실패했습니다.' };
      }
    } catch (error) {
      return { success: false, error: error.message || '네트워크 오류가 발생했습니다.' };
    }
  }
  
  // 세션 상태 확인 함수
  async function checkSession() {
    try {
      const response = await apiFetch('/users/session-info', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response && response.data) {
        // 서버 세션 정보와 클라이언트 정보 동기화
        const sessionData = response.data;
        setUserId(sessionData.userId);
        setProfile({
          email: sessionData.email,
          nickname: sessionData.nickname,
          imageUrl: sessionData.profileImageUrl
        });
        
        return {
          success: true,
          sessionInfo: sessionData
        };
      } else {
        return { success: false, error: '세션 정보를 가져올 수 없습니다.' };
      }
    } catch (error) {
      // 401 오류는 세션이 없음을 의미
      if (error.status === 401) {
        clear(); // 클라이언트 정보도 정리
        return { success: false, error: '세션이 만료되었습니다.' };
      }
      return { success: false, error: error.message || '세션 확인 중 오류가 발생했습니다.' };
    }
  }

  // 세션 상태 모니터링 (주기적 확인)
  function startSessionMonitoring(intervalMs = 60000) { // 기본 1분마다 확인
    return setInterval(async () => {
      if (isLoggedIn()) {
        const result = await checkSession();
        if (!result.success) {
          console.log('세션이 만료되어 로그아웃 처리됩니다.');
          clear();
          if (typeof updateHeader === 'function') {
            updateHeader();
          }
          // 필요시 로그인 페이지로 리다이렉트
          // window.location.href = '/login.html';
        }
      }
    }, intervalMs);
  }

  // 세션 상태 디버깅 정보 출력
  function debugSessionInfo() {
    const user = getUser();
    console.log('=== 세션 디버깅 정보 ===');
    console.log('로컬 로그인 상태:', isLoggedIn());
    console.log('사용자 ID:', userId());
    console.log('프로필 정보:', profile());
    console.log('전체 사용자 데이터:', user);
    console.log('========================');
  }

  // 로그아웃 함수
  async function logout() {
    try {
      // 서버에 로그아웃 요청 (세션 무효화)
      await apiFetch('/users/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('로그아웃 요청 실패:', error);
    } finally {
      // 클라이언트에서 사용자 정보 제거
      clear();
      if (typeof updateHeader === 'function') {
        updateHeader();
      }
    }
  }
  
  return { 
    getUser, 
    setUser, 
    clear, 
    isLoggedIn, 
    userId, 
    profile, 
    setUserId, 
    setProfile, 
    login, 
    checkSession,
    startSessionMonitoring,
    debugSessionInfo,
    logout 
  };
})();
