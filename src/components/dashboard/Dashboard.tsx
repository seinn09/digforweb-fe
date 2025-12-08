import React from 'react';
import { useApp } from '../../context/AppContext';
import { FolderOpen, Users, Package, Activity, TrendingUp, Clock } from 'lucide-react';

export function Dashboard() {
  const { cases, victims, evidence, forensicActions } = useApp();

  const activeCases = cases.filter(c => c.status.toLowerCase() === 'active').length;

  const recentActivities = [
    ...cases.slice(-3).map(c => ({
      id: c.id,
      type: 'Case',
      description: `Case "${c.caseType}" created`,
      timestamp: c.createdAt
    })),
    ...forensicActions.slice(-3).map(a => ({
      id: a.id,
      type: 'Action',
      description: `${a.forensicStage} - ${a.status}`,
      timestamp: a.createdAt
    }))
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const stats = [
    {
      id: 1,
      label: 'Total Cases',
      value: cases.length,
      icon: FolderOpen,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      id: 2,
      label: 'Active Cases',
      value: activeCases,
      icon: TrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      id: 3,
      label: 'Total Evidence',
      value: evidence.length,
      icon: Package,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      id: 4,
      label: 'Total Victims',
      value: victims.length,
      icon: Users,
      color: 'bg-cyan-500',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20'
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-white text-3xl mb-2">Dashboard</h1>
        <p className="text-slate-400">Overview of your forensic cases and activities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className={`${stat.bgColor} border ${stat.borderColor} rounded-lg p-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                <p className="text-white text-3xl">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <h2 className="text-white text-xl">Recent Activity</h2>
          </div>
        </div>
        <div className="divide-y divide-slate-800">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <div key={`${activity.type}-${activity.id}-${index}`} className="p-4 hover:bg-slate-800/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'Case' ? 'bg-blue-400' : 'bg-green-400'
                    }`} />
                    <div>
                      <p className="text-white">{activity.description}</p>
                      <p className="text-slate-500 text-sm mt-1">{activity.type}</p>
                    </div>
                  </div>
                  <span className="text-slate-500 text-sm">{formatDate(activity.timestamp)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500">
              No recent activity
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
