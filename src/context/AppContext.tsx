import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  contact?: string;
}

export interface Victim {
  id: string;
  name: string;
  contact: string;
  location: string;
  reportDate: string;
  reportDescription: string;
  createdAt: string;
}

export interface Case {
  id: string;
  victimId: string;
  caseType: string;
  incidentDate: string;
  caseSummary: string;
  status: string;
  createdAt: string;
}

export interface Evidence {
  id: string;
  caseId: string;
  evidenceType: string;
  storageLocation: string;
  hashValue: string;
  collectionTime: string;
  createdAt: string;
}

export interface ForensicAction {
  id: string;
  caseId: string;
  forensicStage: string;
  actionDescription: string;
  executionTime: string;
  pic: string;
  status: string;
  createdAt: string;
}

interface AppContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string, contact: string) => boolean;
  logout: () => void;
  victims: Victim[];
  addVictim: (victim: Omit<Victim, 'id' | 'createdAt'>) => void;
  updateVictim: (id: string, victim: Omit<Victim, 'id' | 'createdAt'>) => void;
  deleteVictim: (id: string) => void;
  cases: Case[];
  addCase: (caseData: Omit<Case, 'id' | 'createdAt'>) => void;
  updateCase: (id: string, caseData: Omit<Case, 'id' | 'createdAt'>) => void;
  deleteCase: (id: string) => void;
  evidence: Evidence[];
  addEvidence: (evidenceData: Omit<Evidence, 'id' | 'createdAt'>) => void;
  updateEvidence: (id: string, evidenceData: Omit<Evidence, 'id' | 'createdAt'>) => void;
  deleteEvidence: (id: string) => void;
  forensicActions: ForensicAction[];
  addForensicAction: (action: Omit<ForensicAction, 'id' | 'createdAt'>) => void;
  updateForensicAction: (id: string, action: Omit<ForensicAction, 'id' | 'createdAt'>) => void;
  deleteForensicAction: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock initial data
const mockVictims: Victim[] = [
  {
    id: '1',
    name: 'John Anderson',
    contact: '+1-555-0123',
    location: 'New York, NY',
    reportDate: '2025-12-01',
    reportDescription: 'Reported unauthorized access to corporate email account with suspicious activities detected.',
    createdAt: '2025-12-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'Sarah Mitchell',
    contact: '+1-555-0456',
    location: 'Los Angeles, CA',
    reportDate: '2025-12-03',
    reportDescription: 'Mobile device stolen containing sensitive business data and personal information.',
    createdAt: '2025-12-03T14:30:00Z'
  }
];

const mockCases: Case[] = [
  {
    id: '1',
    victimId: '1',
    caseType: 'Email Compromise',
    incidentDate: '2025-11-28',
    caseSummary: 'Investigation into unauthorized email access. Multiple login attempts from foreign IP addresses detected.',
    status: 'Active',
    createdAt: '2025-12-01T11:00:00Z'
  },
  {
    id: '2',
    victimId: '2',
    caseType: 'Data Theft',
    incidentDate: '2025-12-02',
    caseSummary: 'Device theft with potential data breach. Device contained unencrypted business documents.',
    status: 'Pending',
    createdAt: '2025-12-03T15:00:00Z'
  }
];

const mockEvidence: Evidence[] = [
  {
    id: '1',
    caseId: '1',
    evidenceType: 'Email Logs',
    storageLocation: 'Server-A/Evidence/2025/Case-001',
    hashValue: 'a3f5e7d9c2b4f8e1a6d3c9b7f5e2a8d4',
    collectionTime: '2025-12-01T12:00:00Z',
    createdAt: '2025-12-01T12:00:00Z'
  },
  {
    id: '2',
    caseId: '1',
    evidenceType: 'Network Traffic',
    storageLocation: 'Server-A/Evidence/2025/Case-001',
    hashValue: 'b8e2f4a6c9d1e5f7a3b6d8c4e9f2a7b5',
    collectionTime: '2025-12-01T13:30:00Z',
    createdAt: '2025-12-01T13:30:00Z'
  }
];

const mockActions: ForensicAction[] = [
  {
    id: '1',
    caseId: '1',
    forensicStage: 'Identification',
    actionDescription: 'Identified compromised email account and mapped unauthorized access points.',
    executionTime: '2025-12-01T11:30:00Z',
    pic: 'Dr. Emily Carter',
    status: 'Completed',
    createdAt: '2025-12-01T11:30:00Z'
  },
  {
    id: '2',
    caseId: '1',
    forensicStage: 'Collection',
    actionDescription: 'Collected email server logs and network traffic data for analysis.',
    executionTime: '2025-12-01T14:00:00Z',
    pic: 'Dr. Emily Carter',
    status: 'Completed',
    createdAt: '2025-12-01T14:00:00Z'
  },
  {
    id: '3',
    caseId: '2',
    forensicStage: 'Identification',
    actionDescription: 'Device identification and initial assessment of data exposure risk.',
    executionTime: '2025-12-03T16:00:00Z',
    pic: 'Michael Roberts',
    status: 'Pending',
    createdAt: '2025-12-03T16:00:00Z'
  }
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [victims, setVictims] = useState<Victim[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [forensicActions, setForensicActions] = useState<ForensicAction[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('digforweb_user');
    const storedVictims = localStorage.getItem('digforweb_victims');
    const storedCases = localStorage.getItem('digforweb_cases');
    const storedEvidence = localStorage.getItem('digforweb_evidence');
    const storedActions = localStorage.getItem('digforweb_actions');

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedVictims) {
      setVictims(JSON.parse(storedVictims));
    } else {
      setVictims(mockVictims);
      localStorage.setItem('digforweb_victims', JSON.stringify(mockVictims));
    }
    if (storedCases) {
      setCases(JSON.parse(storedCases));
    } else {
      setCases(mockCases);
      localStorage.setItem('digforweb_cases', JSON.stringify(mockCases));
    }
    if (storedEvidence) {
      setEvidence(JSON.parse(storedEvidence));
    } else {
      setEvidence(mockEvidence);
      localStorage.setItem('digforweb_evidence', JSON.stringify(mockEvidence));
    }
    if (storedActions) {
      setForensicActions(JSON.parse(storedActions));
    } else {
      setForensicActions(mockActions);
      localStorage.setItem('digforweb_actions', JSON.stringify(mockActions));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (victims.length > 0) {
      localStorage.setItem('digforweb_victims', JSON.stringify(victims));
    }
  }, [victims]);

  useEffect(() => {
    if (cases.length > 0) {
      localStorage.setItem('digforweb_cases', JSON.stringify(cases));
    }
  }, [cases]);

  useEffect(() => {
    if (evidence.length > 0) {
      localStorage.setItem('digforweb_evidence', JSON.stringify(evidence));
    }
  }, [evidence]);

  useEffect(() => {
    if (forensicActions.length > 0) {
      localStorage.setItem('digforweb_actions', JSON.stringify(forensicActions));
    }
  }, [forensicActions]);

  const login = (email: string, password: string): boolean => {
    // Mock authentication
    const storedUsers = localStorage.getItem('digforweb_users');
    let users: any[] = [];
    
    if (storedUsers) {
      users = JSON.parse(storedUsers);
      const foundUser = users.find(u => u.email === email && u.password === password);
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('digforweb_user', JSON.stringify(userWithoutPassword));
        return true;
      }
    }
    
    // Default demo user
    if (email === 'admin@digforweb.com' && password === 'admin123') {
      const demoUser = {
        id: 'demo-user',
        name: 'Admin User',
        email: 'admin@digforweb.com',
        contact: '+1-555-ADMIN'
      };
      setUser(demoUser);
      localStorage.setItem('digforweb_user', JSON.stringify(demoUser));
      return true;
    }
    
    return false;
  };

  const register = (name: string, email: string, password: string, contact: string): boolean => {
    const storedUsers = localStorage.getItem('digforweb_users');
    let users: any[] = storedUsers ? JSON.parse(storedUsers) : [];
    
    if (users.find(u => u.email === email)) {
      return false; // Email already exists
    }
    
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      contact
    };
    
    users.push(newUser);
    localStorage.setItem('digforweb_users', JSON.stringify(users));
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('digforweb_user', JSON.stringify(userWithoutPassword));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('digforweb_user');
  };

  // Victim CRUD
  const addVictim = (victimData: Omit<Victim, 'id' | 'createdAt'>) => {
    const newVictim: Victim = {
      ...victimData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setVictims(prev => [...prev, newVictim]);
  };

  const updateVictim = (id: string, victimData: Omit<Victim, 'id' | 'createdAt'>) => {
    setVictims(prev => prev.map(v => v.id === id ? { ...v, ...victimData } : v));
  };

  const deleteVictim = (id: string) => {
    setVictims(prev => prev.filter(v => v.id !== id));
    // Also delete related cases
    const relatedCases = cases.filter(c => c.victimId === id);
    relatedCases.forEach(c => deleteCase(c.id));
  };

  // Case CRUD
  const addCase = (caseData: Omit<Case, 'id' | 'createdAt'>) => {
    const newCase: Case = {
      ...caseData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setCases(prev => [...prev, newCase]);
  };

  const updateCase = (id: string, caseData: Omit<Case, 'id' | 'createdAt'>) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, ...caseData } : c));
  };

  const deleteCase = (id: string) => {
    setCases(prev => prev.filter(c => c.id !== id));
    // Also delete related evidence and actions
    setEvidence(prev => prev.filter(e => e.caseId !== id));
    setForensicActions(prev => prev.filter(a => a.caseId !== id));
  };

  // Evidence CRUD
  const addEvidence = (evidenceData: Omit<Evidence, 'id' | 'createdAt'>) => {
    const newEvidence: Evidence = {
      ...evidenceData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setEvidence(prev => [...prev, newEvidence]);
  };

  const updateEvidence = (id: string, evidenceData: Omit<Evidence, 'id' | 'createdAt'>) => {
    setEvidence(prev => prev.map(e => e.id === id ? { ...e, ...evidenceData } : e));
  };

  const deleteEvidence = (id: string) => {
    setEvidence(prev => prev.filter(e => e.id !== id));
  };

  // Forensic Action CRUD
  const addForensicAction = (actionData: Omit<ForensicAction, 'id' | 'createdAt'>) => {
    const newAction: ForensicAction = {
      ...actionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setForensicActions(prev => [...prev, newAction]);
  };

  const updateForensicAction = (id: string, actionData: Omit<ForensicAction, 'id' | 'createdAt'>) => {
    setForensicActions(prev => prev.map(a => a.id === id ? { ...a, ...actionData } : a));
  };

  const deleteForensicAction = (id: string) => {
    setForensicActions(prev => prev.filter(a => a.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        victims,
        addVictim,
        updateVictim,
        deleteVictim,
        cases,
        addCase,
        updateCase,
        deleteCase,
        evidence,
        addEvidence,
        updateEvidence,
        deleteEvidence,
        forensicActions,
        addForensicAction,
        updateForensicAction,
        deleteForensicAction
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
