import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, FileText, Calendar, User, AlertCircle } from 'lucide-react';
import { kasusService } from '../../services/kasusService';
import { korbanService } from '../../services/korbanService';
import type { Victim } from '../../types/api';

interface CaseFormProps {
  caseId?: string;
  onBack: () => void;
}

export function CaseForm({ caseId, onBack }: CaseFormProps) {
  const isEditing = !!caseId;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [victims, setVictims] = useState<Victim[]>([]);

  const [formData, setFormData] = useState({
    korban_id: '',
    jenis_kasus: '',
    tanggal_kejadian: '',
    ringkasan_kasus: '',
    status_kasus: 'pending'
  });

  useEffect(() => {
    fetchVictims();
    if (isEditing && caseId) {
      fetchCase();
    }
  }, [caseId, isEditing]);

  const fetchVictims = async () => {
    try {
      const response = await korbanService.getVictims();
      const victimsData = Array.isArray(response) ? response : (response as any).data || [];
      setVictims(victimsData);
    } catch (err) {
      console.error('Failed to load victims:', err);
    }
  };

  const fetchCase = async () => {
    try {
      setLoading(true);
      const caseData = await kasusService.getCaseById(Number(caseId));
      setFormData({
        korban_id: caseData.korban_id.toString(),
        jenis_kasus: caseData.jenis_kasus,
        tanggal_kejadian: caseData.tanggal_kejadian,
        ringkasan_kasus: caseData.ringkasan_kasus || '',
        status_kasus: caseData.status_kasus
      });
    } catch (err: any) {
      setError('Failed to load case data');
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
        ...formData,
        korban_id: Number(formData.korban_id)
      };

      if (isEditing && caseId) {
        await kasusService.updateCase(Number(caseId), submitData);
      } else {
        await kasusService.createCase(submitData);
      }
      onBack();
    } catch (err: any) {
      setError(err.message || 'Failed to save case');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        Kembali ke Manajemen Kasus
      </button>

      <div className="mb-8">
        <h1 className="text-white text-3xl mb-2">
          {isEditing ? 'Sunting Kasus' : 'Tambah Kasus'}
        </h1>
        <p className="text-slate-400">
          {isEditing ? 'Perbarui informasi kasus' : 'Buat kasus forensik baru'}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-2xl">
        {victims.length === 0 && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-2 text-yellow-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="mb-1">Tidak ada korban</p>
              <p className="text-sm text-yellow-400/80">Anda perlu membuat data korban terlebih dahulu sebelum membuat kasus.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="korban_id" className="block text-slate-300 mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              Pilih Korban *
            </label>
            <select
              id="korban_id"
              name="korban_id"
              required
              value={formData.korban_id}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Pilih korban...</option>
              {victims.map(victim => (
                <option key={victim.id} value={victim.id}>
                  {victim.nama} - {victim.lokasi || 'N/A'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="jenis_kasus" className="block text-slate-300 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Jenis Kasus *
            </label>
            <input
              id="jenis_kasus"
              name="jenis_kasus"
              type="text"
              required
              value={formData.jenis_kasus}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Contoh: Peretasan Email, Pencurian Data, Cyberstalking"
            />
          </div>

          <div>
            <label htmlFor="tanggal_kejadian" className="block text-slate-300 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Tanggal Kejadian *
            </label>
            <input
              id="tanggal_kejadian"
              name="tanggal_kejadian"
              type="date"
              required
              value={formData.tanggal_kejadian}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="status_kasus" className="block text-slate-300 mb-2">
              Status Kasus *
            </label>
            <select
              id="status_kasus"
              name="status_kasus"
              required
              value={formData.status_kasus}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="dalam investigasi">Dalam Investigasi</option>
              <option value="selesai">Selesai</option>
              <option value="ditutup">Ditutup</option>
            </select>
          </div>

          <div>
            <label htmlFor="ringkasan_kasus" className="block text-slate-300 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Ringkasan Kasus *
            </label>
            <textarea
              id="ringkasan_kasus"
              name="ringkasan_kasus"
              required
              value={formData.ringkasan_kasus}
              onChange={handleChange}
              rows={6}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Berikan ringkasan detail tentang kasus..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={victims.length === 0 || loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Menyimpan...' : (isEditing ? 'Update Kasus' : 'Buat Kasus')}
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
