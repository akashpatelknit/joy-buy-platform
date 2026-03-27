import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, MapPin, Box } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const mockOrder = {
  id: 'ORD-X7K2M9',
  date: '2026-03-25',
  total: 4644.00,
  items: [
    { name: 'Royal Oak Chronograph', qty: 1, price: 4299.00 },
    { name: 'Monaco Card Holder', qty: 1, price: 345.00 },
  ],
  steps: [
    { label: 'Order Placed', date: 'Mar 25, 2026', completed: true, icon: Package },
    { label: 'Packed', date: 'Mar 25, 2026', completed: true, icon: Box },
    { label: 'Shipped', date: 'Mar 26, 2026', completed: true, icon: Truck },
    { label: 'Out for Delivery', date: 'Mar 27, 2026', completed: false, icon: MapPin },
    { label: 'Delivered', date: '—', completed: false, icon: CheckCircle },
  ],
};

export default function OrderTracking() {
  const [orderId, setOrderId] = useState('');
  const [tracked, setTracked] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setTracked(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-foreground">Track Your Order</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter your order ID to check delivery status.</p>

        <form onSubmit={handleTrack} className="mt-6 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Enter order ID (e.g., ORD-X7K2M9)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="pl-9 bg-secondary border-border/50"
            />
          </div>
          <Button type="submit">Track</Button>
        </form>

        {tracked && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            {/* Order info */}
            <div className="rounded-xl border border-border/50 bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-display text-lg font-semibold text-card-foreground">
                    Order #{mockOrder.id}
                  </p>
                  <p className="text-xs text-muted-foreground">Placed on {mockOrder.date}</p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  In Transit
                </span>
              </div>

              {/* Items */}
              <div className="space-y-2 mb-6">
                {mockOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.name} × {item.qty}</span>
                    <span className="text-card-foreground">${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
                <div className="border-t border-border/50 pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">${mockOrder.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-0">
                {mockOrder.steps.map((s, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-full transition-all',
                        s.completed ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground border border-border/50'
                      )}>
                        <s.icon className="h-4 w-4" />
                      </div>
                      {i < mockOrder.steps.length - 1 && (
                        <div className={cn(
                          'w-0.5 flex-1 min-h-[2rem]',
                          s.completed ? 'bg-primary' : 'bg-border'
                        )} />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className={cn(
                        'text-sm font-medium',
                        s.completed ? 'text-foreground' : 'text-muted-foreground'
                      )}>{s.label}</p>
                      <p className="text-xs text-muted-foreground">{s.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
