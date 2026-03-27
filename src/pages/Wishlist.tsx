import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlistStore } from '@/stores/useWishlistStore';
import { useCartStore } from '@/stores/useCartStore';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function Wishlist() {
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);
  const { toast } = useToast();

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center px-4 py-24">
        <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center mb-6">
          <Heart className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <p className="font-display text-xl font-semibold text-foreground">Your wishlist is empty</p>
        <p className="mt-2 text-sm text-muted-foreground">Save items you love to your wishlist.</p>
        <Link to="/"><Button className="mt-6">Explore Collection</Button></Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-foreground">Wishlist</h1>
      <p className="text-sm text-muted-foreground mt-1">{items.length} saved item{items.length > 1 ? 's' : ''}</p>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {items.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="overflow-hidden rounded-lg border border-border/50 bg-card"
          >
            <Link to={`/product/${product.id}`}>
              <div className="aspect-[3/4] overflow-hidden bg-secondary">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </Link>
            <div className="p-4">
              {product.category && (
                <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                  {product.category.name}
                </span>
              )}
              <h3 className="mt-1 font-display text-sm font-semibold text-card-foreground line-clamp-1">
                {product.name}
              </h3>
              <p className="mt-1 text-sm font-semibold text-primary">
                ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 gap-1.5 text-xs"
                  onClick={() => {
                    addToCart(product);
                    removeItem(product.id);
                    toast({ title: 'Moved to bag', description: `${product.name} moved to your bag.` });
                  }}
                >
                  <ShoppingCart className="h-3 w-3" /> Move to Bag
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-border/50 text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    removeItem(product.id);
                    toast({ title: 'Removed', description: `${product.name} removed from wishlist.` });
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
