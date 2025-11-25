/**
 * Lambda 기반 이미지 업로드 유틸리티
 * 
 * 사용법:
 * const imageUrl = await uploadImageToLambda(file, 'images');
 * 
 * config.js에서 LAMBDA_CONFIG.uploadUrl 설정 필요
 */ 

/**
 * Base64로 파일을 인코딩
 * @param {File} file - 업로드할 파일
 * @returns {Promise<string>} Base64 인코딩된 문자열
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      // data:image/jpeg;base64,... 형식에서 base64 부분만 추출
      const base64 = e.target.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Lambda를 통해 이미지를 S3에 업로드
 * @param {File} file - 업로드할 이미지 파일
 * @param {string} folder - S3 폴더 ('images' 또는 'profiles')
 * @returns {Promise<string>} 업로드된 이미지 URL
 */
async function uploadImageToLambda(file, folder = 'images') {
  // 파일 유효성 검사
  if (!file) {
    throw new Error('파일이 선택되지 않았습니다.');
  }
  
  // 이미지 파일 타입 검사
  if (!file.type.startsWith('image/')) {
    throw new Error('이미지 파일만 업로드 가능합니다.');
  }
  
  // 파일 크기 검사 (5MB)
  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error('파일 크기는 5MB 이하여야 합니다.');
  }
  
  try {
    // 파일을 Base64로 인코딩
    const base64Data = await fileToBase64(file);
    
    // Lambda 함수 호출
    const response = await fetch(LAMBDA_CONFIG.uploadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: base64Data,
        fileName: file.name,
        contentType: file.type,
        folder: folder
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.data?.error || `업로드 실패: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.message === 'upload_success' && result.data?.imageUrl) {
      return result.data.imageUrl;
    } else {
      throw new Error('이미지 URL을 받지 못했습니다.');
    }
  } catch (error) {
    console.error('Lambda 업로드 오류:', error);
    throw new Error(`이미지 업로드 실패: ${error.message}`);
  }
}

/**
 * 여러 이미지를 순차적으로 업로드
 * @param {File[]} files - 업로드할 파일 배열
 * @param {string} folder - S3 폴더
 * @param {Function} progressCallback - 진행상황 콜백 (currentIndex, totalCount)
 * @returns {Promise<string[]>} 업로드된 이미지 URL 배열
 */
async function uploadMultipleImagesToLambda(files, folder = 'images', progressCallback = null) {
  const imageUrls = [];
  
  for (let i = 0; i < files.length; i++) {
    if (progressCallback) {
      progressCallback(i, files.length);
    }
    
    const imageUrl = await uploadImageToLambda(files[i], folder);
    imageUrls.push(imageUrl);
  }
  
  if (progressCallback) {
    progressCallback(files.length, files.length);
  }
  
  return imageUrls;
}

/**
 * 기존 백엔드 API와 Lambda 중 선택하여 업로드
 * @param {File} file - 업로드할 파일
 * @param {string} folder - S3 폴더
 * @param {boolean} useLambda - Lambda 사용 여부
 * @returns {Promise<string>} 업로드된 이미지 URL
 */
async function uploadImageFlexible(file, folder = 'images', useLambda = true) {
  if (useLambda) {
    // Lambda 사용
    return await uploadImageToLambda(file, folder);
  } else {
    // 기존 백엔드 API 사용
    const formData = new FormData();
    formData.append('file', file);
    
    const endpoint = folder === 'profiles' 
      ? '/users/upload-profile-image' 
      : '/posts/upload-image';
    
    const response = await apiFetch(endpoint, {
      method: 'POST',
      body: formData
    });
    
    if (response && response.data && response.data.imageUrl) {
      return response.data.imageUrl;
    } else {
      throw new Error('이미지 업로드에 실패했습니다.');
    }
  }
}

