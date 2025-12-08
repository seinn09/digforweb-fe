import { apiClient } from './api';
import type {
  Case,
  CaseCreateData,
  CaseUpdateData,
} from '../types/api';

export const kasusService = {
  /**
   * Get all cases
   */
  async getCases(): Promise<Case[]> {
    return apiClient.get<Case[]>('/kasus');
  },

  /**
   * Get case by ID
   */
  async getCaseById(id: number): Promise<Case> {
    return apiClient.get<Case>(`/kasus/${id}`);
  },

  /**
   * Create new case
   */
  async createCase(data: CaseCreateData): Promise<Case> {
    return apiClient.post<Case>('/kasus', data);
  },

  /**
   * Update case
   */
  async updateCase(id: number, data: CaseUpdateData): Promise<Case> {
    return apiClient.put<Case>(`/kasus/${id}`, data);
  },

  /**
   * Delete case
   */
  async deleteCase(id: number): Promise<void> {
    return apiClient.delete<void>(`/kasus/${id}`);
  },
};
