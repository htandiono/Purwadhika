import { ProductStatus } from "../types/product";

export const productStatusOptions: Array<{ label: string; value: ProductStatus }> = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Low Stock", value: "LOW_STOCK" },
  { label: "Out of Stock", value: "OUT_OF_STOCK" }
];

export const productStatusLabels: Record<ProductStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  LOW_STOCK: "Low Stock",
  DRAFT: "Draft",
  OUT_OF_STOCK: "Out of Stock",
  ARCHIVED: "Archived"
};
