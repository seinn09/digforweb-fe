import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, User, FileText, CheckCircle, Edit2, Trash2, Loader2 } from 'lucide-react';
import { tindakanService } from '../../services/tindakanService';
import type { ForensicAction } from '../../types/api';
import { usePermissions } from '../../hooks/usePermissions';

interface ActionDetailProps {
  actionId: string;
  onBack: () => void;
  onEdit: (id: string) => void;
}

export function ActionDetail({ actionId, onBack, onEdit }: ActionDetailProps) {
  const { canUpdate, canDelete } = usePermissions();
  const [action, setAction] = useState<ForensicAction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAction();
  }, [actionId]);

  const fetchAction = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await tindakanService.getActionById(Number(actionId));
      setAction(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load action data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!action) return;
    
    if (window.confirm(`Are you sure you want to delete action "${action.tahap_forensik}"?`)) {
      try {
        await tindakanService.deleteAction(Number(actionId));
        onBack();
      } catch (err: any) {
        alert('Failed to delete action: ' + err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="ml-3 text-slate-400">Loading action details...</span>
      </div>
    );
  }

  if (error || !action) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
          <p className="text-red-400">{error || 'Forensic action not found'}</p>
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
        Back to Actions
      </button>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-white text-3xl mb-2 capitalize">{action.tahap_forensik}</h1>
          <p className="text-slate-400">Forensic Action Details</p>
        </div>
        <div className="flex gap-2">
          {canUpdate && (
            <button
              onClick={() => onEdit(actionId)}
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
          <h2 className="text-white text-xl mb-4">Action Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm">Tahap Forensik</label>
              <p className="text-white mt-1 capitalize">{action.tahap_forensik}</p>
            </div>
            <div>
              <label className="text-slate-400 text-sm flex items-center gap-2">
                <User className="w-4 h-4" />
                PIC (Person In Charge)
              </label>
              <p className="text-white mt-1">{action.pic || 'N/A'}</p>
            </div>
            {action.waktu_pelaksanaan && (
              <div>
                <label className="text-slate-400 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Waktu Pelaksanaan
                </label>
                <p className="text-white mt-1">
                  {new Date(action.waktu_pelaksanaan).toLocaleString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            )}
            <div>
              <label className="text-slate-400 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Status
              </label>
              <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm ${
                action.status_tindakan.toLowerCase() === 'completed'
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              }`}>
                {action.status_tindakan}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-white text-xl mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Deskripsi Tindakan
          </h2>
          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
            {action.desk_tindakan || 'Tidak ada deskripsi'}
          </p>
        </div>
      </div>
    </div>
  );
}
