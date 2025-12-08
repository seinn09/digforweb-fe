import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, Hash, Calendar, MapPin, Edit2, Trash2, Loader2 } from 'lucide-react';
import { evidenceService } from '../../services/evidenceService';
import type { Evidence } from '../../types/api';
import { usePermissions } from '../../hooks/usePermissions';

interface EvidenceDetailProps {
  evidenceId: string;
  onBack: () => void;
  onEdit: (id: string) => void;
}

export function EvidenceDetail({ evidenceId, onBack, onEdit }: EvidenceDetailProps) {
  const { canUpdate, canDelete } = usePermissions();
  const [evidence, setEvidence] = useState<Evidence | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvidence();
  }, [evidenceId]);

  const fetchEvidence = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await evidenceService.getEvidenceById(Number(evidenceId));
      setEvidence(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load evidence data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!evidence) return;
    
    if (window.confirm(`Are you sure you want to delete evidence "${evidence.jenis_bukti}"?`)) {
      try {
        await evidenceService.deleteEvidence(Number(evidenceId));
        onBack();
      } catch (err: any) {
        alert('Failed to delete evidence: ' + err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="ml-3 text-slate-400">Loading evidence details...</span>
      </div>
    );
  }

  if (error || !evidence) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
          <p className="text-red-400">{error || 'Evidence not found'}</p>
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
        Back to Evidence
      </button>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-white text-3xl mb-2">{evidence.jenis_bukti}</h1>
          <p className="text-slate-400">Evidence Details</p>
        </div>
        <div className="flex gap-2">
          {canUpdate && (
            <button
              onClick={() => onEdit(evidenceId)}
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

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-3xl">
        <h2 className="text-white text-xl mb-6">Evidence Information</h2>
        <div className="space-y-6">
          <div>
            <label className="text-slate-400 text-sm flex items-center gap-2">
              <Package className="w-4 h-4" />
              Jenis Bukti
            </label>
            <p className="text-white mt-1 text-lg">{evidence.jenis_bukti}</p>
          </div>

          <div>
            <label className="text-slate-400 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Lokasi Penyimpanan
            </label>
            <p className="text-white mt-1 font-mono text-sm bg-slate-800 px-3 py-2 rounded">
              {evidence.lokasi_penyimpanan}
            </p>
          </div>

          {evidence.hash_value && (
            <div>
              <label className="text-slate-400 text-sm flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Hash Value
              </label>
              <p className="text-white mt-1 font-mono text-xs bg-slate-800 px-3 py-2 rounded break-all">
                {evidence.hash_value}
              </p>
            </div>
          )}

          {evidence.waktu_pengambilan_bukti && (
            <div>
              <label className="text-slate-400 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Waktu Pengambilan Bukti
              </label>
              <p className="text-white mt-1">
                {new Date(evidence.waktu_pengambilan_bukti).toLocaleString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
