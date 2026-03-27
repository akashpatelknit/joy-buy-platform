import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Star, Minus, Plus, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useProductStore } from '@/stores/useProductStore';
import { useCartStore } from '@/stores/useCartStore';
import { useWishlistStore } from '@/stores/useWishlistStore';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from '@/components/ProductCard';
import { motion } from 'framer-motion';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { products, loading, fetchProducts, getReviewsForProduct } = useProductStore();
  const addItem = useCartStore((s) => s.addItem);
  const { isWishlisted, toggleItem } = useWishlistStore();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [imageHover, setImageHover] = useState(false);

  useEffect(() => {
    if (products.length === 0) fetchProducts();
  }, [products.length, fetchProducts]);

  useEffect(() => { setQuantity(1); }, [id]);

  const product = products.find((p) => p.id === Number(id));
  const reviews = product ? getReviewsForProduct(product.id) : [];
  const wishlisted = product ? isWishlisted(product.id) : false;

  const relatedProducts = products
    .filter(p => p.id !== product?.id && p.categoryId === product?.categoryId)
    .slice(0, 4);

  if (loading && !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-4 h-8 w-32 skeleton-shimmer" />
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="aspect-square rounded-xl skeleton-shimmer" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/3 skeleton-shimmer" />
            <Skeleton className="h-10 w-3/4 skeleton-shimmer" />
            <Skeleton className="h-8 w-1/4 skeleton-shimmer" />
            <Skeleton className="h-24 w-full skeleton-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto flex flex-col items-center px-4 py-24">
        <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center mb-4">
          <ShoppingCart className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <p className="font-display text-lg font-semibold text-foreground">Product not found</p>
        <Link to="/"><Button variant="outline" className="mt-4 border-primary/30 text-primary">Back to Shop</Button></Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addItem(product);
    toast({ title: 'Added to bag', description: `${quantity}× ${product.name} added to your bag.` });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        {product.category && (
          <>
            <span className="hover:text-foreground cursor-pointer transition-colors">{product.category.name}</span>
            <ChevronRight className="h-3 w-3" />
          </>
        )}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-xl border border-border/50 bg-secondary"
          onMouseEnter={() => setImageHover(true)}
          onMouseLeave={() => setImageHover(false)}
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`h-full w-full object-cover transition-transform duration-700 ${
              imageHover ? 'scale-110' : 'scale-100'
            }`}
          />
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col justify-center"
        >
          {product.category && (
            <span className="mb-2 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
              {product.category.name}
            </span>
          )}
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">{product.name}</h1>

          {/* Rating */}
          {product.rating && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${
                      s <= Math.floor(product.rating!) ? 'fill-primary text-primary' : 'text-border'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
          )}

          <p className="mt-4 font-body text-3xl font-bold text-primary">
            ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          {/* Stock */}
          {product.stock !== undefined && (
            <div className="mt-4">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                product.stock > 10
                  ? 'bg-success/10 text-success'
                  : product.stock > 0
                  ? 'bg-primary/10 text-primary'
                  : 'bg-destructive/10 text-destructive'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${
                  product.stock > 10 ? 'bg-success' : product.stock > 0 ? 'bg-primary' : 'bg-destructive'
                }`} />
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
              </span>
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-lg border border-border/50 bg-secondary">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <Button size="lg" className="flex-1 gap-2" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4" /> Add to Bag
            </Button>
            <Button
              size="lg"
              variant="outline"
              className={`gap-2 border-border/50 ${wishlisted ? 'text-primary border-primary/30' : ''}`}
              onClick={() => {
                toggleItem(product);
                toast({
                  title: wishlisted ? 'Removed from wishlist' : 'Added to wishlist',
                  description: `${product.name} ${wishlisted ? 'removed from' : 'saved to'} your wishlist.`,
                });
              }}
            >
              <Heart className={`h-4 w-4 ${wishlisted ? 'fill-primary' : ''}`} />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Reviews Section */}
      <section className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-foreground">Reviews</h2>
          <Button variant="outline" className="border-primary/30 text-primary" onClick={() => setReviewOpen(true)}>
            Write a Review
          </Button>
        </div>

        {reviews.length === 0 ? (
          <div className="rounded-xl border border-border/50 bg-card p-8 text-center">
            <p className="text-muted-foreground">No reviews yet. Be the first to review this product.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-xl border border-border/50 bg-card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-card-foreground">{review.reviewer}</p>
                    <p className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3.5 w-3.5 ${s <= review.rating ? 'fill-primary text-primary' : 'text-border'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {relatedProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Write Review Modal */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="font-display">Write a Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Rating</label>
              <div className="mt-1 flex gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className="h-6 w-6 cursor-pointer text-border hover:fill-primary hover:text-primary transition-colors" />
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Your Review</label>
              <Textarea className="mt-1 bg-secondary border-border/50" placeholder="Share your experience..." rows={4} />
            </div>
            <Button className="w-full" onClick={() => {
              setReviewOpen(false);
              toast({ title: 'Review submitted', description: 'Thank you for your feedback!' });
            }}>
              Submit Review
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
