import { apiClient } from './api';
import type {
  ForensicAction,
  ForensicActionCreateData,
  ForensicActionUpdateData,
} from '../types/api';

export const tindakanService = {
  /**
   * Get all forensic actions
   */
  async getActions(): Promise<ForensicAction[]> {
    return apiClient.get<ForensicAction[]>('/tindakan');
  },

  /**
   * Get forensic action by ID
   */
  async getActionById(id: number): Promise<ForensicAction> {
    return apiClient.get<ForensicAction>(`/tindakan/${id}`);
  },

  /**
   * Create new forensic action
   */
  async createAction(data: ForensicActionCreateData): Promise<ForensicAction> {
    return apiClient.post<ForensicAction>('/tindakan', data);
  },

  /**
   * Update forensic action
   */
  async updateAction(id: number, data: ForensicActionUpdateData): Promise<ForensicAction> {
    return apiClient.put<ForensicAction>(`/tindakan/${id}`, data);
  },

  /**
   * Delete forensic action
   */
  async deleteAction(id: number): Promise<void> {
    return apiClient.delete<void>(`/tindakan/${id}`);
  },
};
