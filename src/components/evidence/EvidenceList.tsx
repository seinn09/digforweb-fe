import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit2, Trash2, Package, Hash, Calendar, Loader2 } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { ReadOnlyBanner } from '../ReadOnlyBanner';
import { evidenceService } from '../../services/evidenceService';
import type { Evidence } from '../../types/api';

interface EvidenceListProps {
  onViewDetail: (id: string) => void;
  onEdit: (id: string) => void;
  onCreate: () => void;
}

export function EvidenceList({ onViewDetail, onEdit, onCreate }: EvidenceListProps) {
  const { canCreate, canUpdate, canDelete, isViewer } = usePermissions();
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvidence();
  }, []);

  const fetchEvidence = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await evidenceService.getEvidence();
      
      let evidenceData: Evidence[];
      if (Array.isArray(response)) {
        evidenceData = response;
      } else if (response && typeof response === 'object' && 'data' in response) {
        evidenceData = Array.isArray((response as any).data) ? (response as any).data : [];
      } else {
        evidenceData = [];
      }
      
      console.log('Fetched evidence:', evidenceData);
      setEvidence(evidenceData);
    } catch (err: any) {
      setError(err.message || 'Failed to load evidence');
      console.error('Error fetching evidence:', err);
      setEvidence([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvidence = evidence.filter(item =>
    item.jenis_bukti.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.lokasi_penyimpanan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number, jenis_bukti: string) => {
    if (window.confirm(`Are you sure you want to delete evidence "${jenis_bukti}"?`)) {
      try {
        await evidenceService.deleteEvidence(id);
        setEvidence(evidence.filter(e => e.id !== id));
      } catch (err: any) {
        alert('Failed to delete evidence: ' + err.message);
      }
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-white text-3xl mb-2">Manajemen Bukti</h1>
          <p className="text-slate-400">
            {isViewer
              ? 'Disini Anda dapat melihat data dan informasi bukti'
              : 'Disini Anda dapat mengelola data dan informasi bukti'}
          </p>  
        </div>
        {canCreate && (
          <button
            onClick={onCreate}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Tambah Bukti
          </button>
        )}
      </div>

      {isViewer && <ReadOnlyBanner />}

      <div className="bg-slate-900 border border-slate-800 rounded-lg">
        <div className="p-4 border-b border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by evidence type or storage location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="ml-3 text-slate-400">Loading evidence...</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg m-4">
            <p className="text-red-400">{error}</p>
            <button
              onClick={fetchEvidence}
              className="mt-2 text-sm text-blue-400 hover:text-blue-300"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-slate-400 text-sm">Jenis Bukti</th>
                  <th className="px-6 py-3 text-left text-slate-400 text-sm">Lokasi Penyimpanan</th>
                  <th className="px-6 py-3 text-left text-slate-400 text-sm">Hash Value</th>
                  <th className="px-6 py-3 text-left text-slate-400 text-sm">Waktu Pengambilan</th>
                  <th className="px-6 py-3 text-right text-slate-400 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredEvidence.length > 0 ? (
                  filteredEvidence.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-white">
                          <Package className="w-4 h-4 text-blue-400" />
                          {item.jenis_bukti}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-300 text-sm font-mono">
                          {item.lokasi_penyimpanan}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Hash className="w-4 h-4" />
                          <span className="text-xs font-mono">
                            {item.hash_value ? `${item.hash_value.substring(0, 12)}...` : 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          {item.waktu_pengambilan_bukti 
                            ? new Date(item.waktu_pengambilan_bukti).toLocaleString()
                            : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onViewDetail(item.id.toString())}
                            className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {canUpdate && (
                            <button
                              onClick={() => onEdit(item.id.toString())}
                              className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(item.id, item.jenis_bukti)}
                              className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      {searchTerm ? 'No evidence found matching your search' : 'No evidence yet. Click "Add Evidence" to create one.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
