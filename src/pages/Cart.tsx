import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/useCartStore';

export default function Cart() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center px-4 py-20">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
        <p className="mt-4 text-lg font-medium text-muted-foreground">Your cart is empty</p>
        <Link to="/"><Button className="mt-4">Continue Shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Continue shopping
      </Link>
      <h1 className="font-display text-2xl font-bold text-foreground">Shopping Cart</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-4 rounded-xl border bg-card p-4">
              <img src={item.product.imageUrl} alt={item.product.name} className="h-24 w-24 rounded-lg object-cover" />
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="font-display font-semibold text-card-foreground">{item.product.name}</h3>
                  <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeItem(item.product.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <span className="font-display font-bold">${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-card-foreground">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span><span>${totalPrice().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span><span>Free</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-display font-bold text-foreground">
              <span>Total</span><span>${totalPrice().toFixed(2)}</span>
            </div>
          </div>
          <Link to="/checkout">
            <Button className="mt-6 w-full" size="lg">Proceed to Checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
