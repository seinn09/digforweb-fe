import { apiClient, setAuthToken, removeAuthToken } from './api';
import type {
  AuthResponse,
  LoginResponse,
  LoginCredentials,
  RegisterPetugasData,
  RegisterViewerData,
  User,
} from '../types/api';

export const authService = {
  /**
   * Register as Petugas (Officer)
   */
  async registerPetugas(data: RegisterPetugasData): Promise<AuthResponse> {
    const response = await apiClient.post<LoginResponse>('/register-petugas', data);
    if (response.token) {
      setAuthToken(response.token);
    }
    // Create user object from response
    const user: User = {
      id: 0, // Will be updated when we fetch user profile
      name: data.name,
      email: data.email,
      role: 'petugas',
      created_at: new Date().toISOString(),
    };
    return { user, token: response.token };
  },

  /**
   * Register as Viewer
   */
  async registerViewer(data: RegisterViewerData): Promise<AuthResponse> {
    const response = await apiClient.post<LoginResponse>('/register-viewer', data);
    if (response.token) {
      setAuthToken(response.token);
    }
    // Create user object from response
    const user: User = {
      id: 0, // Will be updated when we fetch user profile
      name: data.name,
      email: data.email,
      role: 'viewer',
      created_at: new Date().toISOString(),
    };
    return { user, token: response.token };
  },

  /**
   * Login
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<LoginResponse>('/login', credentials);
    console.log('Raw API response:', response);
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    // Create user object from response data
    const user: User = {
      id: 0, // Temporary - backend doesn't return user ID
      name: credentials.email.split('@')[0], // Use email prefix as name
      email: credentials.email,
      role: response.role,
      created_at: new Date().toISOString(),
    };
    
    console.log('Created user object:', user);
    return { user, token: response.token };
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/logout');
    } finally {
      removeAuthToken();
    }
  },
};
