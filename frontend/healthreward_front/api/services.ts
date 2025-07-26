// api/services.ts
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

// API 서비스 함수들
export const authService = {
  // 회원가입
  signup: async (data: SignupData): Promise<User> => {
    const response = await apiClient.post('/users', data);
    return response.data;
  },

  // 로그인
  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await apiClient.post('/login', data);
    return response.data;
  },

  // 로그아웃
  logout: async (): Promise<void> => {
    await apiClient.post('/api/auth/logout');
    localStorage.removeItem('authToken');
  },

  // 현재 사용자 정보 조회
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  }
};

export const userService = {
  // 사용자 목록 조회
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/api/users');
    return response.data;
  },

  // 사용자 생성
  createUser: async (userData: SignupData): Promise<User> => {
    const response = await apiClient.post('/api/users', userData);
    return response.data;
  },

  // 사용자 수정
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await apiClient.put(`/api/users/${id}`, userData);
    return response.data;
  },

  // 사용자 삭제
  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/users/${id}`);
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