import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Activity, User, Clock, FileText, Edit2, Trash2 } from 'lucide-react';

interface ActionDetailProps {
  actionId: string;
  onBack: () => void;
  onEdit: (id: string) => void;
}

export function ActionDetail({ actionId, onBack, onEdit }: ActionDetailProps) {
  const { forensicActions, cases, deleteForensicAction } = useApp();
  const action = forensicActions.find(a => a.id === actionId);
  const caseItem = action ? cases.find(c => c.id === action.caseId) : null;

  if (!action) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
          <p className="text-red-400">Forensic action not found</p>
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
    if (window.confirm(`Are you sure you want to delete forensic action "${action.forensicStage}"?`)) {
      deleteForensicAction(action.id);
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
        Back to Forensic Actions
      </button>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-white text-3xl mb-2">{action.forensicStage}</h1>
          <p className="text-slate-400">Forensic Action Details</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(action.id)}
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
          <h2 className="text-white text-xl mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Action Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm">Forensic Stage</label>
              <p className="text-white mt-1">{action.forensicStage}</p>
            </div>
            <div>
              <label className="text-slate-400 text-sm flex items-center gap-2">
                <User className="w-4 h-4" />
                Person In Charge (PIC)
              </label>
              <p className="text-white mt-1">{action.pic}</p>
            </div>
            <div>
              <label className="text-slate-400 text-sm">Status</label>
              <p className="mt-1">
                <span className={`px-3 py-1 rounded-full text-sm inline-block ${
                  action.status.toLowerCase() === 'completed'
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                }`}>
                  {action.status}
                </span>
              </p>
            </div>
            <div>
              <label className="text-slate-400 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Execution Time
              </label>
              <p className="text-white mt-1">
                {new Date(action.executionTime).toLocaleString('en-US', {
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
            <FileText className="w-5 h-5" />
            Action Description
          </h2>
          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
            {action.actionDescription}
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg">
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
