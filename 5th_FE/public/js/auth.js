const Auth = (() => {
  const ACCESS_TOKEN_KEY = 'auth.accessToken';
  const REFRESH_TOKEN_KEY = 'auth.refreshToken';
  const USER_KEY = 'auth.user';
  
  function getAccessToken(){ return localStorage.getItem(ACCESS_TOKEN_KEY); }
  function getRefreshToken(){ return localStorage.getItem(REFRESH_TOKEN_KEY); }
  function getUser(){ try { return JSON.parse(localStorage.getItem(USER_KEY) || '{}'); } catch { return {}; } }
  
  function setAccessToken(token){ localStorage.setItem(ACCESS_TOKEN_KEY, token || ''); }
  function setRefreshToken(token){ localStorage.setItem(REFRESH_TOKEN_KEY, token || ''); }
  function setUser(user){ localStorage.setItem(USER_KEY, JSON.stringify(user || {})); }
  
  function clear(){ 
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
  
  function isLoggedIn(){ 
    const accessToken = getAccessToken();
    if (!accessToken) return false;
    
    // 토큰 만료 확인 (간단한 체크)
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch {
      return false;
    }
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
        body: JSON.stringify({ email, password })
      });
      
      if (response && response.data) {
        const { 
          userId, 
          email: userEmail, 
          nickname, 
          profileImageUrl, 
          accessToken, 
          refreshToken 
        } = response.data;
        
        // JWT 토큰 저장
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        
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
  
  // 토큰 갱신 함수
  async function refreshAccessToken() {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('Refresh token이 없습니다.');
      }
      
      const response = await apiFetch('/users/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken })
      });
      
      if (response && response.data) {
        const { accessToken } = response.data;
        setAccessToken(accessToken);
        return { success: true, accessToken };
      } else {
        throw new Error('토큰 갱신에 실패했습니다.');
      }
    } catch (error) {
      // 토큰 갱신 실패 시 로그아웃
      logout();
      return { success: false, error: error.message };
    }
  }
  
  // 로그아웃 함수
  function logout() {
    clear();
    if (typeof updateHeader === 'function') {
      updateHeader();
    }
  }
  
  return { 
    getAccessToken, 
    getRefreshToken, 
    getUser, 
    setAccessToken, 
    setRefreshToken, 
    setUser, 
    clear, 
    isLoggedIn, 
    userId, 
    profile, 
    setUserId, 
    setProfile, 
    login, 
    refreshAccessToken, 
    logout 
  };
})();
