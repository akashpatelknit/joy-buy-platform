import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProductStore } from '@/stores/useProductStore';
import { useCartStore } from '@/stores/useCartStore';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { products, loading, fetchProducts } = useProductStore();
  const addItem = useCartStore((s) => s.addItem);
  const { toast } = useToast();

  useEffect(() => {
    if (products.length === 0) fetchProducts();
  }, [products.length, fetchProducts]);

  const product = products.find((p) => p.id === Number(id));

  if (loading && !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-4 h-8 w-32" />
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto flex flex-col items-center px-4 py-20">
        <p className="text-lg font-medium text-muted-foreground">Product not found</p>
        <Link to="/"><Button variant="outline" className="mt-4">Back to Shop</Button></Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to shop
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border bg-muted">
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          {product.category && (
            <span className="mb-2 inline-block w-fit rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              {product.category.name}
            </span>
          )}
          <h1 className="font-display text-3xl font-bold text-foreground">{product.name}</h1>
          <p className="mt-2 font-display text-2xl font-bold text-primary">${product.price.toFixed(2)}</p>
          <p className="mt-4 leading-relaxed text-muted-foreground">{product.description}</p>
          <Button
            size="lg"
            className="mt-8 w-fit gap-2"
            onClick={() => {
              addItem(product);
              toast({ title: 'Added to cart', description: `${product.name} added to your cart.` });
            }}
          >
            <ShoppingCart className="h-4 w-4" /> Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
