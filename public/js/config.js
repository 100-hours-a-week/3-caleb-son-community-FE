/**
 * 프론트엔드 설정 파일
 */

// Lambda 업로드 설정
const LAMBDA_CONFIG = {
  // Lambda API Gateway URL (배포 후 실제 URL로 변경)
  uploadUrl: 'https://jp9lmczklk.execute-api.us-east-1.amazonaws.com/default/image-upload', 
  
  // Lambda 사용 여부 (true: Lambda, false: 기존 백엔드)
  enabled: true, // 배포 후 true로 변경
  
  // 타임아웃 설정 (밀리초)
  timeout: 30000,
  
  // 재시도 설정
  retryCount: 2,
  retryDelay: 1000
};

// 이미지 업로드 설정
const IMAGE_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxTotalSize: 5 * 1024 * 1024, // 5MB (전체)
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  compressionThreshold: 2 * 1024 * 1024, // 2MB 이상이면 압축
  compressionQuality: 0.8
};

// API 엔드포인트 설정
const API_CONFIG = {
  baseUrl: '/api',
  endpoints: {
    postImageUpload: '/posts/upload-image',
    profileImageUpload: '/users/upload-profile-image',
    publicProfileImageUpload: '/users/upload-profile-image-public'
  }
};

