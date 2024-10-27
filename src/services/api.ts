import axios from 'axios';
import type { Project } from '../types';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
});

export const projectsApi = {
  getAll: async () => {
    const { data } = await api.get<Project[]>('/projects');
    return data;
  },

  create: async (project: Omit<Project, 'id' | 'createdAt'>) => {
    const { data } = await api.post<Project>('/projects', project);
    return data;
  },

  update: async (id: string, project: Partial<Project>) => {
    const { data } = await api.patch<Project>(`/projects/${id}`, project);
    return data;
  },

  delete: async (id: string) => {
    await api.delete(`/projects/${id}`);
  },
};