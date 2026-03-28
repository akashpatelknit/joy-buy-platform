import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn("API Error:", error.message);
    return Promise.reject(error);
  },
);

export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  parentId?: string | null;
  slug: string;
}

export interface ProductImages {
  id: string;
  imageUrl: string;
  altText: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  sku: string;
  status: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";
  stockQuantity: number;
  categoryName: string;
  categoryId: string;
  images: ProductImages[];
}

export interface Review {
  id: number;
  productId: number;
  reviewer: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ProductImageRequest {
  imageUrl: string;
  isPrimary?: boolean;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  productId: string;
}

// Category API
export const categoryApi = {
  getAll: () => api.get<Category[]>("/categories").then((r) => r.data),
  create: (data: Omit<Category, "id">) =>
    api.post<Category>("/categories", data).then((r) => r.data),
  update: (id: number, data: Omit<Category, "id">) =>
    api.put<Category>(`/categories/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/categories/${id}`),
};

// Product API
export const productApi = {
  getAll: () => api.get<Product[]>("/products").then((r) => r.data),
  create: (data: Omit<Product, "id">) =>
    api.post<Product>("/products", data).then((r) => r.data),
  update: (id: number, data: Omit<Product, "id">) =>
    api.put<Product>(`/products/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/products/${id}`),
};

export const productImageApi = {
  addImage: (productId: string, data: ProductImageRequest) =>
    api
      .post<ProductImage>(`/product-images/${productId}`, data)
      .then((r) => r.data),

  getByProduct: (productId: string) =>
    api
      .get<ProductImage[]>(`/product-images/product/${productId}`)
      .then((r) => r.data),

  delete: (imageId: string) => api.delete(`/product-images/${imageId}`),
};

export default api;
