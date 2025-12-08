import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Phone, Calendar, FileText, Edit2, Trash2, Loader2 } from 'lucide-react';
import { korbanService } from '../../services/korbanService';
import { kasusService } from '../../services/kasusService';
import type { Victim, Case } from '../../types/api';
import { usePermissions } from '../../hooks/usePermissions';

interface VictimDetailProps {
  victimId: string;
  onBack: () => void;
  onEdit: (id: string) => void;
}

export function VictimDetail({ victimId, onBack, onEdit }: VictimDetailProps) {
  const { canUpdate, canDelete } = usePermissions();
  const [victim, setVictim] = useState<Victim | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVictimData();
  }, [victimId]);

  const fetchVictimData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch victim details
      const victimData = await korbanService.getVictimById(Number(victimId));
      setVictim(victimData);

      // Fetch all cases and filter by victim ID
      const allCases = await kasusService.getCases();
      const casesData = Array.isArray(allCases) ? allCases : (allCases as any).data || [];
      const relatedCases = casesData.filter((c: Case) => c.korban_id === Number(victimId));
      setCases(relatedCases);
    } catch (err: any) {
      setError(err.message || 'Failed to load victim data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!victim) return;
    
    if (window.confirm(`Are you sure you want to delete victim "${victim.nama}"? This will also delete all related cases.`)) {
      try {
        await korbanService.deleteVictim(Number(victimId));
        onBack();
      } catch (err: any) {
        alert('Failed to delete victim: ' + err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="ml-3 text-slate-400">Loading victim details...</span>
      </div>
    );
  }

  if (error || !victim) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
          <p className="text-red-400">{error || 'Victim not found'}</p>
          <button
            onClick={onBack}
            className="mt-4 text-blue-400 hover:text-blue-300"
          >
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
        Back to Victims
      </button>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-white text-3xl mb-2">{victim.nama}</h1>
          <p className="text-slate-400">Victim Details</p>
        </div>
        <div className="flex gap-2">
          {canUpdate && (
            <button
              onClick={() => onEdit(victimId)}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-white text-xl mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm">Nama</label>
              <p className="text-white mt-1">{victim.nama}</p>
            </div>
            <div>
              <label className="text-slate-400 text-sm flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Kontak
              </label>
              <p className="text-white mt-1">{victim.kontak || 'N/A'}</p>
            </div>
            <div>
              <label className="text-slate-400 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Lokasi
              </label>
              <p className="text-white mt-1">{victim.lokasi || 'N/A'}</p>
            </div>
            <div>
              <label className="text-slate-400 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Tanggal Laporan
              </label>
              <p className="text-white mt-1">
                {victim.tgl_laporan 
                  ? new Date(victim.tgl_laporan).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-white text-xl mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Deskripsi Laporan
          </h2>
          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
            {victim.deskripsi_laporan || 'Tidak ada deskripsi'}
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-white text-xl">Kasus Terkait ({cases.length})</h2>
        </div>
        <div className="divide-y divide-slate-800">
          {cases.length > 0 ? (
            cases.map((caseItem) => (
              <div key={caseItem.id} className="p-4 hover:bg-slate-800/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white mb-1">{caseItem.jenis_kasus}</h3>
                    <p className="text-slate-400 text-sm">{caseItem.ringkasan_kasus || 'No summary'}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      caseItem.status_kasus.toLowerCase().includes('investigasi')
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}>
                      {caseItem.status_kasus}
                    </span>
                    <span className="text-slate-500 text-sm">
                      {new Date(caseItem.tanggal_kejadian).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500">
              Tidak ada kasus terkait
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
