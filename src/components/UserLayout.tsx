import { Outlet } from 'react-router-dom';
import { UserHeader } from '@/components/UserHeader';
import { motion } from 'framer-motion';

export function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <UserHeader />
      <motion.main
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
      <footer className="border-t border-border/50 bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <span className="font-display text-xl font-bold text-gradient-gold">MAISON</span>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Curating the world's finest luxury goods since 2024. Every piece tells a story of craftsmanship.
              </p>
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold text-foreground mb-3">Shop</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="hover:text-primary cursor-pointer transition-colors">New Arrivals</p>
                <p className="hover:text-primary cursor-pointer transition-colors">Best Sellers</p>
                <p className="hover:text-primary cursor-pointer transition-colors">Collections</p>
              </div>
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold text-foreground mb-3">Support</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="hover:text-primary cursor-pointer transition-colors">Contact Us</p>
                <p className="hover:text-primary cursor-pointer transition-colors">Shipping & Returns</p>
                <p className="hover:text-primary cursor-pointer transition-colors">FAQ</p>
              </div>
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold text-foreground mb-3">Legal</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</p>
                <p className="hover:text-primary cursor-pointer transition-colors">Terms of Service</p>
              </div>
            </div>
          </div>
          <div className="mt-10 border-t border-border/50 pt-6 text-center text-xs text-muted-foreground">
            © 2026 MAISON. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
