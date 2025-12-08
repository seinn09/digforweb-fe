import { useState } from 'react';
import { EvidenceItem, Case } from '../App';
import { Search, Plus, Eye, Edit, Package, MapPin, Hash, Briefcase } from 'lucide-react';

type EvidenceProps = {
  evidence: EvidenceItem[];
  cases: Case[];
  onNavigate: (view: string, id?: string) => void;
};

export function Evidence({ evidence, cases, onNavigate }: EvidenceProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvidence = evidence.filter(item => {
    const caseItem = cases.find(c => c.id === item.caseId);
    return (
      item.evidenceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.storageLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.hashValue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem?.caseType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCaseType = (caseId: string) => {
    const caseItem = cases.find(c => c.id === caseId);
    return caseItem?.caseType || 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-cyan-400 mb-2">Evidence Management</h2>
          <p className="text-slate-400">Track and manage forensic evidence</p>
        </div>
        <button
          onClick={() => onNavigate('evidence-create')}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Evidence
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by evidence type, location, or hash..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-11 pr-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-slate-400 pb-4 pr-4">Evidence Type</th>
                <th className="text-left text-slate-400 pb-4 pr-4">Storage Location</th>
                <th className="text-left text-slate-400 pb-4 pr-4">Hash Value</th>
                <th className="text-left text-slate-400 pb-4 pr-4">Linked Case</th>
                <th className="text-right text-slate-400 pb-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvidence.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-slate-500 py-8">
                    No evidence found
                  </td>
                </tr>
              ) : (
                filteredEvidence.map((item) => (
                  <tr key={item.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-950 flex items-center justify-center">
                          <Package className="w-5 h-5 text-blue-400" />
                        </div>
                        <span>{item.evidenceType}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        {item.storageLocation}
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Hash className="w-4 h-4 text-slate-500" />
                        <span className="font-mono text-sm">
                          {item.hashValue.substring(0, 20)}...
                        </span>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Briefcase className="w-4 h-4 text-slate-500" />
                        {getCaseType(item.caseId)}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onNavigate('evidence-detail', item.id)}
                          className="p-2 text-cyan-400 hover:bg-slate-700 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => onNavigate('evidence-edit', item.id)}
                          className="p-2 text-blue-400 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
