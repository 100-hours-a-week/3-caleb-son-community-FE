const Auth = (() => {
  const KEY = 'auth.user';
  function get(){ try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } }
  function set(o){ localStorage.setItem(KEY, JSON.stringify(o || {})); }
  function clear(){ localStorage.removeItem(KEY); }
  function isLoggedIn(){ return !!get().userId; }
  function userId(){ return get().userId || null; }
  function profile(){ return get().profile || {}; }
  function setUserId(id){ const cur=get(); cur.userId=Number(id); set(cur); }
  function setProfile(p){ const cur=get(); cur.profile={...(cur.profile||{}), ...p}; set(cur); }
  
  // 로그인 함수
  async function login(email, password) {
    try {
      const response = await apiFetch('/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      if (response && response.data) {
        const { userId, email: userEmail, nickname, profileImageUrl } = response.data;
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
  
  return { get, set, clear, isLoggedIn, userId, profile, setUserId, setProfile, login };
})();
