import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Package, MapPin, Hash, Clock, FileText, Edit2, Trash2 } from 'lucide-react';

interface EvidenceDetailProps {
  evidenceId: string;
  onBack: () => void;
  onEdit: (id: string) => void;
}

export function EvidenceDetail({ evidenceId, onBack, onEdit }: EvidenceDetailProps) {
  const { evidence, cases, deleteEvidence } = useApp();
  const evidenceItem = evidence.find(e => e.id === evidenceId);
  const caseItem = evidenceItem ? cases.find(c => c.id === evidenceItem.caseId) : null;

  if (!evidenceItem) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
          <p className="text-red-400">Evidence not found</p>
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
    if (window.confirm(`Are you sure you want to delete evidence "${evidenceItem.evidenceType}"?`)) {
      deleteEvidence(evidenceItem.id);
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
        Back to Evidence
      </button>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-white text-3xl mb-2">{evidenceItem.evidenceType}</h1>
          <p className="text-slate-400">Evidence Details</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(evidenceItem.id)}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-white text-xl mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Evidence Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm">Evidence Type</label>
              <p className="text-white mt-1">{evidenceItem.evidenceType}</p>
            </div>
            <div>
              <label className="text-slate-400 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Storage Location
              </label>
              <p className="text-white mt-1">{evidenceItem.storageLocation}</p>
            </div>
            <div>
              <label className="text-slate-400 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Collection Time
              </label>
              <p className="text-white mt-1">
                {new Date(evidenceItem.collectionTime).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-white text-xl mb-4 flex items-center gap-2">
            <Hash className="w-5 h-5" />
            Hash Value
          </h2>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <p className="text-green-400 font-mono text-sm break-all">
              {evidenceItem.hashValue}
            </p>
          </div>
          <p className="text-slate-500 text-sm mt-3">
            This hash value ensures the integrity and authenticity of the evidence.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg mt-6">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-white text-xl flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Linked Case
          </h2>
        </div>
        <div className="p-6">
          {caseItem ? (
            <div>
              <h3 className="text-white text-lg mb-2">{caseItem.caseType}</h3>
              <p className="text-slate-400 mb-4">{caseItem.caseSummary}</p>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  caseItem.status.toLowerCase() === 'active'
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : caseItem.status.toLowerCase() === 'pending'
                    ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}>
                  {caseItem.status}
                </span>
                <span className="text-slate-500 text-sm">
                  Incident: {new Date(caseItem.incidentDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-slate-500">No linked case found</p>
          )}
        </div>
      </div>
    </div>
  );
}
