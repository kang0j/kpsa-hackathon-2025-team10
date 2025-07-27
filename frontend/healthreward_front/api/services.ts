// services.ts
import apiClient from './client';

// 백엔드 API에 맞춘 타입 정의
export interface User {
  id: string;
  email: string;
  name: string;
  rewardPoints: number;
  level: number;
  exp: number;
  createdAt: string;
  updatedAt: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
}

export interface ReceiptItem {
  id: string;
  transactionId: string;
  itemName: string;
  price: number;
  quantity: number;
  categoryId: string | null;
  healthyScore: number;
  commentByAI: string;
}

export interface Transaction {
  id: string;
  userId: string;
  storeName: string;
  totalAmount: number;
  transactionDate: string;
  status: string;
  verifiedById: string | null;
  createdAt: string;
  updatedAt: string;
  items: ReceiptItem[];
}

export interface ReceiptUploadResponse {
  message: string;
  transaction: Transaction;
}

export interface SupplementItem {
  제품명: string;
  설명: string;
  링크: string;
}

export interface SupplementRecommendation {
  oneCommand: string;
  "맞춤 영양제 추천": string[];
  "ai 추천 사항": string;
}

export interface SupplementResponse {
  success: boolean;
  message: string;
  data: {
    recommendation: string; // JSON 문자열
  };
}

// API 서비스 함수들
export const authService = {
  // 회원가입
  signup: async (data: SignupData): Promise<User> => {
    const response = await apiClient.post('/auth/signup', data);
    return response.data;
  },

  // 로그인
  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await apiClient.post('/login', data);
    return response.data;
  },

  // 로그아웃
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('authToken');
  },

  // 현재 사용자 정보 조회
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  }
};

export const userService = {
  // 사용자 목록 조회
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/users');
    return response.data;
  },

  // 사용자 생성
  createUser: async (userData: SignupData): Promise<User> => {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },

  // 사용자 수정
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },

  // 사용자 삭제
  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  // 사용자 정보 조회 (포인트 포함)
  getUserInfo: async (userId: string): Promise<User> => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  }
};

export const receiptService = {
  // 영수증 업로드
  uploadReceipt: async (userId: string, imageFile: File): Promise<ReceiptUploadResponse> => {
    const formData = new FormData();
    formData.append('receiptImage', imageFile);
    
    const response = await apiClient.post(`/receipts/upload/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export const transactionService = {
  // 사용자별 거래내역 조회
  getUserTransactions: async (userId: string): Promise<Transaction[]> => {
    const response = await apiClient.get(`/transactions?userId=${userId}`);
    return response.data;
  },
};

export const supplementService = {
  // 사용자별 영양제 추천 조회
  getSupplementRecommendation: async (userId: string): Promise<SupplementRecommendation> => {
    const response = await apiClient.get(`/recommends/supplement/${userId}`);
    const data: SupplementResponse = response.data;
    
    // JSON 문자열에서 ```json과 ``` 마크다운 제거
    let cleanedRecommendation = data.data.recommendation;
    
    // ```json으로 시작하는 경우 제거
    if (cleanedRecommendation.startsWith('```json\n')) {
      cleanedRecommendation = cleanedRecommendation.replace('```json\n', '');
    }
    
    // ```으로 끝나는 경우 제거
    if (cleanedRecommendation.endsWith('\n```')) {
      cleanedRecommendation = cleanedRecommendation.replace('\n```', '');
    }
    
    // 단순히 ```로 끝나는 경우도 제거
    if (cleanedRecommendation.endsWith('```')) {
      cleanedRecommendation = cleanedRecommendation.replace('```', '');
    }
    
    // JSON 문자열을 파싱하여 실제 객체로 변환
    const recommendation: SupplementRecommendation = JSON.parse(cleanedRecommendation.trim());
    return recommendation;
  },
};

// 일반적인 API 호출 함수
export const apiService = {
  // GET 요청
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await apiClient.get(endpoint);
    return response.data;
  },

  // POST 요청
  post: async <T>(endpoint: string, data: any): Promise<T> => {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  },

  // PUT 요청
  put: async <T>(endpoint: string, data: any): Promise<T> => {
    const response = await apiClient.put(endpoint, data);
    return response.data;
  },

  // DELETE 요청
  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await apiClient.delete(endpoint);
    return response.data;
  }
};