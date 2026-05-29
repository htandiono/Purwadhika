import { ProductStatus } from "../types/product";

export const productStatusOptions: Array<{ label: string; value: ProductStatus }> = [
  { label: "Active", value: "ACTIVE" },
  { label: "Draft", value: "DRAFT" },
  { label: "Out of Stock", value: "OUT_OF_STOCK" },
  { label: "Archived", value: "ARCHIVED" }
];

export const productStatusLabels: Record<ProductStatus, string> = {
  ACTIVE: "Active",
  DRAFT: "Draft",
  OUT_OF_STOCK: "Out of Stock",
  ARCHIVED: "Archived"
};
