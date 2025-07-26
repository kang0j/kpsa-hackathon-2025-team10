// api/client.ts
import axios from 'axios';

// API 클라이언트 설정
const apiClient = axios.create({
  baseURL: 'https://df779d93eb1b.ngrok-free.app',
  headers: {
    'Content-Type': 'application/json',
    // ngrok-free.app 사용 시 필요할 수 있는 헤더
    'ngrok-skip-browser-warning': 'true'
  },
  timeout: 3000000, // 10초 타임아웃
});

// 요청 인터셉터 (토큰 자동 추가 등)
apiClient.interceptors.request.use(
  (config) => {
    // 로컬스토리지에서 토큰 가져오기 (있다면)
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 처리)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 인증 실패 시 토큰 제거 및 로그인 페이지로 리다이렉트
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;