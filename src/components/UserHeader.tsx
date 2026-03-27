import { Link } from 'react-router-dom';
import { ShoppingCart, Sun, Moon, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/useCartStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { useState } from 'react';

export function UserHeader() {
  const totalItems = useCartStore((s) => s.totalItems());
  const { dark, toggle } = useThemeStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="font-display text-xl font-bold tracking-tight text-foreground">
          Shop<span className="text-primary">Hub</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Home
          </Link>
          <Link to="/cart" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Cart
          </Link>
          <Link to="/admin" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Admin
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} className="text-muted-foreground">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t bg-background px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-2">
            <Link to="/" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">Home</Link>
            <Link to="/cart" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">Cart</Link>
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">Admin</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
