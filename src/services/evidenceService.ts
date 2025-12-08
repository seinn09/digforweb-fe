import { apiClient } from './api';
import type {
  Evidence,
  EvidenceCreateData,
  EvidenceUpdateData,
} from '../types/api';

export const evidenceService = {
  /**
   * Get all evidence
   */
  async getEvidence(): Promise<Evidence[]> {
    return apiClient.get<Evidence[]>('/evidence');
  },

  /**
   * Get evidence by ID
   */
  async getEvidenceById(id: number): Promise<Evidence> {
    return apiClient.get<Evidence>(`/evidence/${id}`);
  },

  /**
   * Create new evidence
   */
  async createEvidence(data: EvidenceCreateData): Promise<Evidence> {
    return apiClient.post<Evidence>('/evidence', data);
  },

  /**
   * Update evidence
   */
  async updateEvidence(id: number, data: EvidenceUpdateData): Promise<Evidence> {
    return apiClient.put<Evidence>(`/evidence/${id}`, data);
  },

  /**
   * Delete evidence
   */
  async deleteEvidence(id: number): Promise<void> {
    return apiClient.delete<void>(`/evidence/${id}`);
  },
};
