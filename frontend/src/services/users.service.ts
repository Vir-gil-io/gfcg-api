import api from '../api/axiosConfig.js';
import type { User } from '../types/index.js';

export const usersService = {
  async getAll(): Promise<User[]> {
    const { data } = await api.get<User[]>('/user');
    return data;
  },

  async getById(id: number): Promise<User> {
    const { data } = await api.get<User>(`/user/${id}`);
    return data;
  },

  async update(id: number, dto: { name?: string; lastname?: string }): Promise<User> {
    const { data } = await api.put<User>(`/user/${id}`, dto);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/user/${id}`);
  },
};