import { useApp } from '../context/AppContext';

export interface Permissions {
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canView: boolean;
  isPetugas: boolean;
  isViewer: boolean;
}

/**
 * Hook to check user permissions based on their role
 * 
 * Petugas (Officer): Can create, update, delete, and view
 * Viewer: Can only view
 */
export function usePermissions(): Permissions {
  const { user } = useApp();
  
  const isPetugas = user?.role === 'petugas';
  const isViewer = user?.role === 'viewer';
  
  return {
    canCreate: isPetugas,
    canUpdate: isPetugas,
    canDelete: isPetugas,
    canView: true, // All authenticated users can view
    isPetugas,
    isViewer,
  };
}

/**
 * Check if user has permission for an action
 */
export function hasPermission(
  user: { role?: string } | null,
  action: 'create' | 'update' | 'delete' | 'view'
): boolean {
  if (!user) return false;
  
  const isPetugas = user.role === 'petugas';
  
  switch (action) {
    case 'create':
    case 'update':
    case 'delete':
      return isPetugas;
    case 'view':
      return true;
    default:
      return false;
  }
}
