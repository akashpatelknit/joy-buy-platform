import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCartStore } from '@/stores/useCartStore';
import { useToast } from '@/hooks/use-toast';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCartStore();
  const { toast } = useToast();
  const [placed, setPlaced] = useState(false);

  if (placed) {
    return (
      <div className="container mx-auto flex flex-col items-center px-4 py-20">
        <CheckCircle2 className="h-16 w-16 text-primary" />
        <h1 className="mt-4 font-display text-2xl font-bold">Order Placed!</h1>
        <p className="mt-2 text-muted-foreground">Thank you for your purchase.</p>
        <Link to="/"><Button className="mt-6">Continue Shopping</Button></Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center px-4 py-20">
        <p className="text-lg text-muted-foreground">Your cart is empty</p>
        <Link to="/"><Button className="mt-4">Continue Shopping</Button></Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearCart();
    setPlaced(true);
    toast({ title: 'Order placed!', description: 'Your order has been successfully placed.' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-foreground">Checkout</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <h2 className="font-display font-semibold">Shipping Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label htmlFor="first">First Name</Label><Input id="first" required /></div>
              <div><Label htmlFor="last">Last Name</Label><Input id="last" required /></div>
            </div>
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" required /></div>
            <div><Label htmlFor="address">Address</Label><Input id="address" required /></div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div><Label htmlFor="city">City</Label><Input id="city" required /></div>
              <div><Label htmlFor="state">State</Label><Input id="state" required /></div>
              <div><Label htmlFor="zip">ZIP</Label><Input id="zip" required /></div>
            </div>
          </div>
          <Button type="submit" size="lg" className="w-full">Place Order — ${totalPrice().toFixed(2)}</Button>
        </form>

        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-display font-semibold">Order Summary</h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3">
                <img src={item.product.imageUrl} alt={item.product.name} className="h-12 w-12 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t pt-4 flex justify-between font-display font-bold">
            <span>Total</span><span>${totalPrice().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
