import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Sun, Moon, Menu, X, Search, LogIn, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/stores/useCartStore';
import { useWishlistStore } from '@/stores/useWishlistStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToast } from '@/hooks/use-toast';

export function UserHeader() {
  const totalItems = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { dark, toggle } = useThemeStore();
  const { isAuthenticated, user, logout, isAdmin } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/wishlist', label: 'Wishlist' },
    { to: '/orders/track', label: 'Track Order' },
    ...(isAuthenticated && isAdmin() ? [{ to: '/admin', label: 'Admin' }] : []),
  ];

  const handleLogout = () => {
    logout();
    toast({ title: 'Logged out successfully' });
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-bold text-gradient-gold">MAISON</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-xs font-medium uppercase tracking-[0.15em] transition-colors hover:text-primary ${
                location.pathname === link.to ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggle} className="text-muted-foreground hover:text-foreground">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Link to="/wishlist">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <Heart className="h-4 w-4" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                  {wishlistCount}
                </span>
              )}
            </Button>
          </Link>
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          {isAuthenticated ? (
            <div className="hidden lg:flex items-center gap-1">
              <span className="text-xs text-muted-foreground px-2">
                <User className="h-3.5 w-3.5 inline mr-1" />
                {user?.firstName}
              </span>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link to="/login" className="hidden lg:block">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1.5">
                <LogIn className="h-4 w-4" /> Login
              </Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-muted-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-t border-border/50 bg-background px-4 py-3">
          <div className="container mx-auto">
            <Input
              placeholder="Search for luxury items..."
              className="bg-secondary border-border"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Escape') setSearchOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border/50 bg-background px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary ${
                  location.pathname === link.to ? 'text-primary bg-accent' : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary text-left flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" /> Logout ({user?.firstName})
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" /> Login / Sign Up
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
