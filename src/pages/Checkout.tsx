import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCartStore } from '@/stores/useCartStore';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const steps = ['Shipping', 'Review', 'Confirmation'];

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCartStore();
  const { toast } = useToast();
  const [step, setStep] = useState(0);

  const tax = totalPrice() * 0.08;
  const total = totalPrice() + tax;

  if (items.length === 0 && step < 2) {
    return (
      <div className="container mx-auto flex flex-col items-center px-4 py-24">
        <p className="font-display text-lg text-foreground">Your bag is empty</p>
        <Link to="/"><Button className="mt-4">Continue Shopping</Button></Link>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    clearCart();
    setStep(2);
    toast({ title: 'Order placed!', description: 'Your order has been successfully placed.' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Step Indicator */}
      <div className="mb-10 flex items-center justify-center gap-0">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className="flex items-center gap-2">
              <div className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all',
                i <= step
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground border border-border/50'
              )}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={cn(
                'text-xs font-medium',
                i <= step ? 'text-foreground' : 'text-muted-foreground'
              )}>{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn(
                'mx-4 h-px w-12 md:w-20',
                i < step ? 'bg-primary' : 'bg-border'
              )} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="shipping"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mx-auto max-w-2xl"
          >
            <h1 className="font-display text-2xl font-bold text-foreground mb-6">Shipping Information</h1>
            <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label htmlFor="first" className="text-xs text-muted-foreground">First Name</Label><Input id="first" className="mt-1 bg-secondary border-border/50" required /></div>
                <div><Label htmlFor="last" className="text-xs text-muted-foreground">Last Name</Label><Input id="last" className="mt-1 bg-secondary border-border/50" required /></div>
              </div>
              <div><Label htmlFor="address" className="text-xs text-muted-foreground">Address</Label><Input id="address" className="mt-1 bg-secondary border-border/50" required /></div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div><Label htmlFor="city" className="text-xs text-muted-foreground">City</Label><Input id="city" className="mt-1 bg-secondary border-border/50" required /></div>
                <div><Label htmlFor="pin" className="text-xs text-muted-foreground">PIN Code</Label><Input id="pin" className="mt-1 bg-secondary border-border/50" required /></div>
                <div><Label htmlFor="phone" className="text-xs text-muted-foreground">Phone</Label><Input id="phone" className="mt-1 bg-secondary border-border/50" required /></div>
              </div>
            </div>
            <Button className="mt-6 w-full gap-2" size="lg" onClick={() => setStep(1)}>
              Continue to Review <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mx-auto max-w-2xl"
          >
            <h1 className="font-display text-2xl font-bold text-foreground mb-6">Review Order</h1>
            <div className="rounded-xl border border-border/50 bg-card p-6">
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <img src={item.product.imageUrl} alt={item.product.name} className="h-14 w-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-card-foreground">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      ${(item.product.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-border/50 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span><span>${totalPrice().toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span><span className="text-success">Free</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span><span>${tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="border-t border-border/50 pt-2 flex justify-between font-display text-lg font-bold">
                  <span>Total</span><span className="text-primary">${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button variant="outline" className="flex-1 border-border/50" onClick={() => setStep(0)}>Back</Button>
              <Button className="flex-1" size="lg" onClick={handlePlaceOrder}>Place Order</Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto flex max-w-md flex-col items-center py-16 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <CheckCircle2 className="h-20 w-20 text-primary" />
            </motion.div>
            <h1 className="mt-6 font-display text-3xl font-bold text-foreground">Order Confirmed</h1>
            <p className="mt-3 text-muted-foreground">Thank you for your purchase. Your order has been placed and will be processed shortly.</p>
            <p className="mt-2 text-xs text-muted-foreground">Order ID: #ORD-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
            <div className="mt-8 flex gap-3">
              <Link to="/"><Button>Continue Shopping</Button></Link>
              <Link to="/orders/track"><Button variant="outline" className="border-primary/30 text-primary">Track Order</Button></Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
