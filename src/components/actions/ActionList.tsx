import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit2, Trash2, Clock, User, CheckCircle, Loader2 } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { ReadOnlyBanner } from '../ReadOnlyBanner';
import { tindakanService } from '../../services/tindakanService';
import type { ForensicAction } from '../../types/api';

interface ActionListProps {
  onViewDetail: (id: string) => void;
  onEdit: (id: string) => void;
  onCreate: () => void;
}

export function ActionList({ onViewDetail, onEdit, onCreate }: ActionListProps) {
  const { canCreate, canUpdate, canDelete, isViewer } = usePermissions();
  const [actions, setActions] = useState<ForensicAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchActions();
  }, []);

  const fetchActions = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await tindakanService.getActions();
      
      let actionsData: ForensicAction[];
      if (Array.isArray(response)) {
        actionsData = response;
      } else if (response && typeof response === 'object' && 'data' in response) {
        actionsData = Array.isArray((response as any).data) ? (response as any).data : [];
      } else {
        actionsData = [];
      }
      
      console.log('Fetched actions:', actionsData);
      setActions(actionsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load forensic actions');
      console.error('Error fetching actions:', err);
      setActions([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredActions = actions.filter(action =>
    action.tahap_forensik.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (action.pic && action.pic.toLowerCase().includes(searchTerm.toLowerCase())) ||
    action.status_tindakan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number, tahap_forensik: string) => {
    if (window.confirm(`Are you sure you want to delete action "${tahap_forensik}"?`)) {
      try {
        await tindakanService.deleteAction(id);
        setActions(actions.filter(a => a.id !== id));
      } catch (err: any) {
        alert('Failed to delete action: ' + err.message);
      }
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-white text-3xl mb-2">Forensic Actions</h1>
          <p className="text-slate-400">Track forensic investigation actions and progress</p>
        </div>
        {canCreate && (
          <button
            onClick={onCreate}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Action
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
              placeholder="Search by forensic stage, PIC, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="ml-3 text-slate-400">Loading forensic actions...</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg m-4">
            <p className="text-red-400">{error}</p>
            <button
              onClick={fetchActions}
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
                  <th className="px-6 py-3 text-left text-slate-400 text-sm">Tahap Forensik</th>
                  <th className="px-6 py-3 text-left text-slate-400 text-sm">PIC</th>
                  <th className="px-6 py-3 text-left text-slate-400 text-sm">Waktu Pelaksanaan</th>
                  <th className="px-6 py-3 text-left text-slate-400 text-sm">Status</th>
                  <th className="px-6 py-3 text-right text-slate-400 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredActions.length > 0 ? (
                  filteredActions.map((action) => (
                    <tr key={action.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-white capitalize">{action.tahap_forensik}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-300">
                          <User className="w-4 h-4 text-slate-500" />
                          {action.pic || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Clock className="w-4 h-4 text-slate-500" />
                          {action.waktu_pelaksanaan 
                            ? new Date(action.waktu_pelaksanaan).toLocaleString()
                            : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 w-fit ${
                          action.status_tindakan.toLowerCase() === 'completed'
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : action.status_tindakan.toLowerCase() === 'in-progress' || action.status_tindakan.toLowerCase().includes('progress')
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        }`}>
                          {action.status_tindakan.toLowerCase() === 'completed' && (
                            <CheckCircle className="w-3 h-3" />
                          )}
                          {action.status_tindakan}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onViewDetail(action.id.toString())}
                            className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {canUpdate && (
                            <button
                              onClick={() => onEdit(action.id.toString())}
                              className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(action.id, action.tahap_forensik)}
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
                      {searchTerm ? 'No actions found matching your search' : 'No forensic actions yet. Click "Add Action" to create one.'}
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
