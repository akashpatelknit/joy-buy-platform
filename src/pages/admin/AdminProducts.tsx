import { useEffect, useState, useMemo } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ArrowUpDown,
  ImagePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProductStore } from "@/stores/useProductStore";
import { productApi, productImageApi, type Product } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { getPrimaryImage } from "@/lib/helpers";

type SortKey = "name" | "price";

export default function AdminProducts() {
  const { products, categories, fetchProducts, fetchCategories } =
    useProductStore();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStock] = useState("");
  const [rating, setRating] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sku, setSku] = useState("");

  // ── Image upload modal state ──────────────────────────────────────────────
  const [imageOpen, setImageOpen] = useState(false);
  const [imageTargetProduct, setImageTargetProduct] = useState<Product | null>(
    null,
  );
  const [imgUrl, setImgUrl] = useState("");
  const [imgAltText, setImgAltText] = useState("");
  const [imgIsPrimary, setImgIsPrimary] = useState(false);
  const [imgSortOrder, setImgSortOrder] = useState("");
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const filtered = useMemo(() => {
    let result = products;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q),
      );
    }
    result = [...result].sort((a, b) => {
      const mul = sortAsc ? 1 : -1;
      if (sortKey === "price") return (a.price - b.price) * mul;
      return a.name.localeCompare(b.name) * mul;
    });
    return result;
  }, [products, search, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
    setRating("");
    setImageUrl("");
    setCategoryId("");
    setOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setName(p.name);
    setDescription(p.description || "");
    setPrice(String(p.price));
    setStock(String(p.stockQuantity || 0));
    setRating(String(p.rating || 0));
    setImageUrl(getPrimaryImage(p));
    setCategoryId(String(p.categoryId || p.category?.id || ""));
    setSku(p.sku);
    setOpen(true);
  };

  // ── Image upload handlers ─────────────────────────────────────────────────
  const openImageUpload = (p: Product) => {
    setImageTargetProduct(p);
    setImgUrl("");
    setImgAltText("");
    setImgIsPrimary(false);
    setImgSortOrder("");
    setImageOpen(true);
  };

  const handleImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageTargetProduct) return;
    const data = {
      imageUrl: imgUrl,
      altText: imgAltText,
      isPrimary: imgIsPrimary,
      sortOrder: imgSortOrder ? parseInt(imgSortOrder) : undefined,
    };
    try {
      await productImageApi.addImage(String(imageTargetProduct.id), data as any);
      toast({ title: "Image added successfully" });
      fetchProducts();
      setImageOpen(false);
    } catch {
      toast({
        title: "Error",
        description: "Failed to upload image. Backend may be offline.",
        variant: "destructive",
      });
    }
  };
  // ─────────────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name,
      description,
      price: parseFloat(price),
      stockQuantity: parseInt(stockQuantity || "0"),
      rating: parseFloat(rating || "0"),
      imageUrl,
      categoryId,
      sku: sku,
    };
    try {
      if (editing) {
        await productApi.update(editing.id, data as any);
        toast({ title: "Product updated" });
      } else {
        await productApi.create(data as any);
        toast({ title: "Product created" });
      }
      fetchProducts();
      setOpen(false);
    } catch {
      toast({
        title: "Error",
        description: "Failed to save. Backend may be offline.",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await productApi.delete(deleteId);
      toast({ title: "Product deleted" });
      fetchProducts();
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete.",
        variant: "destructive",
      });
    }
    setConfirmOpen(false);
    setDeleteId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Products
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your product catalog
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="mt-6 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-secondary border-border/50"
        />
      </div>

      <div className="mt-4 rounded-xl border border-border/50 bg-card overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-widest text-muted-foreground">
                Image
              </TableHead>
              <TableHead
                className="cursor-pointer text-xs uppercase tracking-widest text-muted-foreground"
                onClick={() => toggleSort("name")}
              >
                <span className="flex items-center gap-1">
                  Name <ArrowUpDown className="h-3 w-3" />
                </span>
              </TableHead>
              <TableHead className="text-xs uppercase tracking-widest text-muted-foreground">
                Category
              </TableHead>
              <TableHead
                className="cursor-pointer text-xs uppercase tracking-widest text-muted-foreground"
                onClick={() => toggleSort("price")}
              >
                <span className="flex items-center gap-1">
                  Price <ArrowUpDown className="h-3 w-3" />
                </span>
              </TableHead>
              <TableHead className="text-xs uppercase tracking-widest text-muted-foreground">
                Stock
              </TableHead>
              <TableHead className="text-right text-xs uppercase tracking-widest text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow
                key={p.id}
                className="border-border/30 hover:bg-secondary/50"
              >
                <TableCell>
                  <img
                    src={getPrimaryImage(p)}
                    alt={p.name}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium text-card-foreground">
                  {p.name}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {p.categoryName || "—"}
                </TableCell>
                <TableCell className="font-semibold text-primary">
                  $
                  {p.price.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell>
                  <span
                    className={`text-sm ${(p.stockQuantity || 0) <= 5 ? "text-destructive" : "text-muted-foreground"}`}
                  >
                    {p.stockQuantity ?? "—"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {/* ── New: Upload Image button ── */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => openImageUpload(p)}
                    title="Upload image"
                  >
                    <ImagePlus className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => openEdit(p)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => confirmDelete(p.id)}
                  >
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
            <DialogTitle className="font-display">
              {editing ? "Edit Product" : "New Product"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 bg-secondary border-border/50"
                required
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">
                Description
              </Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 bg-secondary border-border/50"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1 bg-secondary border-border/50"
                  required
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Stock</Label>
                <Input
                  type="number"
                  value={stockQuantity}
                  onChange={(e) => setStock(e.target.value)}
                  className="mt-1 bg-secondary border-border/50"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  Rating (0-5)
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="mt-1 bg-secondary border-border/50"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Image URL</Label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="mt-1 bg-secondary border-border/50"
                required
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">
                  Category
                </Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger className="mt-1 bg-secondary border-border/50">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border/50">
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">SKU</Label>
                <Input
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="mt-1 bg-secondary border-border/50"
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              {editing ? "Update Product" : "Create Product"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Image Upload Modal ──────────────────────────────────────────────── */}
      <Dialog open={imageOpen} onOpenChange={setImageOpen}>
        <DialogContent className="bg-card border-border/50">
          <DialogHeader>
            <div className="h-0.5 w-12 bg-primary rounded-full mb-2" />
            <DialogTitle className="font-display">Upload Image</DialogTitle>
            {imageTargetProduct && (
              <p className="text-xs text-muted-foreground pt-0.5">
                {imageTargetProduct.name}
              </p>
            )}
          </DialogHeader>
          <form onSubmit={handleImageSubmit} className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Image URL</Label>
              <Input
                placeholder="https://images.unsplash.com/..."
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
                className="mt-1 bg-secondary border-border/50"
                required
              />
            </div>

            {/* Live preview */}
            {imgUrl && (
              <div className="rounded-lg overflow-hidden border border-border/40 bg-secondary h-36 flex items-center justify-center">
                <img
                  src={imgUrl}
                  alt="preview"
                  className="h-full w-full object-contain"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).style.display = "none")
                  }
                />
              </div>
            )}

            <div>
              <Label className="text-xs text-muted-foreground">Alt Text</Label>
              <Input
                placeholder="Laptop on desk"
                value={imgAltText}
                onChange={(e) => setImgAltText(e.target.value)}
                className="mt-1 bg-secondary border-border/50"
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">
                Sort Order
              </Label>
              <Input
                type="number"
                min="0"
                placeholder="0"
                value={imgSortOrder}
                onChange={(e) => setImgSortOrder(e.target.value)}
                className="mt-1 bg-secondary border-border/50"
              />
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <Checkbox
                id="isPrimary"
                checked={imgIsPrimary}
                onCheckedChange={(v) => setImgIsPrimary(Boolean(v))}
                className="border-border/60"
              />
              <Label
                htmlFor="isPrimary"
                className="text-sm text-muted-foreground cursor-pointer select-none"
              >
                Set as primary image
              </Label>
            </div>

            <Button type="submit" className="w-full">
              Upload Image
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      {/* ─────────────────────────────────────────────────────────────────────── */}

      {/* Delete Confirmation */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="bg-card border-border/50 max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Delete Product</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. Are you sure you want to delete this
            product?
          </p>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              className="flex-1 border-border/50"
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
