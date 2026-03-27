import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useProductStore } from '@/stores/useProductStore';
import { productApi, type Product } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export default function AdminProducts() {
  const { products, categories, fetchProducts, fetchCategories } = useProductStore();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => { fetchProducts(); fetchCategories(); }, [fetchProducts, fetchCategories]);

  const openCreate = () => {
    setEditing(null); setName(''); setPrice(''); setImageUrl(''); setCategoryId(''); setOpen(true);
  };
  const openEdit = (p: Product) => {
    setEditing(p); setName(p.name); setPrice(String(p.price)); setImageUrl(p.imageUrl);
    setCategoryId(String(p.categoryId || p.category?.id || '')); setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { name, price: parseFloat(price), imageUrl, categoryId: parseInt(categoryId) };
    try {
      if (editing) {
        await productApi.update(editing.id, data as any);
        toast({ title: 'Product updated' });
      } else {
        await productApi.create(data as any);
        toast({ title: 'Product created' });
      }
      fetchProducts();
      setOpen(false);
    } catch {
      toast({ title: 'Error', description: 'Failed to save product. Backend may be offline.', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await productApi.delete(id);
      toast({ title: 'Product deleted' });
      fetchProducts();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete. Backend may be offline.', variant: 'destructive' });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground text-sm">Manage your product catalog</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" /> Add Product</Button>
      </div>

      <div className="mt-6 rounded-xl border bg-card overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <img src={p.imageUrl} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                </TableCell>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="text-muted-foreground">{p.category?.name || '—'}</TableCell>
                <TableCell className="font-display font-semibold">${p.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Product' : 'Create Product'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label htmlFor="p-name">Name</Label><Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} required /></div>
            <div><Label htmlFor="p-price">Price</Label><Input id="p-price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required /></div>
            <div><Label htmlFor="p-img">Image URL</Label><Input id="p-img" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required /></div>
            <div>
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">{editing ? 'Update' : 'Create'}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
