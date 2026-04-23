import api from '../api/axiosConfig';
import { User } from '../types/index';

export interface LoginResponse {
  access_token:  string;
  refresh_token: string;
}

export interface RegisterDto {
  name:     string;
  lastname: string;
  username: string;
  password: string;
}

export const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/login', { username, password });
    return data;
  },

  async me(): Promise<User> {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async register(dto: RegisterDto): Promise<User> {
    const { data } = await api.post<User>('/user', dto);
    return data;
  },
};