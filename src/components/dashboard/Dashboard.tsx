import React, { useState, useEffect } from 'react';
import { Briefcase, Users, Package, Activity, Clock, Loader2 } from 'lucide-react';
import { korbanService } from '../../services/korbanService';
import { kasusService } from '../../services/kasusService';
import { evidenceService } from '../../services/evidenceService';
import { tindakanService } from '../../services/tindakanService';
import type { Victim, Case, Evidence, ForensicAction } from '../../types/api';

type DashboardProps = {
  onNavigate: (view: string, id?: string) => void;
};

type ActivityItem = {
  id: number;
  type: 'case' | 'evidence' | 'action';
  label: string;
  created_at: string;
  title: string;
  subtitle: string;
  view: string;
};

export function Dashboard({ onNavigate }: DashboardProps) {
  const [loading, setLoading] = useState(true);
  const [victims, setVictims] = useState<Victim[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [actions, setActions] = useState<ForensicAction[]>([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [victimsRes, casesRes, evidenceRes, actionsRes] = await Promise.all([
        korbanService.getVictims(),
        kasusService.getCases(),
        evidenceService.getEvidence(),
        tindakanService.getActions()
      ]);

      // Handle wrapped responses
      setVictims(Array.isArray(victimsRes) ? victimsRes : (victimsRes as any).data || []);
      setCases(Array.isArray(casesRes) ? casesRes : (casesRes as any).data || []);
      setEvidence(Array.isArray(evidenceRes) ? evidenceRes : (evidenceRes as any).data || []);
      setActions(Array.isArray(actionsRes) ? actionsRes : (actionsRes as any).data || []);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeCases = cases.filter(c => 
    c.status_kasus.toLowerCase().includes('investigasi') || 
    c.status_kasus.toLowerCase() === 'aktif'
  ).length;

  // Combine all activities
  const recentActivity: ActivityItem[] = [
    ...cases.map(c => ({
      id: c.id,
      type: 'case' as const,
      label: 'Kasus Dibuat',
      created_at: c.created_at,
      title: c.jenis_kasus,
      subtitle: c.korban?.nama || 'N/A',
      view: 'case-detail'
    })),
    ...evidence.map(e => ({
      id: e.id,
      type: 'evidence' as const,
      label: 'Bukti Ditambahkan',
      created_at: e.created_at,
      title: e.jenis_bukti,
      subtitle: e.kasus?.jenis_kasus || 'N/A',
      view: 'evidence-detail'
    })),
    ...actions.map(a => ({
      id: a.id,
      type: 'action' as const,
      label: 'Tindakan Dicatat',
      created_at: a.created_at,
      title: a.tahap_forensik,
      subtitle: a.kasus?.jenis_kasus || 'N/A',
      view: 'forensic-action-detail'
    }))
  ]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);

  const stats = [
    {
      label: 'Total Kasus',
      value: cases.length,
      icon: Briefcase,
      color: 'cyan',
      bgColor: 'bg-cyan-950/50',
      borderColor: 'border-cyan-800',
      textColor: 'text-cyan-400'
    },
    {
      label: 'Kasus Aktif',
      value: activeCases,
      icon: Activity,
      color: 'green',
      bgColor: 'bg-green-950/50',
      borderColor: 'border-green-800',
      textColor: 'text-green-400'
    },
    {
      label: 'Total Bukti',
      value: evidence.length,
      icon: Package,
      color: 'blue',
      bgColor: 'bg-blue-950/50',
      borderColor: 'border-blue-800',
      textColor: 'text-blue-400'
    },
    {
      label: 'Total Korban',
      value: victims.length,
      icon: Users,
      color: 'purple',
      bgColor: 'bg-purple-950/50',
      borderColor: 'border-purple-800',
      textColor: 'text-purple-400'
    }
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="ml-3 text-slate-400">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400 mb-2">Dashboard</h1>
          <p className="text-slate-400">Ikhtisar sistem manajemen forensik digital</p>
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
              <h3 className="text-xl font-bold text-cyan-400 mb-1">Aktivitas Terbaru</h3>
              <p className="text-slate-400 text-sm">Update terbaru dari semua modul</p>
            </div>
            <Clock className="w-5 h-5 text-slate-500" />
          </div>

          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-slate-500 text-center py-8">Belum ada aktivitas</p>
            ) : (
              recentActivity.map((item) => (
                <button
                  key={`${item.type}-${item.id}`}
                  onClick={() => onNavigate(item.view, item.id.toString())}
                  className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-4 transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-cyan-400 text-sm px-2 py-1 bg-cyan-950/50 rounded">
                          {item.label}
                        </span>
                        <span className="text-white">{item.title}</span>
                      </div>
                      <p className="text-slate-400 text-sm">{item.subtitle}</p>
                    </div>
                    <span className="text-slate-500 text-sm">{formatDate(item.created_at)}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
