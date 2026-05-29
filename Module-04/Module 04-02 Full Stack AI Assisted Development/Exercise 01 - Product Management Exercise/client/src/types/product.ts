export type ProductStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "LOW_STOCK"
  | "OUT_OF_STOCK"
  | "DRAFT"
  | "ARCHIVED";

export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: number;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
};

export type ProductFormValues = {
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
};

export type ProductListQuery = {
  search?: string;
  category?: string;
  status?: ProductStatus;
  page?: number;
  limit?: number;
  sortBy?: "name" | "sku" | "category" | "price" | "stock" | "status" | "createdAt";
  sortOrder?: "asc" | "desc";
};

export type ProductListMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
