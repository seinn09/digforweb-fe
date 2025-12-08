import { apiClient } from './api';
import type {
  Victim,
  VictimCreateData,
  VictimUpdateData,
} from '../types/api';

export const korbanService = {
  /**
   * Get all victims
   */
  async getVictims(): Promise<Victim[]> {
    return apiClient.get<Victim[]>('/korban');
  },

  /**
   * Get victim by ID
   */
  async getVictimById(id: number): Promise<Victim> {
    return apiClient.get<Victim>(`/korban/${id}`);
  },

  /**
   * Create new victim
   */
  async createVictim(data: VictimCreateData): Promise<Victim> {
    return apiClient.post<Victim>('/korban', data);
  },

  /**
   * Update victim
   */
  async updateVictim(id: number, data: VictimUpdateData): Promise<Victim> {
    return apiClient.put<Victim>(`/korban/${id}`, data);
  },

  /**
   * Delete victim
   */
  async deleteVictim(id: number): Promise<void> {
    return apiClient.delete<void>(`/korban/${id}`);
  },
};
