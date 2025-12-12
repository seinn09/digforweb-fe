import React, { useState, useEffect } from 'react';
import { useIsMobile } from './hooks/useIsMobile';
import { AppProvider, useApp } from './context/AppContext';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { VictimList } from './components/victims/VictimList';
import { VictimDetail } from './components/victims/VictimDetail';
import { VictimForm } from './components/victims/VictimForm';
import { CaseList } from './components/cases/CaseList';
import { CaseDetail } from './components/cases/CaseDetail';
import { CaseForm } from './components/cases/CaseForm';
import { EvidenceList } from './components/evidence/EvidenceList';
import { EvidenceDetail } from './components/evidence/EvidenceDetail';
import { EvidenceForm } from './components/evidence/EvidenceForm';
import { ActionList } from './components/actions/ActionList';
import { ActionDetail } from './components/actions/ActionDetail';
import { ActionForm } from './components/actions/ActionForm';
import { PanelLeft } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet';

// ... (type definitions)

function MainApp() {
  const { user, isLoading } = useApp();
  const [authView, setAuthView] = useState<AuthView>('login');
  const [currentPage, setCurrentPage] = useState<MainPage>('dashboard');
  
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);
  
  // Victim navigation state
  const [victimView, setVictimView] = useState<VictimView>('list');
  const [selectedVictimId, setSelectedVictimId] = useState<string | null>(null);
  
  // Case navigation state
  const [caseView, setCaseView] = useState<CaseView>('list');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  
  // Evidence navigation state
  const [evidenceView, setEvidenceView] = useState<EvidenceView>('list');
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  
  // Action navigation state
  const [actionView, setActionView] = useState<ActionView>('list');
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);

  const handleAuthSuccess = () => {
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as MainPage);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
    
    // Reset sub-views when switching pages
    setVictimView('list');
    setCaseView('list');
    setEvidenceView('list');
    setActionView('list');
    setSelectedVictimId(null);
    setSelectedCaseId(null);
    setSelectedEvidenceId(null);
    setSelectedActionId(null);
  };

  // Victim navigation handlers
  const handleVictimViewDetail = (id: string) => {
    setSelectedVictimId(id);
    setVictimView('detail');
  };

  const handleVictimEdit = (id: string) => {
    setSelectedVictimId(id);
    setVictimView('edit');
  };

  const handleVictimCreate = () => {
    setSelectedVictimId(null);
    setVictimView('create');
  };

  const handleVictimBackToList = () => {
    setVictimView('list');
    setSelectedVictimId(null);
  };

  // Case navigation handlers
  const handleCaseViewDetail = (id: string) => {
    setSelectedCaseId(id);
    setCaseView('detail');
  };

  const handleCaseEdit = (id: string) => {
    setSelectedCaseId(id);
    setCaseView('edit');
  };

  const handleCaseCreate = () => {
    setSelectedCaseId(null);
    setCaseView('create');
  };

  const handleCaseBackToList = () => {
    setCaseView('list');
    setSelectedCaseId(null);
  };

  // Evidence navigation handlers
  const handleEvidenceViewDetail = (id: string) => {
    setSelectedEvidenceId(id);
    setEvidenceView('detail');
  };

  const handleEvidenceEdit = (id: string) => {
    setSelectedEvidenceId(id);
    setEvidenceView('edit');
  };

  const handleEvidenceCreate = () => {
    setSelectedEvidenceId(null);
    setEvidenceView('create');
  };

  const handleEvidenceBackToList = () => {
    setEvidenceView('list');
    setSelectedEvidenceId(null);
  };

  // Action navigation handlers
  const handleActionViewDetail = (id: string) => {
    setSelectedActionId(id);
    setActionView('detail');
  };

  const handleActionEdit = (id: string) => {
    setSelectedActionId(id);
    setActionView('edit');
  };

  const handleActionCreate = () => {
    setSelectedActionId(null);
    setActionView('create');
  };

  const handleActionBackToList = () => {
    setActionView('list');
    setSelectedActionId(null);
  };

  // Show loading state while initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show auth screens
  if (!user) {
    if (authView === 'register') {
      return (
        <Register
          onSuccess={handleAuthSuccess}
          onSwitchToLogin={() => setAuthView('login')}
        />
      );
    }
    return (
      <Login
        onSuccess={handleAuthSuccess}
        onSwitchToRegister={() => setAuthView('register')}
      />
    );
  }

  // Render main content based on current page
  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      
      case 'victims':
        switch (victimView) {
          case 'detail':
            return selectedVictimId ? (
              <VictimDetail
                victimId={selectedVictimId}
                onBack={handleVictimBackToList}
                onEdit={handleVictimEdit}
              />
            ) : (
              <VictimList
                onViewDetail={handleVictimViewDetail}
                onEdit={handleVictimEdit}
                onCreate={handleVictimCreate}
              />
            );
          case 'create':
            return <VictimForm onBack={handleVictimBackToList} />;
          case 'edit':
            return selectedVictimId ? (
              <VictimForm victimId={selectedVictimId} onBack={handleVictimBackToList} />
            ) : (
              <VictimList
                onViewDetail={handleVictimViewDetail}
                onEdit={handleVictimEdit}
                onCreate={handleVictimCreate}
              />
            );
          default:
            return (
              <VictimList
                onViewDetail={handleVictimViewDetail}
                onEdit={handleVictimEdit}
                onCreate={handleVictimCreate}
              />
            );
        }
      
      case 'cases':
        switch (caseView) {
          case 'detail':
            return selectedCaseId ? (
              <CaseDetail
                caseId={selectedCaseId}
                onBack={handleCaseBackToList}
                onEdit={handleCaseEdit}
              />
            ) : (
              <CaseList
                onViewDetail={handleCaseViewDetail}
                onEdit={handleCaseEdit}
                onCreate={handleCaseCreate}
              />
            );
          case 'create':
            return <CaseForm onBack={handleCaseBackToList} />;
          case 'edit':
            return selectedCaseId ? (
              <CaseForm caseId={selectedCaseId} onBack={handleCaseBackToList} />
            ) : (
              <CaseList
                onViewDetail={handleCaseViewDetail}
                onEdit={handleCaseEdit}
                onCreate={handleCaseCreate}
              />
            );
          default:
            return (
              <CaseList
                onViewDetail={handleCaseViewDetail}
                onEdit={handleCaseEdit}
                onCreate={handleCaseCreate}
              />
            );
        }
      
      case 'evidence':
        switch (evidenceView) {
          case 'detail':
            return selectedEvidenceId ? (
              <EvidenceDetail
                evidenceId={selectedEvidenceId}
                onBack={handleEvidenceBackToList}
                onEdit={handleEvidenceEdit}
              />
            ) : (
              <EvidenceList
                onViewDetail={handleEvidenceViewDetail}
                onEdit={handleEvidenceEdit}
                onCreate={handleEvidenceCreate}
              />
            );
          case 'create':
            return <EvidenceForm onBack={handleEvidenceBackToList} />;
          case 'edit':
            return selectedEvidenceId ? (
              <EvidenceForm evidenceId={selectedEvidenceId} onBack={handleEvidenceBackToList} />
            ) : (
              <EvidenceList
                onViewDetail={handleEvidenceViewDetail}
                onEdit={handleEvidenceEdit}
                onCreate={handleEvidenceCreate}
              />
            );
          default:
            return (
              <EvidenceList
                onViewDetail={handleEvidenceViewDetail}
                onEdit={handleEvidenceEdit}
                onCreate={handleEvidenceCreate}
              />
            );
        }
      
      case 'actions':
        switch (actionView) {
          case 'detail':
            return selectedActionId ? (
              <ActionDetail
                actionId={selectedActionId}
                onBack={handleActionBackToList}
                onEdit={handleActionEdit}
              />
            ) : (
              <ActionList
                onViewDetail={handleActionViewDetail}
                onEdit={handleActionEdit}
                onCreate={handleActionCreate}
              />
            );
          case 'create':
            return <ActionForm onBack={handleActionBackToList} />;
          case 'edit':
            return selectedActionId ? (
              <ActionForm actionId={selectedActionId} onBack={handleActionBackToList} />
            ) : (
              <ActionList
                onViewDetail={handleActionViewDetail}
                onEdit={handleActionEdit}
                onCreate={handleActionCreate}
              />
            );
          default:
            return (
              <ActionList
                onViewDetail={handleActionViewDetail}
                onEdit={handleActionEdit}
                onCreate={handleActionCreate}
              />
            );
        }
      
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="bg-slate-950 text-white">
      {isMobile ? (
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <div className="flex flex-col">
            <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-4">
                <SheetTrigger asChild>
                  <button className="text-slate-400 hover:text-white" title="Toggle sidebar">
                    <PanelLeft className="w-6 h-6" />
                  </button>
                </SheetTrigger>
                <div>
                  <h1 className="text-lg font-semibold text-white">
                    {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </header>
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 h-[calc(100vh-69px)]">
              {renderContent()}
            </main>
          </div>
          <SheetContent side="left" className="bg-slate-900 border-r-slate-800 p-0 w-[280px] flex flex-col">
            <Sidebar isSidebarOpen={true} currentPage={currentPage} onNavigate={handleNavigate} />
          </SheetContent>
        </Sheet>
      ) : (
        <div className="flex h-screen overflow-hidden">
          <div className={`bg-slate-900 border-r border-slate-800 flex-col h-screen transition-all duration-300 ease-in-out overflow-x-hidden ${isSidebarOpen ? 'w-64' : 'w-20'} flex`}>
            <Sidebar isSidebarOpen={isSidebarOpen} currentPage={currentPage} onNavigate={handleNavigate} />
          </div>
          <div className="flex flex-col flex-1">
            <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-4">
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-400 hover:text-white" title="Toggle sidebar">
                  <PanelLeft className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-lg font-semibold text-white">
                    {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-cyan-400">{user?.name}</p>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </header>
            <main className="flex-1 overflow-y-auto p-6">
              {renderContent()}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
