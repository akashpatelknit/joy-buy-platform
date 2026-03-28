import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-display font-bold text-destructive">Access Denied</h1>
          <p className="text-muted-foreground">You need admin privileges to access this page.</p>
          <a href="/" className="text-primary hover:underline text-sm">← Back to Store</a>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
