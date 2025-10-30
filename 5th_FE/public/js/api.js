async function apiFetch(path, opts = {}) {
  const headers = new Headers(opts.headers || {});
  headers.set('Accept', 'application/json');
  
  // JWT 토큰 추가
  const accessToken = Auth.getAccessToken();
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  
  // FormData인 경우 Content-Type을 설정하지 않음 (브라우저가 자동으로 설정)
  if (opts.body && !(opts.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type','application/json');
  }
  
  try {
    const res = await fetch(`/api${path}`, { ...opts, headers });
    const contentType = res.headers.get('content-type') || '';
    let data = null;
    
    if (contentType.includes('application/json')) {
      data = await res.json();  
    } else {
      data = await res.text();
    }
    
    // 401 Unauthorized 처리 (토큰 만료)
    if (res.status === 401) {
      const errorData = data || {};
      
      // 공개 API인 경우 401 오류를 그대로 전달 (로그인 페이지로 리다이렉트하지 않음)
      if (path === '/posts' || 
          (path.startsWith('/posts/') && path.match(/^\/posts\/\d+$/)) ||
          (path.startsWith('/comments/') && path.match(/^\/comments\/\d+$/))) {
        const errorMessage = (errorData && errorData.message) || res.statusText || '서버 오류가 발생했습니다.';
        const error = new Error(errorMessage);
        error.status = res.status;
        error.payload = errorData;
        throw error;
      }
      
      // 토큰 만료인 경우 자동 갱신 시도
      if (errorData.message === 'token_expired' || errorData.message === 'invalid_token') {
        const refreshResult = await Auth.refreshAccessToken();
        
        if (refreshResult.success) {
          // 새로운 토큰으로 재시도
          const newHeaders = new Headers(opts.headers || {});
          newHeaders.set('Accept', 'application/json');
          newHeaders.set('Authorization', `Bearer ${Auth.getAccessToken()}`);
          
          if (opts.body && !(opts.body instanceof FormData) && !newHeaders.has('Content-Type')) {
            newHeaders.set('Content-Type','application/json');
          }
          
          const retryRes = await fetch(`/api${path}`, { ...opts, headers: newHeaders });
          const retryContentType = retryRes.headers.get('content-type') || '';
          let retryData = null;
          
          if (retryContentType.includes('application/json')) {
            retryData = await retryRes.json();
          } else {
            retryData = await retryRes.text();
          }
          
          if (!retryRes.ok) {
            const errorMessage = (retryData && retryData.message) || retryRes.statusText || '서버 오류가 발생했습니다.';
            const error = new Error(errorMessage);
            error.status = retryRes.status;
            error.payload = retryData;
            throw error;
          }
          
          return retryData;
        } else {
          // 토큰 갱신 실패 시 로그아웃 처리
          Auth.logout();
          window.location.href = '/login.html';
          return;
        }
      } else {
        // 다른 401 오류 (인증 실패 등)
        Auth.logout();
        window.location.href = '/login.html';
        return;
      }
    }
    
    if (!res.ok) { 
      const errorMessage = (data && data.message) || res.statusText || '서버 오류가 발생했습니다.';
      const error = new Error(errorMessage);
      error.status = res.status;
      error.payload = data;
      throw error;
    }
    
    return data;
  } catch (error) {
    // 네트워크 오류 처리
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('네트워크 연결을 확인해주세요.');
    }
    throw error;
  }
}
