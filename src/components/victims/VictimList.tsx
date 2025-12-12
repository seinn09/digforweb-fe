import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit2, Trash2, MapPin, Phone, Calendar, Loader2 } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { ReadOnlyBanner } from '../ReadOnlyBanner';
import { korbanService } from '../../services/korbanService';
import type { Victim } from '../../types/api';

interface VictimListProps {
  onViewDetail: (id: number) => void;
  onEdit: (id: number) => void;
  onCreate: () => void;
}

export function VictimList({ onViewDetail, onEdit, onCreate }: VictimListProps) {
  const { canCreate, canUpdate, canDelete, isViewer } = usePermissions();
  const [victims, setVictims] = useState<Victim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVictims();
  }, []);

  const fetchVictims = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await korbanService.getVictims();
      
      // Handle different response formats
      let victimsData: Victim[];
      if (Array.isArray(response)) {
        victimsData = response;
      } else if (response && typeof response === 'object' && 'data' in response) {
        // Handle wrapped response: { data: [...] }
        victimsData = Array.isArray((response as any).data) ? (response as any).data : [];
      } else {
        victimsData = [];
      }
      
      console.log('Fetched victims:', victimsData);
      setVictims(victimsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load victims');
      console.error('Error fetching victims:', err);
      setVictims([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const filteredVictims = victims.filter(victim =>
    victim.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number, nama: string) => {
    if (window.confirm(`Are you sure you want to delete victim "${nama}"? This will also delete all related cases.`)) {
      try {
        await korbanService.deleteVictim(id);
        setVictims(victims.filter(v => v.id !== id));
      } catch (err: any) {
        alert('Failed to delete victim: ' + err.message);
      }
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-white text-3xl mb-2">Manajemen Korban</h1>
          <p className="text-slate-400">
            {isViewer
              ? 'Disini Anda dapat melihat data dan informasi korban'
              : 'Disini Anda dapat mengelola data dan informasi korban'}
          </p>
        </div>
        {canCreate && (
          <button
            onClick={onCreate}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Tambah Korban
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
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="ml-3 text-slate-400">Loading victims...</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400">{error}</p>
            <button
              onClick={fetchVictims}
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
                <th className="px-6 py-3 text-left text-slate-400 text-sm">Nama</th>
                <th className="px-6 py-3 text-left text-slate-400 text-sm">Kontak</th>
                <th className="px-6 py-3 text-left text-slate-400 text-sm">Lokasi</th>
                <th className="px-6 py-3 text-left text-slate-400 text-sm">Tanggal Laporan</th>
                <th className="px-6 py-3 text-right text-slate-400 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredVictims.length > 0 ? (
                filteredVictims.map((victim) => (
                  <tr key={victim.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                          <span className="text-blue-400">
                            {victim.nama.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-white">{victim.nama}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Phone className="w-4 h-4 text-slate-500" />
                        {victim.kontak || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        {victim.lokasi || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        {victim.tgl_laporan ? new Date(victim.tgl_laporan).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewDetail(victim.id)}
                          className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {canUpdate && (
                          <button
                            onClick={() => onEdit(victim.id)}
                            className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(victim.id as number, victim.nama)}
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
                    {searchTerm ? 'No victims found matching your search' : 'No victims yet. Click "Add Victim" to create one.'}
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
