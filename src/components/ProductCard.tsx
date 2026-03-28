import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/useCartStore";
import { useWishlistStore } from "@/stores/useWishlistStore";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/services/api";
import { motion } from "framer-motion";
import { getPrimaryImage } from "@/lib/helpers";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { isWishlisted, toggleItem } = useWishlistStore();
  const { toast } = useToast();
  const wishlisted = isWishlisted(product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your bag.`,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
    toast({
      title: wishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.name} ${wishlisted ? "removed from" : "saved to"} your wishlist.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        <div className="overflow-hidden rounded-lg border border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(201,168,76,0.08)]">
          {/* Image */}
          <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
            <img
              src={getPrimaryImage(product)}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/60 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
              <Button
                size="sm"
                variant="secondary"
                className="gap-1.5 bg-card/90 text-foreground border border-border hover:bg-card"
                onClick={handleAdd}
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Add to Bag
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-9 w-9 bg-card/90 border border-border hover:bg-card"
              >
                <Eye className="h-3.5 w-3.5 text-foreground" />
              </Button>
            </div>
            {/* Wishlist button */}
            <button
              onClick={handleWishlist}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/70 backdrop-blur-sm transition-all duration-200 hover:bg-background/90"
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  wishlisted ? "fill-primary text-primary" : "text-foreground"
                }`}
              />
            </button>
            {/* Stock badge */}
            {product.stock !== undefined &&
              product.stock <= 5 &&
              product.stock > 0 && (
                <span className="absolute left-3 top-3 rounded-full bg-destructive/90 px-2 py-0.5 text-[10px] font-medium text-destructive-foreground">
                  Only {product.stock} left
                </span>
              )}
          </div>

          {/* Info */}
          <div className="p-4">
            {product.category && (
              <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                {product.category.name}
              </span>
            )}
            <h3 className="mt-1 font-display text-sm font-semibold text-card-foreground line-clamp-1">
              {product.name}
            </h3>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-body text-sm font-semibold text-primary">
                $
                {product.price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
              {product.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  <span className="text-xs text-muted-foreground">
                    {product.rating}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
