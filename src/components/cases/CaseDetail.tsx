import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, User, FileText, Edit2, Trash2, Loader2 } from 'lucide-react';
import { kasusService } from '../../services/kasusService';
import type { Case } from '../../types/api';
import { usePermissions } from '../../hooks/usePermissions';

interface CaseDetailProps {
  caseId: string;
  onBack: () => void;
  onEdit: (id: string) => void;
}

export function CaseDetail({ caseId, onBack, onEdit }: CaseDetailProps) {
  const { canUpdate, canDelete } = usePermissions();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCase();
  }, [caseId]);

  const fetchCase = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await kasusService.getCaseById(Number(caseId));
      setCaseData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load case data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!caseData) return;
    
    if (window.confirm(`Are you sure you want to delete case "${caseData.jenis_kasus}"?`)) {
      try {
        await kasusService.deleteCase(Number(caseId));
        onBack();
      } catch (err: any) {
        alert('Failed to delete case: ' + err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="ml-3 text-slate-400">Loading case details...</span>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
          <p className="text-red-400">{error || 'Case not found'}</p>
          <button onClick={onBack} className="mt-4 text-blue-400 hover:text-blue-300">
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Cases
      </button>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-white text-3xl mb-2">{caseData.jenis_kasus}</h1>
          <p className="text-slate-400">Case Details</p>
        </div>
        <div className="flex gap-2">
          {canUpdate && (
            <button
              onClick={() => onEdit(caseId)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          )}
          {canDelete && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-white text-xl mb-4">Case Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm">Jenis Kasus</label>
              <p className="text-white mt-1">{caseData.jenis_kasus}</p>
            </div>
            <div>
              <label className="text-slate-400 text-sm flex items-center gap-2">
                <User className="w-4 h-4" />
                Korban
              </label>
              <p className="text-white mt-1">{caseData.korban?.nama || 'N/A'}</p>
            </div>
            <div>
              <label className="text-slate-400 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Tanggal Kejadian
              </label>
              <p className="text-white mt-1">
                {new Date(caseData.tanggal_kejadian).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <label className="text-slate-400 text-sm">Status</label>
              <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm ${
                caseData.status_kasus.toLowerCase().includes('investigasi')
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
              }`}>
                {caseData.status_kasus}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-white text-xl mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Ringkasan Kasus
          </h2>
          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
            {caseData.ringkasan_kasus || 'Tidak ada ringkasan'}
          </p>
        </div>
      </div>
    </div>
  );
}
