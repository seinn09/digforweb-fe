import { useState } from 'react';
import { Case, Victim } from '../App';
import { Search, Plus, Eye, Edit, Calendar, User, AlertCircle } from 'lucide-react';

type CasesProps = {
  cases: Case[];
  victims: Victim[];
  onNavigate: (view: string, id?: string) => void;
};

export function Cases({ cases, victims, onNavigate }: CasesProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCases = cases.filter(caseItem => {
    const victim = victims.find(v => v.id === caseItem.victimId);
    return (
      caseItem.caseType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.caseStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
      victim?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getVictimName = (victimId: string) => {
    const victim = victims.find(v => v.id === victimId);
    return victim?.name || 'Unknown';
  };

  const getStatusColor = (status: string) => {
    const lower = status.toLowerCase();
    if (lower === 'active') return 'text-green-400 bg-green-950/50';
    if (lower === 'closed') return 'text-slate-400 bg-slate-800/50';
    if (lower === 'pending') return 'text-yellow-400 bg-yellow-950/50';
    return 'text-blue-400 bg-blue-950/50';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-cyan-400 mb-2">Case Management</h2>
          <p className="text-slate-400">Track and manage forensic cases</p>
        </div>
        <button
          onClick={() => onNavigate('case-create')}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Case
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
              placeholder="Search by case type, status, or victim..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-11 pr-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-slate-400 pb-4 pr-4">Case Type</th>
                <th className="text-left text-slate-400 pb-4 pr-4">Victim</th>
                <th className="text-left text-slate-400 pb-4 pr-4">Incident Date</th>
                <th className="text-left text-slate-400 pb-4 pr-4">Status</th>
                <th className="text-right text-slate-400 pb-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-slate-500 py-8">
                    No cases found
                  </td>
                </tr>
              ) : (
                filteredCases.map((caseItem) => (
                  <tr key={caseItem.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cyan-950 flex items-center justify-center">
                          <AlertCircle className="w-5 h-5 text-cyan-400" />
                        </div>
                        <span>{caseItem.caseType}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <User className="w-4 h-4 text-slate-500" />
                        {getVictimName(caseItem.victimId)}
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        {formatDate(caseItem.incidentDate)}
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(caseItem.caseStatus)}`}>
                        {caseItem.caseStatus}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onNavigate('case-detail', caseItem.id)}
                          className="p-2 text-cyan-400 hover:bg-slate-700 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => onNavigate('case-edit', caseItem.id)}
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
