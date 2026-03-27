import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/useCartStore';
import { motion } from 'framer-motion';

export default function Cart() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center px-4 py-24">
        <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center mb-6">
          <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <p className="font-display text-xl font-semibold text-foreground">Your bag is empty</p>
        <p className="mt-2 text-sm text-muted-foreground">Looks like you haven't added anything yet.</p>
        <Link to="/"><Button className="mt-6">Continue Shopping</Button></Link>
      </div>
    );
  }

  const tax = totalPrice() * 0.08;
  const total = totalPrice() + tax;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Continue shopping
      </Link>
      <h1 className="font-display text-3xl font-bold text-foreground">Shopping Bag</h1>
      <p className="text-sm text-muted-foreground mt-1">{items.length} item{items.length > 1 ? 's' : ''}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={item.product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-4 rounded-xl border border-border/50 bg-card p-4 transition-all hover:border-border"
            >
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                className="h-28 w-24 rounded-lg object-cover"
              />
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  {item.product.category && (
                    <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                      {item.product.category.name}
                    </span>
                  )}
                  <h3 className="font-display text-base font-semibold text-card-foreground">{item.product.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-md border border-border/50 bg-secondary">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-xs font-semibold">{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => removeItem(item.product.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
                <span className="font-body text-sm font-bold text-primary">
                  ${(item.product.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:sticky lg:top-24 h-fit">
          <div className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="font-display text-lg font-semibold text-card-foreground">Order Summary</h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${totalPrice().toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-success">Complimentary</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Estimated Tax</span>
                <span>${tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t border-border/50 pt-3 flex justify-between font-display text-lg font-bold text-foreground">
                <span>Total</span>
                <span className="text-primary">${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <Link to="/checkout">
              <Button className="mt-6 w-full" size="lg">Proceed to Checkout</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
