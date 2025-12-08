import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, MapPin, Phone, Calendar, FileText, Edit2, Trash2 } from 'lucide-react';

interface VictimDetailProps {
  victimId: string;
  onBack: () => void;
  onEdit: (id: string) => void;
}

export function VictimDetail({ victimId, onBack, onEdit }: VictimDetailProps) {
  const { victims, cases, deleteVictim } = useApp();
  const victim = victims.find(v => v.id === victimId);
  const relatedCases = cases.filter(c => c.victimId === victimId);

  if (!victim) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
          <p className="text-red-400">Victim not found</p>
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

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete victim "${victim.name}"? This will also delete all related cases.`)) {
      deleteVictim(victim.id);
      onBack();
    }
  };

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
          <h1 className="text-white text-3xl mb-2">{victim.name}</h1>
          <p className="text-slate-400">Victim Details</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(victim.id)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-white text-xl mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm">Name</label>
              <p className="text-white mt-1">{victim.name}</p>
            </div>
            <div>
              <label className="text-slate-400 text-sm flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Contact
              </label>
              <p className="text-white mt-1">{victim.contact}</p>
            </div>
            <div>
              <label className="text-slate-400 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </label>
              <p className="text-white mt-1">{victim.location}</p>
            </div>
            <div>
              <label className="text-slate-400 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Report Date
              </label>
              <p className="text-white mt-1">
                {new Date(victim.reportDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-white text-xl mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Report Description
          </h2>
          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
            {victim.reportDescription}
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-white text-xl">Related Cases ({relatedCases.length})</h2>
        </div>
        <div className="divide-y divide-slate-800">
          {relatedCases.length > 0 ? (
            relatedCases.map((caseItem) => (
              <div key={caseItem.id} className="p-4 hover:bg-slate-800/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white mb-1">{caseItem.caseType}</h3>
                    <p className="text-slate-400 text-sm">{caseItem.caseSummary}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      caseItem.status.toLowerCase() === 'active'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}>
                      {caseItem.status}
                    </span>
                    <span className="text-slate-500 text-sm">
                      {new Date(caseItem.incidentDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500">
              No related cases found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
