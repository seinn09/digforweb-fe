import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Eye, Edit2, Trash2, Package, Hash } from 'lucide-react';

interface EvidenceListProps {
  onViewDetail: (id: string) => void;
  onEdit: (id: string) => void;
  onCreate: () => void;
}

export function EvidenceList({ onViewDetail, onEdit, onCreate }: EvidenceListProps) {
  const { evidence, cases, deleteEvidence } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvidence = evidence.filter(item =>
    item.evidenceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.storageLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCaseType = (caseId: string) => {
    const caseItem = cases.find(c => c.id === caseId);
    return caseItem ? caseItem.caseType : 'Unknown';
  };

  const handleDelete = (id: string, evidenceType: string) => {
    if (window.confirm(`Are you sure you want to delete evidence "${evidenceType}"?`)) {
      deleteEvidence(id);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-white text-3xl mb-2">Evidence Management</h1>
          <p className="text-slate-400">Track and manage digital evidence</p>
        </div>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Evidence
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg">
        <div className="p-4 border-b border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by evidence type or location..."
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
                <th className="px-6 py-3 text-left text-slate-400 text-sm">Evidence Type</th>
                <th className="px-6 py-3 text-left text-slate-400 text-sm">Storage Location</th>
                <th className="px-6 py-3 text-left text-slate-400 text-sm">Hash Value</th>
                <th className="px-6 py-3 text-left text-slate-400 text-sm">Linked Case</th>
                <th className="px-6 py-3 text-right text-slate-400 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredEvidence.length > 0 ? (
                filteredEvidence.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-purple-400" />
                        <span className="text-white">{item.evidenceType}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-300 text-sm">{item.storageLocation}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-400 text-xs font-mono">
                          {item.hashValue.substring(0, 16)}...
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-300">{getCaseType(item.caseId)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewDetail(item.id)}
                          className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(item.id)}
                          className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.evidenceType)}
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
                    {searchTerm ? 'No evidence found matching your search' : 'No evidence yet. Click "Add Evidence" to create one.'}
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
