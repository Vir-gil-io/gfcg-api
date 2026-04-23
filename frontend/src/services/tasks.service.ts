import api from '../api/axiosConfig';
import { Task } from '../types/';

export interface CreateTaskDto {
  name:        string;
  description: string;
  priority:    boolean;
}

export interface UpdateTaskDto {
  name?:        string;
  description?: string;
  priority?:    boolean;
}

export const tasksService = {
  async getAll(): Promise<Task[]> {
    const { data } = await api.get<Task[]>('/task');
    return data;
  },

  async create(dto: CreateTaskDto): Promise<Task> {
    const { data } = await api.post<Task>('/task', dto);
    return data;
  },

  async update(id: number, dto: UpdateTaskDto): Promise<Task> {
    const { data } = await api.put<Task>(`/task/${id}`, dto);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/task/${id}`);
  },
};