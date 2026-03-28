import { Product } from "@/services/api";

export const getPrimaryImage = (product: Product) => {
  if (product?.imageUrl) return product.imageUrl;
  if (!product.images) return "";
  return product.images.find((i) => i.isPrimary)?.imageUrl || product.images[0]?.imageUrl || "";
};
