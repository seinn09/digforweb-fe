import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Eye, Edit2, Trash2, Activity, User } from 'lucide-react';

interface ActionListProps {
  onViewDetail: (id: string) => void;
  onEdit: (id: string) => void;
  onCreate: () => void;
}

export function ActionList({ onViewDetail, onEdit, onCreate }: ActionListProps) {
  const { forensicActions, cases, deleteForensicAction } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredActions = forensicActions.filter(action =>
    action.forensicStage.toLowerCase().includes(searchTerm.toLowerCase()) ||
    action.pic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    action.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCaseType = (caseId: string) => {
    const caseItem = cases.find(c => c.id === caseId);
    return caseItem ? caseItem.caseType : 'Unknown';
  };

  const handleDelete = (id: string, stage: string) => {
    if (window.confirm(`Are you sure you want to delete forensic action "${stage}"?`)) {
      deleteForensicAction(id);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-white text-3xl mb-2">Forensic Actions</h1>
          <p className="text-slate-400">Track forensic investigation stages and activities</p>
        </div>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Action
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg">
        <div className="p-4 border-b border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by stage, PIC, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-slate-400 text-sm">Forensic Stage</th>
                <th className="px-6 py-3 text-left text-slate-400 text-sm">PIC</th>
                <th className="px-6 py-3 text-left text-slate-400 text-sm">Status</th>
                <th className="px-6 py-3 text-left text-slate-400 text-sm">Linked Case</th>
                <th className="px-6 py-3 text-right text-slate-400 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredActions.length > 0 ? (
                filteredActions.map((action) => (
                  <tr key={action.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-cyan-400" />
                        <span className="text-white">{action.forensicStage}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <User className="w-4 h-4 text-slate-500" />
                        {action.pic}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        action.status.toLowerCase() === 'completed'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}>
                        {action.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-300">{getCaseType(action.caseId)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewDetail(action.id)}
                          className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(action.id)}
                          className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(action.id, action.forensicStage)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
      </div>
    </div>
  );
}
