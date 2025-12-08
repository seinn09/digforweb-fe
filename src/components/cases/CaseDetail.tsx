import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Calendar, FileText, Edit2, Trash2, User, Package, Activity } from 'lucide-react';

interface CaseDetailProps {
  caseId: string;
  onBack: () => void;
  onEdit: (id: string) => void;
}

export function CaseDetail({ caseId, onBack, onEdit }: CaseDetailProps) {
  const { cases, victims, evidence, forensicActions, deleteCase } = useApp();
  const caseItem = cases.find(c => c.id === caseId);
  const victim = caseItem ? victims.find(v => v.id === caseItem.victimId) : null;
  const relatedEvidence = evidence.filter(e => e.caseId === caseId);
  const relatedActions = forensicActions.filter(a => a.caseId === caseId);

  if (!caseItem) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
          <p className="text-red-400">Case not found</p>
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
    if (window.confirm(`Are you sure you want to delete case "${caseItem.caseType}"? This will also delete all related evidence and forensic actions.`)) {
      deleteCase(caseItem.id);
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
        Back to Cases
      </button>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-white text-3xl mb-2">{caseItem.caseType}</h1>
          <p className="text-slate-400">Case Details</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(caseItem.id)}
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
          <h2 className="text-white text-xl mb-4">Case Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm">Case Type</label>
              <p className="text-white mt-1">{caseItem.caseType}</p>
            </div>
            <div>
              <label className="text-slate-400 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Incident Date
              </label>
              <p className="text-white mt-1">
                {new Date(caseItem.incidentDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <label className="text-slate-400 text-sm">Status</label>
              <p className="mt-1">
                <span className={`px-3 py-1 rounded-full text-sm inline-block ${
                  caseItem.status.toLowerCase() === 'active'
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : caseItem.status.toLowerCase() === 'pending'
                    ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}>
                  {caseItem.status}
                </span>
              </p>
            </div>
            <div>
              <label className="text-slate-400 text-sm flex items-center gap-2">
                <User className="w-4 h-4" />
                Linked Victim
              </label>
              <p className="text-white mt-1">{victim ? victim.name : 'Unknown'}</p>
              {victim && (
                <p className="text-slate-500 text-sm mt-1">{victim.contact}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-white text-xl mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Case Summary
          </h2>
          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
            {caseItem.caseSummary}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-lg">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-white text-xl flex items-center gap-2">
              <Package className="w-5 h-5" />
              Evidence ({relatedEvidence.length})
            </h2>
          </div>
          <div className="divide-y divide-slate-800">
            {relatedEvidence.length > 0 ? (
              relatedEvidence.map((evidenceItem) => (
                <div key={evidenceItem.id} className="p-4 hover:bg-slate-800/30 transition-colors">
                  <h3 className="text-white mb-1">{evidenceItem.evidenceType}</h3>
                  <p className="text-slate-400 text-sm mb-2">{evidenceItem.storageLocation}</p>
                  <p className="text-slate-500 text-xs font-mono">{evidenceItem.hashValue}</p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500">
                No evidence collected yet
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-white text-xl flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Forensic Actions ({relatedActions.length})
            </h2>
          </div>
          <div className="divide-y divide-slate-800">
            {relatedActions.length > 0 ? (
              relatedActions.map((action) => (
                <div key={action.id} className="p-4 hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white">{action.forensicStage}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      action.status.toLowerCase() === 'completed'
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {action.status}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-2">{action.actionDescription}</p>
                  <p className="text-slate-500 text-xs">PIC: {action.pic}</p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500">
                No forensic actions recorded yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
