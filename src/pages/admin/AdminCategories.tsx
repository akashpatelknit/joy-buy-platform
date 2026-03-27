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

export default function AdminCategories() {
  const { categories, fetchCategories } = useProductStore();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

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
      toast({ title: 'Error', description: 'Failed to save category. Backend may be offline.', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await categoryApi.delete(id);
      toast({ title: 'Category deleted' });
      fetchCategories();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete. Backend may be offline.', variant: 'destructive' });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground text-sm">Manage product categories</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" /> Add Category</Button>
      </div>

      <div className="mt-6 rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.id}</TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell className="text-muted-foreground">{c.description || '—'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(c.id)}><Trash2 className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Category' : 'Create Category'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label htmlFor="cat-name">Name</Label><Input id="cat-name" value={name} onChange={(e) => setName(e.target.value)} required /></div>
            <div><Label htmlFor="cat-desc">Description</Label><Input id="cat-desc" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
            <Button type="submit" className="w-full">{editing ? 'Update' : 'Create'}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
