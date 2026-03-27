import { useEffect, useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { useProductStore } from '@/stores/useProductStore';
import { Skeleton } from '@/components/ui/skeleton';

const ITEMS_PER_PAGE = 8;

export default function Home() {
  const { products, categories, loading, fetchProducts, fetchCategories } = useProductStore();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const filtered = useMemo(() => {
    let result = products;
    if (selectedCategory) result = result.filter((p) => p.categoryId === selectedCategory || p.category?.id === selectedCategory);
    if (search) result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    return result;
  }, [products, selectedCategory, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => { setPage(1); }, [selectedCategory, search]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero */}
      <section className="mb-10 rounded-2xl bg-gradient-to-br from-primary/10 via-accent to-secondary p-8 md:p-12">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
          Discover amazing<br />products today
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Curated collection of premium products at unbeatable prices.
        </p>
      </section>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full shrink-0 lg:w-56">
          <div className="sticky top-20 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div>
              <h3 className="mb-2 font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categories</h3>
              <div className="flex flex-wrap gap-2 lg:flex-col">
                <Button
                  variant={selectedCategory === null ? 'default' : 'ghost'}
                  size="sm"
                  className="justify-start text-xs"
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </Button>
                {categories.map((c) => (
                  <Button
                    key={c.id}
                    variant={selectedCategory === c.id ? 'default' : 'ghost'}
                    size="sm"
                    className="justify-start text-xs"
                    onClick={() => setSelectedCategory(c.id)}
                  >
                    {c.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm">Try adjusting your search or filter.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {paginated.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
