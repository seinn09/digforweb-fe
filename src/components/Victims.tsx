import { useState } from 'react';
import { Victim } from '../App';
import { Search, Plus, Eye, Edit, MapPin, Phone, Calendar } from 'lucide-react';

type VictimsProps = {
  victims: Victim[];
  onNavigate: (view: string, id?: string) => void;
};

export function Victims({ victims, onNavigate }: VictimsProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVictims = victims.filter(victim =>
    victim.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    victim.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-cyan-400 mb-2">Victim Management</h2>
          <p className="text-slate-400">Manage victim records and information</p>
        </div>
        <button
          onClick={() => onNavigate('victim-create')}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Victim
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
              placeholder="Search by name or location..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-11 pr-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-slate-400 pb-4 pr-4">Name</th>
                <th className="text-left text-slate-400 pb-4 pr-4">Contact</th>
                <th className="text-left text-slate-400 pb-4 pr-4">Location</th>
                <th className="text-left text-slate-400 pb-4 pr-4">Report Date</th>
                <th className="text-right text-slate-400 pb-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVictims.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-slate-500 py-8">
                    No victims found
                  </td>
                </tr>
              ) : (
                filteredVictims.map((victim) => (
                  <tr key={victim.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cyan-950 flex items-center justify-center">
                          <span className="text-cyan-400">{victim.name.charAt(0)}</span>
                        </div>
                        <span>{victim.name}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Phone className="w-4 h-4 text-slate-500" />
                        {victim.contact}
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        {victim.location}
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        {formatDate(victim.reportDate)}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onNavigate('victim-detail', victim.id)}
                          className="p-2 text-cyan-400 hover:bg-slate-700 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => onNavigate('victim-edit', victim.id)}
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
