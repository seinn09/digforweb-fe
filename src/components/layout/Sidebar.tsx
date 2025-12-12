import React from 'react';
import { Shield, LayoutDashboard, Users, FolderOpen, Package, Activity, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../components/ui/alert-dialog';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isSidebarOpen: boolean;
}

export function Sidebar({ currentPage, onNavigate, isSidebarOpen }: SidebarProps) {
  const { logout } = useApp();

  const menuItems = [
    { id: 'dashboard', label: 'Dasbor', icon: LayoutDashboard },
    { id: 'victims', label: 'Korban', icon: Users },
    { id: 'cases', label: 'Kasus', icon: FolderOpen },
    { id: 'evidence', label: 'Bukti', icon: Package },
    { id: 'actions', label: 'Tindakan Forensik', icon: Activity },
  ];

  return (
    <div className={`bg-slate-900 border-r border-slate-800 flex flex-col h-screen transition-all duration-300 ease-in-out overflow-x-hidden ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
      <div className={`p-6 border-b border-slate-800 flex items-center ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-white" />
          </div>
          {isSidebarOpen && (
            <div className="whitespace-nowrap transition-opacity duration-300">
              <h1 className="text-white">Digital Forensik - Kel. 2</h1>
              <p className="text-slate-400 text-sm">Sistem Penanganan Insiden</p>
            </div>
          )}
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto overflow-x-hidden ${isSidebarOpen ? 'p-4' : 'p-2'}`}>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center py-3 rounded-lg transition-colors ${isSidebarOpen ? 'px-4' : 'px-2'} ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                } ${!isSidebarOpen && 'justify-center'}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className={`transition-all duration-200 whitespace-nowrap ${isSidebarOpen ? 'ml-3 opacity-100' : 'ml-0 w-0 opacity-0'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className={`border-t border-slate-800 ${isSidebarOpen ? 'p-4' : 'p-2'}`}>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              className={`w-full flex items-center py-3 rounded-lg transition-colors text-red-400 hover:bg-red-500/10 ${isSidebarOpen ? 'px-4' : 'px-2'} ${!isSidebarOpen && 'justify-center'}`}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className={`transition-all duration-200 whitespace-nowrap ${isSidebarOpen ? 'ml-3 opacity-100' : 'ml-0 w-0 opacity-0'}`}>
                Keluar
              </span>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-slate-900 border-slate-700 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
              <AlertDialogDescription className="text-slate-400">
                Apakah Anda yakin ingin keluar?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent hover:bg-slate-800 text-slate-100 border-slate-700">Batal</AlertDialogCancel>
              <AlertDialogAction onClick={logout} className="bg-red-600 hover:bg-red-700 text-white">Keluar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}