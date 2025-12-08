import { AppData } from '../App';
import { ArrowLeft, Edit, MapPin, Phone, Calendar, FileText, Briefcase } from 'lucide-react';

type VictimDetailProps = {
  victimId: string;
  appData: AppData;
  onNavigate: (view: string, id?: string) => void;
};

export function VictimDetail({ victimId, appData, onNavigate }: VictimDetailProps) {
  const victim = appData.victims.find(v => v.id === victimId);
  const relatedCases = appData.cases.filter(c => c.victimId === victimId);

  if (!victim) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 mb-4">Victim not found</p>
        <button
          onClick={() => onNavigate('victims')}
          className="text-cyan-400 hover:text-cyan-300"
        >
          Back to Victims
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('victims')}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-cyan-400 mb-1">Victim Details</h2>
            <p className="text-slate-400">Complete victim information</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('victim-edit', victimId)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Edit className="w-5 h-5" />
          Edit
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-full bg-cyan-950 flex items-center justify-center">
            <span className="text-cyan-400 text-2xl">{victim.name.charAt(0)}</span>
          </div>
          <div>
            <h3 className="mb-1">{victim.name}</h3>
            <p className="text-slate-400">Victim ID: {victim.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                <Phone className="w-4 h-4" />
                Contact
              </label>
              <p className="text-slate-100">{victim.contact}</p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                <MapPin className="w-4 h-4" />
                Location
              </label>
              <p className="text-slate-100">{victim.location}</p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                <Calendar className="w-4 h-4" />
                Report Date
              </label>
              <p className="text-slate-100">{formatDate(victim.reportDate)}</p>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-slate-400 text-sm mb-2">
              <FileText className="w-4 h-4" />
              Report Description
            </label>
            <p className="text-slate-100 leading-relaxed">{victim.reportDescription}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-cyan-400" />
          <h3 className="text-cyan-400">Related Cases</h3>
        </div>

        {relatedCases.length === 0 ? (
          <p className="text-slate-500 text-center py-6">No cases linked to this victim</p>
        ) : (
          <div className="space-y-3">
            {relatedCases.map(caseItem => (
              <button
                key={caseItem.id}
                onClick={() => onNavigate('case-detail', caseItem.id)}
                className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-4 transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1">{caseItem.caseType}</p>
                    <p className="text-slate-400 text-sm">
                      Status: <span className={caseItem.caseStatus.toLowerCase() === 'active' ? 'text-green-400' : 'text-slate-400'}>{caseItem.caseStatus}</span>
                    </p>
                  </div>
                  <span className="text-slate-500 text-sm">{formatDate(caseItem.incidentDate)}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
