import { apiRequest } from "./http";
import {
  Product,
  ProductFormValues,
  ProductListMeta,
  ProductListQuery
} from "../types/product";

function toSearchParams(query: ProductListQuery = {}) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  return params.toString();
}

export const productsApi = {
  list(query: ProductListQuery = {}) {
    const search = toSearchParams(query);
    return apiRequest<Product[], ProductListMeta>(`/products${search ? `?${search}` : ""}`);
  },
  getById(id: string) {
    return apiRequest<Product>(`/products/${id}`);
  },
  create(payload: ProductFormValues) {
    return apiRequest<Product>("/products", {
      method: "POST",
      body: payload
    });
  },
  update(id: string, payload: Partial<ProductFormValues>) {
    return apiRequest<Product>(`/products/${id}`, {
      method: "PATCH",
      body: payload
    });
  },
  remove(id: string) {
    return apiRequest<void>(`/products/${id}`, {
      method: "DELETE"
    });
  }
};
