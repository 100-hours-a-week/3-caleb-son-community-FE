async function apiFetch(path, opts = {}) {
  const headers = new Headers(opts.headers || {});
  headers.set('Accept', 'application/json');
  
  // FormData인 경우 Content-Type을 설정하지 않음 (브라우저가 자동으로 설정)
  if (opts.body && !(opts.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type','application/json');
  }
  
  // 쿠키 포함 설정 (기본값)
  const fetchOptions = {
    ...opts, 
    headers,
    credentials: opts.credentials || 'include'
  };
  
  try {
    const res = await fetch(`/api${path}`, fetchOptions);
    const contentType = res.headers.get('content-type') || '';
    let data = null;
    
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }
    
    // 401 Unauthorized 처리 (세션 만료)
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
      
      // 세션 만료인 경우 로그아웃 처리
      Auth.logout();
      window.location.href = '/login.html';
      return;
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
