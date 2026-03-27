import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('API Error:', error.message);
    return Promise.reject(error);
  }
);

export interface Category {
  id: number;
  name: string;
  description?: string;
  slug?: string;
  productCount?: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  imageUrl: string;
  category?: Category;
  categoryId?: number;
  stock?: number;
  rating?: number;
  reviewCount?: number;
}

export interface Review {
  id: number;
  productId: number;
  reviewer: string;
  rating: number;
  comment: string;
  date: string;
}

// Category API
export const categoryApi = {
  getAll: () => api.get<Category[]>('/categories').then(r => r.data),
  create: (data: Omit<Category, 'id'>) => api.post<Category>('/categories', data).then(r => r.data),
  update: (id: number, data: Omit<Category, 'id'>) => api.put<Category>(`/categories/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/categories/${id}`),
};

// Product API
export const productApi = {
  getAll: () => api.get<Product[]>('/products').then(r => r.data),
  create: (data: Omit<Product, 'id'>) => api.post<Product>('/products', data).then(r => r.data),
  update: (id: number, data: Omit<Product, 'id'>) => api.put<Product>(`/products/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/products/${id}`),
};

export default api;
