import { User } from '../App';
import { Sidebar } from './Sidebar';

type LayoutProps = {
  currentUser: User;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
};

export function Layout({ currentUser, currentView, onNavigate, onLogout, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar currentView={currentView} onNavigate={onNavigate} onLogout={onLogout} />
      <div className="flex-1 ml-64">
        <header className="bg-slate-900 border-b border-slate-800 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-cyan-400">DigForWeb</h1>
              <p className="text-slate-400 text-sm">Digital Forensics Management System</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm">{currentUser.name}</p>
                <p className="text-xs text-slate-400">{currentUser.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center">
                <span>{currentUser.name.charAt(0).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
