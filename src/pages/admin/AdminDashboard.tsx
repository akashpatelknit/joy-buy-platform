import { useEffect } from 'react';
import { Package, Tag, AlertTriangle, Hash } from 'lucide-react';
import { useProductStore } from '@/stores/useProductStore';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const { products, categories, fetchProducts, fetchCategories } = useProductStore();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const lowStock = products.filter(p => (p.stock || 0) <= 5).length;
  const totalSKUs = products.length;

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'text-primary' },
    { label: 'Categories', value: categories.length, icon: Tag, color: 'text-accent-foreground' },
    { label: 'Low Stock', value: lowStock, icon: AlertTriangle, color: 'text-destructive' },
    { label: 'Total SKUs', value: totalSKUs, icon: Hash, color: 'text-primary' },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
      <p className="text-sm text-muted-foreground">Store overview and analytics</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-xl border border-border/50 bg-card p-5 transition-all hover:border-primary/20"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{s.label}</span>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <p className="mt-3 font-display text-3xl font-bold text-primary">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-border/50 bg-card">
        <div className="p-5 border-b border-border/50">
          <h2 className="font-display text-base font-semibold text-card-foreground">Recent Products</h2>
        </div>
        <div className="divide-y divide-border/30">
          {products.slice(0, 10).map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-4 px-5 py-3 hover:bg-secondary/50 transition-colors"
            >
              <img src={p.imageUrl} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.category?.name}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-primary">
                  ${p.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                {p.stock !== undefined && (
                  <p className={`text-[10px] ${p.stock <= 5 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {p.stock} in stock
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
