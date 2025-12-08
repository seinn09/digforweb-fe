import { AppData } from '../App';
import { ArrowLeft, Edit, Calendar, FileText, User, Package, Activity } from 'lucide-react';

type CaseDetailProps = {
  caseId: string;
  appData: AppData;
  onNavigate: (view: string, id?: string) => void;
};

export function CaseDetail({ caseId, appData, onNavigate }: CaseDetailProps) {
  const caseItem = appData.cases.find(c => c.id === caseId);
  const victim = caseItem ? appData.victims.find(v => v.id === caseItem.victimId) : null;
  const relatedEvidence = appData.evidence.filter(e => e.caseId === caseId);
  const relatedActions = appData.forensicActions.filter(a => a.caseId === caseId);

  if (!caseItem) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 mb-4">Case not found</p>
        <button
          onClick={() => onNavigate('cases')}
          className="text-cyan-400 hover:text-cyan-300"
        >
          Back to Cases
        </button>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    const lower = status.toLowerCase();
    if (lower === 'active') return 'text-green-400 bg-green-950/50 border-green-800';
    if (lower === 'closed') return 'text-slate-400 bg-slate-800/50 border-slate-700';
    if (lower === 'pending') return 'text-yellow-400 bg-yellow-950/50 border-yellow-800';
    return 'text-blue-400 bg-blue-950/50 border-blue-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('cases')}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-cyan-400 mb-1">Case Details</h2>
            <p className="text-slate-400">Complete case information</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('case-edit', caseId)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Edit className="w-5 h-5" />
          Edit
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <div className="mb-6 pb-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-2">{caseItem.caseType}</h3>
              <p className="text-slate-400">Case ID: {caseItem.id}</p>
            </div>
            <span className={`px-4 py-2 rounded-lg border ${getStatusColor(caseItem.caseStatus)}`}>
              {caseItem.caseStatus}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                <User className="w-4 h-4" />
                Linked Victim
              </label>
              {victim ? (
                <button
                  onClick={() => onNavigate('victim-detail', victim.id)}
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  {victim.name}
                </button>
              ) : (
                <p className="text-slate-100">Unknown</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                <Calendar className="w-4 h-4" />
                Incident Date
              </label>
              <p className="text-slate-100">{formatDate(caseItem.incidentDate)}</p>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-slate-400 text-sm mb-2">
              <FileText className="w-4 h-4" />
              Case Summary
            </label>
            <p className="text-slate-100 leading-relaxed">{caseItem.caseSummary}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-cyan-400" />
            <h3 className="text-cyan-400">Associated Evidence</h3>
          </div>

          {relatedEvidence.length === 0 ? (
            <p className="text-slate-500 text-center py-6">No evidence linked to this case</p>
          ) : (
            <div className="space-y-3">
              {relatedEvidence.map(evidence => (
                <button
                  key={evidence.id}
                  onClick={() => onNavigate('evidence-detail', evidence.id)}
                  className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-4 transition-colors text-left"
                >
                  <p className="mb-1">{evidence.evidenceType}</p>
                  <p className="text-slate-400 text-sm">{evidence.storageLocation}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="text-cyan-400">Forensic Actions</h3>
          </div>

          {relatedActions.length === 0 ? (
            <p className="text-slate-500 text-center py-6">No actions logged for this case</p>
          ) : (
            <div className="space-y-3">
              {relatedActions.map(action => (
                <button
                  key={action.id}
                  onClick={() => onNavigate('forensic-action-detail', action.id)}
                  className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-4 transition-colors text-left"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p>{action.forensicStage}</p>
                    <span className={`text-sm px-2 py-1 rounded ${action.status.toLowerCase() === 'completed' ? 'bg-green-950/50 text-green-400' : 'bg-yellow-950/50 text-yellow-400'}`}>
                      {action.status}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm">PIC: {action.pic}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
