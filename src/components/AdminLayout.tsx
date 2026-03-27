import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Boxes, Tag, ArrowLeft, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/stores/useThemeStore';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Products', path: '/admin/products', icon: Boxes },
  { label: 'Categories', path: '/admin/categories', icon: Tag },
];

export function AdminLayout() {
  const location = useLocation();
  const { dark, toggle } = useThemeStore();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
          <span className="font-display text-lg font-bold text-sidebar-primary">Shop</span>
          <span className="font-display text-lg font-bold">Admin</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active ? 'bg-sidebar-accent text-sidebar-primary' : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-3 space-y-1">
          <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent/50">
            <ArrowLeft className="h-4 w-4" /> Back to Store
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-md px-6">
          {/* Mobile nav */}
          <div className="flex items-center gap-4 md:hidden">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} className={cn('text-sm font-medium', active ? 'text-primary' : 'text-muted-foreground')}>
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="hidden md:block" />
          <Button variant="ghost" size="icon" onClick={toggle} className="text-muted-foreground">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
