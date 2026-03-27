import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useProductStore } from '@/stores/useProductStore';
import { categoryApi, type Category } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function AdminCategories() {
  const { categories, products, fetchCategories, fetchProducts } = useProductStore();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => { fetchCategories(); fetchProducts(); }, [fetchCategories, fetchProducts]);

  const openCreate = () => { setEditing(null); setName(''); setDescription(''); setOpen(true); };
  const openEdit = (c: Category) => { setEditing(c); setName(c.name); setDescription(c.description || ''); setOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await categoryApi.update(editing.id, { name, description });
        toast({ title: 'Category updated' });
      } else {
        await categoryApi.create({ name, description });
        toast({ title: 'Category created' });
      }
      fetchCategories();
      setOpen(false);
    } catch {
      toast({ title: 'Error', description: 'Failed to save. Backend may be offline.', variant: 'destructive' });
    }
  };

  const confirmDelete = (id: number) => { setDeleteId(id); setConfirmOpen(true); };
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await categoryApi.delete(deleteId);
      toast({ title: 'Category deleted' });
      fetchCategories();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete.', variant: 'destructive' });
    }
    setConfirmOpen(false);
    setDeleteId(null);
  };

  const getProductCount = (catId: number) => products.filter(p => p.categoryId === catId || p.category?.id === catId).length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Categories</h1>
          <p className="text-sm text-muted-foreground">Manage product categories</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" /> Add Category</Button>
      </div>

      <div className="mt-6 rounded-xl border border-border/50 bg-card overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-widest text-muted-foreground">ID</TableHead>
              <TableHead className="text-xs uppercase tracking-widest text-muted-foreground">Name</TableHead>
              <TableHead className="text-xs uppercase tracking-widest text-muted-foreground">Slug</TableHead>
              <TableHead className="text-xs uppercase tracking-widest text-muted-foreground">Products</TableHead>
              <TableHead className="text-right text-xs uppercase tracking-widest text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((c) => (
              <TableRow key={c.id} className="border-border/30 hover:bg-secondary/50">
                <TableCell className="text-muted-foreground text-sm">{c.id}</TableCell>
                <TableCell className="font-medium text-card-foreground">{c.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm font-mono">{c.slug || toSlug(c.name)}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {getProductCount(c.id)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => openEdit(c)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => confirmDelete(c.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border/50">
          <DialogHeader>
            <div className="h-0.5 w-12 bg-primary rounded-full mb-2" />
            <DialogTitle className="font-display">{editing ? 'Edit Category' : 'New Category'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 bg-secondary border-border/50" required />
              {name && (
                <p className="mt-1 text-xs text-muted-foreground">Slug: <span className="font-mono text-foreground">{toSlug(name)}</span></p>
              )}
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Description</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 bg-secondary border-border/50" />
            </div>
            <Button type="submit" className="w-full">{editing ? 'Update Category' : 'Create Category'}</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="bg-card border-border/50 max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Delete Category</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone. Are you sure?</p>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" className="flex-1 border-border/50" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" className="flex-1" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
