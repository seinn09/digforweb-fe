import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Eye, Edit2, Trash2, MapPin, Phone, Calendar } from 'lucide-react';

interface VictimListProps {
  onViewDetail: (id: string) => void;
  onEdit: (id: string) => void;
  onCreate: () => void;
}

export function VictimList({ onViewDetail, onEdit, onCreate }: VictimListProps) {
  const { victims, deleteVictim } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVictims = victims.filter(victim =>
    victim.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete victim "${name}"? This will also delete all related cases.`)) {
      deleteVictim(id);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-white text-3xl mb-2">Victim Management</h1>
          <p className="text-slate-400">Manage victim records and information</p>
        </div>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Victim
        </button>
      </div>

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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-slate-400 text-sm">Name</th>
                <th className="px-6 py-3 text-left text-slate-400 text-sm">Contact</th>
                <th className="px-6 py-3 text-left text-slate-400 text-sm">Location</th>
                <th className="px-6 py-3 text-left text-slate-400 text-sm">Report Date</th>
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
                            {victim.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-white">{victim.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Phone className="w-4 h-4 text-slate-500" />
                        {victim.contact}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        {victim.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        {new Date(victim.reportDate).toLocaleDateString()}
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
                        <button
                          onClick={() => onEdit(victim.id)}
                          className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(victim.id, victim.name)}
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
                    {searchTerm ? 'No victims found matching your search' : 'No victims yet. Click "Add Victim" to create one.'}
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
