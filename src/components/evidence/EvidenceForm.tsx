import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Package, MapPin, Hash, Calendar, AlertCircle } from 'lucide-react';
import { evidenceService } from '../../services/evidenceService';
import { kasusService } from '../../services/kasusService';
import type { Case } from '../../types/api';

interface EvidenceFormProps {
  evidenceId?: string;
  onBack: () => void;
}

export function EvidenceForm({ evidenceId, onBack }: EvidenceFormProps) {
  const isEditing = !!evidenceId;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cases, setCases] = useState<Case[]>([]);

  const [formData, setFormData] = useState({
    case_id: '',
    jenis_bukti: '',
    lokasi_penyimpanan: '',
    hash_value: '',
    waktu_pengambilan_bukti: ''
  });

  useEffect(() => {
    fetchCases();
    if (isEditing && evidenceId) {
      fetchEvidence();
    }
  }, [evidenceId, isEditing]);

  const fetchCases = async () => {
    try {
      const response = await kasusService.getCases();
      const casesData = Array.isArray(response) ? response : (response as any).data || [];
      setCases(casesData);
    } catch (err) {
      console.error('Failed to load cases:', err);
    }
  };

  const fetchEvidence = async () => {
    try {
      setLoading(true);
      const evidenceData = await evidenceService.getEvidenceById(Number(evidenceId));
      setFormData({
        case_id: evidenceData.case_id.toString(),
        jenis_bukti: evidenceData.jenis_bukti,
        lokasi_penyimpanan: evidenceData.lokasi_penyimpanan,
        hash_value: evidenceData.hash_value || '',
        waktu_pengambilan_bukti: evidenceData.waktu_pengambilan_bukti 
          ? evidenceData.waktu_pengambilan_bukti.slice(0, 16) // Format for datetime-local
          : ''
      });
    } catch (err: any) {
      setError('Failed to load evidence data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        case_id: Number(formData.case_id),
        jenis_bukti: formData.jenis_bukti,
        lokasi_penyimpanan: formData.lokasi_penyimpanan,
        hash_value: formData.hash_value || undefined,
        waktu_pengambilan_bukti: formData.waktu_pengambilan_bukti || undefined
      };

      if (isEditing && evidenceId) {
        await evidenceService.updateEvidence(Number(evidenceId), submitData);
      } else {
        await evidenceService.createEvidence(submitData);
      }
      onBack();
    } catch (err: any) {
      setError(err.message || 'Failed to save evidence');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="p-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Evidence
      </button>

      <div className="mb-8">
        <h1 className="text-white text-3xl mb-2">
          {isEditing ? 'Edit Evidence' : 'Add New Evidence'}
        </h1>
        <p className="text-slate-400">
          {isEditing ? 'Update evidence information' : 'Create a new evidence record'}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-2xl">
        {cases.length === 0 && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-2 text-yellow-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="mb-1">Tidak ada kasus</p>
              <p className="text-sm text-yellow-400/80">Anda perlu membuat kasus terlebih dahulu sebelum menambah bukti.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="case_id" className="block text-slate-300 mb-2">
              Pilih Kasus *
            </label>
            <select
              id="case_id"
              name="case_id"
              required
              value={formData.case_id}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Pilih kasus...</option>
              {cases.map(caseItem => (
                <option key={caseItem.id} value={caseItem.id}>
                  {caseItem.jenis_kasus} - {caseItem.korban?.nama || 'N/A'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="jenis_bukti" className="block text-slate-300 mb-2 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Jenis Bukti *
            </label>
            <input
              id="jenis_bukti"
              name="jenis_bukti"
              type="text"
              required
              value={formData.jenis_bukti}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Contoh: Screenshot Chat, Hard Drive, Log File"
            />
          </div>

          <div>
            <label htmlFor="lokasi_penyimpanan" className="block text-slate-300 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Lokasi Penyimpanan *
            </label>
            <input
              id="lokasi_penyimpanan"
              name="lokasi_penyimpanan"
              type="text"
              required
              value={formData.lokasi_penyimpanan}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="/storage/evidence/case1/screenshot.png"
            />
          </div>

          <div>
            <label htmlFor="hash_value" className="block text-slate-300 mb-2 flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Hash Value (Optional)
            </label>
            <div className="flex gap-2">
              <input
                id="hash_value"
                name="hash_value"
                type="text"
                value={formData.hash_value}
                onChange={handleChange}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="a3b5c7d9e1f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0"
              />
              <button
                type="button"
                onClick={() => {
                  // Generate a SHA-256 style hash (40 hex characters)
                  const hash = Array.from({ length: 40 }, () => 
                    Math.floor(Math.random() * 16).toString(16)
                  ).join('');
                  setFormData(prev => ({ ...prev, hash_value: hash }));
                }}
                className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors whitespace-nowrap"
                title="Generate random hash"
              >
                Generate Hash
              </button>
            </div>
            <p className="text-slate-500 text-xs mt-1">Generate a random hash or paste computed hash from file</p>
          </div>

          <div>
            <label htmlFor="waktu_pengambilan_bukti" className="block text-slate-300 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Waktu Pengambilan Bukti (Optional)
            </label>
            <input
              id="waktu_pengambilan_bukti"
              name="waktu_pengambilan_bukti"
              type="datetime-local"
              value={formData.waktu_pengambilan_bukti}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={cases.length === 0 || loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Menyimpan...' : (isEditing ? 'Update Bukti' : 'Buat Bukti')}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-slate-700 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
