import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, FileText, Calendar, User, Clock, AlertCircle } from 'lucide-react';
import { tindakanService } from '../../services/tindakanService';
import { kasusService } from '../../services/kasusService';
import type { Case } from '../../types/api';

interface ActionFormProps {
  actionId?: string;
  onBack: () => void;
}

export function ActionForm({ actionId, onBack }: ActionFormProps) {
  const isEditing = !!actionId;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cases, setCases] = useState<Case[]>([]);

  const [formData, setFormData] = useState({
    case_id: '',
    tahap_forensik: '',
    desk_tindakan: '',
    waktu_pelaksanaan: '',
    pic: '',
    status_tindakan: 'pending'
  });

  useEffect(() => {
    fetchCases();
    if (isEditing && actionId) {
      fetchAction();
    }
  }, [actionId, isEditing]);

  const fetchCases = async () => {
    try {
      const response = await kasusService.getCases();
      const casesData = Array.isArray(response) ? response : (response as any).data || [];
      setCases(casesData);
    } catch (err) {
      console.error('Failed to load cases:', err);
    }
  };

  const fetchAction = async () => {
    try {
      setLoading(true);
      const actionData = await tindakanService.getActionById(Number(actionId));
      setFormData({
        case_id: actionData.case_id.toString(),
        tahap_forensik: actionData.tahap_forensik,
        desk_tindakan: actionData.desk_tindakan || '',
        waktu_pelaksanaan: actionData.waktu_pelaksanaan 
          ? actionData.waktu_pelaksanaan.slice(0, 16) // Format for datetime-local
          : '',
        pic: actionData.pic || '',
        status_tindakan: actionData.status_tindakan
      });
    } catch (err: any) {
      setError('Failed to load action data');
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
        tahap_forensik: formData.tahap_forensik,
        desk_tindakan: formData.desk_tindakan || undefined,
        waktu_pelaksanaan: formData.waktu_pelaksanaan || undefined,
        pic: formData.pic || undefined,
        status_tindakan: formData.status_tindakan
      };

      if (isEditing && actionId) {
        await tindakanService.updateAction(Number(actionId), submitData);
      } else {
        await tindakanService.createAction(submitData);
      }
      onBack();
    } catch (err: any) {
      setError(err.message || 'Failed to save action');
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
        Kembali ke Manajemen Tindakan Forensik
      </button>

      <div className="mb-8">
        <h1 className="text-white text-3xl mb-2">
          {isEditing ? 'Sunting Tindakan Forensik' : 'Tambah Tindakan Forensik'}
        </h1>
        <p className="text-slate-400">
          {isEditing ? 'Perbarui informasi tindakan forensik' : 'Buat data tindakan forensik baru'}
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
              <p className="text-sm text-yellow-400/80">Anda perlu membuat kasus terlebih dahulu sebelum menambah tindakan forensik.</p>
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
            <label htmlFor="tahap_forensik" className="block text-slate-300 mb-2">
              Tahap Forensik *
            </label>
            <select
              id="tahap_forensik"
              name="tahap_forensik"
              required
              value={formData.tahap_forensik}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Pilih tahap...</option>
              <option value="identification">Identification (Identifikasi)</option>
              <option value="preservation">Preservation (Preservasi)</option>
              <option value="collection">Collection (Pengumpulan)</option>
              <option value="examination">Examination (Pemeriksaan)</option>
              <option value="analysis">Analysis (Analisis)</option>
              <option value="presentation">Presentation (Presentasi)</option>
            </select>
          </div>

          <div>
            <label htmlFor="pic" className="block text-slate-300 mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              PIC (Person In Charge)
            </label>
            <input
              id="pic"
              name="pic"
              type="text"
              value={formData.pic}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nama petugas yang bertanggung jawab"
            />
          </div>

          <div>
            <label htmlFor="waktu_pelaksanaan" className="block text-slate-300 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Waktu Pelaksanaan
            </label>
            <input
              id="waktu_pelaksanaan"
              name="waktu_pelaksanaan"
              type="datetime-local"
              value={formData.waktu_pelaksanaan}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="status_tindakan" className="block text-slate-300 mb-2">
              Status Tindakan *
            </label>
            <select
              id="status_tindakan"
              name="status_tindakan"
              required
              value={formData.status_tindakan}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label htmlFor="desk_tindakan" className="block text-slate-300 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Deskripsi Tindakan
            </label>
            <textarea
              id="desk_tindakan"
              name="desk_tindakan"
              value={formData.desk_tindakan}
              onChange={handleChange}
              rows={6}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Jelaskan detail tindakan yang dilakukan..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={cases.length === 0 || loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Menyimpan...' : (isEditing ? 'Update Tindakan' : 'Buat Tindakan')}
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
