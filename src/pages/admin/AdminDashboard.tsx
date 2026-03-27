import { useEffect } from 'react';
import { Package, Tag, DollarSign, TrendingUp } from 'lucide-react';
import { useProductStore } from '@/stores/useProductStore';

export default function AdminDashboard() {
  const { products, categories, fetchProducts, fetchCategories } = useProductStore();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'text-primary' },
    { label: 'Categories', value: categories.length, icon: Tag, color: 'text-accent-foreground' },
    { label: 'Avg Price', value: `$${products.length ? (products.reduce((s, p) => s + p.price, 0) / products.length).toFixed(2) : '0'}`, icon: DollarSign, color: 'text-primary' },
    { label: 'Total Value', value: `$${products.reduce((s, p) => s + p.price, 0).toFixed(2)}`, icon: TrendingUp, color: 'text-accent-foreground' },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
      <p className="text-muted-foreground">Overview of your store</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{s.label}</span>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-card-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border bg-card p-6">
        <h2 className="font-display font-semibold text-card-foreground">Recent Products</h2>
        <div className="mt-4 space-y-3">
          {products.slice(0, 5).map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50">
              <img src={p.imageUrl} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="text-sm font-medium text-card-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.category?.name}</p>
              </div>
              <span className="font-display text-sm font-semibold">${p.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
