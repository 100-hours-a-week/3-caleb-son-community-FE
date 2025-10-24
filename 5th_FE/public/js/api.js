async function apiFetch(path, opts = {}) {
  const headers = new Headers(opts.headers || {});
  headers.set('Accept', 'application/json');
  const uid = Auth.userId();
  if (uid) headers.set('X-USER-ID', String(uid));
  
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
