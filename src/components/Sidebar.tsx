import { LayoutDashboard, Users, Briefcase, Package, Activity, LogOut } from 'lucide-react';

type SidebarProps = {
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
};

export function Sidebar({ currentView, onNavigate, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'victims', label: 'Victims', icon: Users },
    { id: 'cases', label: 'Cases', icon: Briefcase },
    { id: 'evidence', label: 'Evidence', icon: Package },
    { id: 'forensic-actions', label: 'Forensic Actions', icon: Activity },
  ];

  const isActive = (viewId: string) => {
    return currentView === viewId || currentView.startsWith(viewId);
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-cyan-400 tracking-wider">DIGFORWEB</h2>
        <p className="text-xs text-slate-500 mt-1">Forensics Manager</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.id);
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                active
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
