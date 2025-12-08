import { AppData } from '../App';
import { Briefcase, Users, Package, Activity, Clock } from 'lucide-react';

type DashboardProps = {
  appData: AppData;
  onNavigate: (view: string, id?: string) => void;
};

export function Dashboard({ appData, onNavigate }: DashboardProps) {
  const activeCases = appData.cases.filter(c => c.caseStatus.toLowerCase() === 'active').length;
  
  const recentActivity = [
    ...appData.cases.map(c => ({ ...c, type: 'case', label: 'Case Created' })),
    ...appData.evidence.map(e => ({ ...e, type: 'evidence', label: 'Evidence Added' })),
    ...appData.forensicActions.map(a => ({ ...a, type: 'action', label: 'Action Logged' })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const stats = [
    {
      label: 'Total Cases',
      value: appData.cases.length,
      icon: Briefcase,
      color: 'cyan',
      bgColor: 'bg-cyan-950/50',
      borderColor: 'border-cyan-800',
      textColor: 'text-cyan-400'
    },
    {
      label: 'Active Cases',
      value: activeCases,
      icon: Activity,
      color: 'green',
      bgColor: 'bg-green-950/50',
      borderColor: 'border-green-800',
      textColor: 'text-green-400'
    },
    {
      label: 'Total Evidence',
      value: appData.evidence.length,
      icon: Package,
      color: 'blue',
      bgColor: 'bg-blue-950/50',
      borderColor: 'border-blue-800',
      textColor: 'text-blue-400'
    },
    {
      label: 'Total Victims',
      value: appData.victims.length,
      icon: Users,
      color: 'purple',
      bgColor: 'bg-purple-950/50',
      borderColor: 'border-purple-800',
      textColor: 'text-purple-400'
    }
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityDetails = (item: any) => {
    if (item.type === 'case') {
      const victim = appData.victims.find(v => v.id === item.victimId);
      return {
        title: item.caseType,
        subtitle: victim?.name || 'Unknown Victim',
        view: 'case-detail',
        id: item.id
      };
    } else if (item.type === 'evidence') {
      const caseItem = appData.cases.find(c => c.id === item.caseId);
      return {
        title: item.evidenceType,
        subtitle: caseItem?.caseType || 'Unknown Case',
        view: 'evidence-detail',
        id: item.id
      };
    } else {
      const caseItem = appData.cases.find(c => c.id === item.caseId);
      return {
        title: item.forensicStage,
        subtitle: caseItem?.caseType || 'Unknown Case',
        view: 'forensic-action-detail',
        id: item.id
      };
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-cyan-400 mb-2">Dashboard</h2>
        <p className="text-slate-400">Overview of your forensics management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`${stat.bgColor} border ${stat.borderColor} rounded-lg p-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 ${stat.textColor}`} />
              </div>
              <div>
                <p className="text-3xl mb-1">{stat.value}</p>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-cyan-400 mb-1">Recent Activity</h3>
            <p className="text-slate-400 text-sm">Latest updates across all modules</p>
          </div>
          <Clock className="w-5 h-5 text-slate-500" />
        </div>

        <div className="space-y-3">
          {recentActivity.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No recent activity</p>
          ) : (
            recentActivity.map((item) => {
              const details = getActivityDetails(item);
              return (
                <button
                  key={`${item.type}-${item.id}`}
                  onClick={() => onNavigate(details.view, details.id)}
                  className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-4 transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-cyan-400 text-sm px-2 py-1 bg-cyan-950/50 rounded">
                          {item.label}
                        </span>
                        <span>{details.title}</span>
                      </div>
                      <p className="text-slate-400 text-sm">{details.subtitle}</p>
                    </div>
                    <span className="text-slate-500 text-sm">{formatDate(item.createdAt)}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
