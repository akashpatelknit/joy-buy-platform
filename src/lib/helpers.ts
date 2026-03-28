import { Product } from "@/services/api";

export const getPrimaryImage = (product: Product) => {
  console.log("product", product);
  if (!product.images) return "";
  if (product?.imageUrl) return product.imageUrl;
  return product.images.find((i) => i.isPrimary)?.imageUrl;
};
