import { useEffect, useState, useMemo, useCallback } from 'react';
import { Search, SlidersHorizontal, Star, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ProductCard } from '@/components/ProductCard';
import { useProductStore } from '@/stores/useProductStore';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

const ITEMS_PER_PAGE = 12;

export default function Home() {
  const { products, categories, loading, fetchProducts, fetchCategories } = useProductStore();
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minRating, setMinRating] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const maxPrice = useMemo(() => Math.max(...products.map(p => p.price), 10000), [products]);

  const toggleCategory = useCallback((id: number) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  }, []);

  const filtered = useMemo(() => {
    let result = products;
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.categoryId || p.category?.id || 0));
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) || p.category?.name.toLowerCase().includes(q)
      );
    }
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (minRating > 0) {
      result = result.filter(p => (p.rating || 0) >= minRating);
    }
    return result;
  }, [products, selectedCategories, search, priceRange, minRating]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => { setPage(1); }, [selectedCategories, search, priceRange, minRating]);

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearch('');
    setPriceRange([0, maxPrice]);
    setMinRating(0);
  };

  const hasActiveFilters = selectedCategories.length > 0 || search || minRating > 0 || priceRange[0] > 0 || priceRange[1] < maxPrice;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-accent/20" />
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary mb-4">
              New Collection 2026
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Crafted for the<br />
              <span className="text-gradient-gold">Exceptional</span>
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground leading-relaxed">
              Discover our curated collection of the world's finest luxury goods. Each piece handpicked for those who appreciate the art of fine living.
            </p>
            <div className="mt-8 flex gap-3">
              <Button size="lg" className="gap-2 px-8">
                Shop Collection
              </Button>
              <Button size="lg" variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary/10">
                View Lookbook
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="border-b border-border/50 bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1">
            <Button
              variant={selectedCategories.length === 0 ? 'default' : 'outline'}
              size="sm"
              className="shrink-0 rounded-full text-xs"
              onClick={() => setSelectedCategories([])}
            >
              All
            </Button>
            {categories.map((c) => (
              <Button
                key={c.id}
                variant={selectedCategories.includes(c.id) ? 'default' : 'outline'}
                size="sm"
                className="shrink-0 rounded-full text-xs border-border/50"
                onClick={() => toggleCategory(c.id)}
              >
                {c.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden w-56 shrink-0 lg:block">
            <div className="sticky top-20 space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-secondary border-border/50"
                />
              </div>

              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Price Range
                </h3>
                <Slider
                  min={0}
                  max={maxPrice}
                  step={50}
                  value={priceRange}
                  onValueChange={(v) => setPriceRange(v as [number, number])}
                  className="mt-2"
                />
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>${priceRange[0].toLocaleString()}</span>
                  <span>${priceRange[1].toLocaleString()}</span>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Minimum Rating
                </h3>
                <div className="flex gap-1">
                  {[0, 3, 4, 4.5].map((r) => (
                    <Button
                      key={r}
                      variant={minRating === r ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs gap-1 border-border/50"
                      onClick={() => setMinRating(r)}
                    >
                      {r === 0 ? 'All' : <><Star className="h-3 w-3 fill-current" />{r}+</>}
                    </Button>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-muted-foreground gap-1">
                  <X className="h-3 w-3" /> Clear filters
                </Button>
              )}
            </div>
          </aside>

          {/* Mobile filter toggle */}
          <div className="flex items-center justify-between lg:hidden">
            <p className="text-sm text-muted-foreground">{filtered.length} products</p>
            <Button variant="outline" size="sm" className="gap-2 border-border/50" onClick={() => setFiltersOpen(!filtersOpen)}>
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
            </Button>
          </div>

          {/* Mobile filters */}
          {filtersOpen && (
            <div className="rounded-lg border border-border/50 bg-card p-4 space-y-4 lg:hidden">
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-secondary border-border/50"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Price</p>
                <Slider
                  min={0}
                  max={maxPrice}
                  step={50}
                  value={priceRange}
                  onValueChange={(v) => setPriceRange(v as [number, number])}
                />
                <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                  <span>${priceRange[0]}</span><span>${priceRange[1]}</span>
                </div>
              </div>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">Clear all</Button>
              )}
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[3/4] rounded-lg skeleton-shimmer" />
                    <Skeleton className="h-3 w-1/3 skeleton-shimmer" />
                    <Skeleton className="h-4 w-3/4 skeleton-shimmer" />
                    <Skeleton className="h-3 w-1/2 skeleton-shimmer" />
                  </div>
                ))}
              </div>
            ) : paginated.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <p className="font-display text-lg font-semibold text-foreground">No products found</p>
                <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or search terms.</p>
                <Button variant="outline" size="sm" className="mt-4 border-primary/30 text-primary" onClick={clearFilters}>
                  Clear all filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {paginated.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage(page - 1)}
                      className="border-border/50"
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <Button
                        key={p}
                        variant={p === page ? 'default' : 'outline'}
                        size="sm"
                        className={p !== page ? 'border-border/50' : ''}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage(page + 1)}
                      className="border-border/50"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
