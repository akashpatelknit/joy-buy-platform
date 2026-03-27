import { Outlet } from 'react-router-dom';
import { UserHeader } from '@/components/UserHeader';

export function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <UserHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t bg-muted/30 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 ShopHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
