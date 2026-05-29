import { z } from "zod";

export const productStatuses = [
  "ACTIVE",
  "INACTIVE",
  "LOW_STOCK",
  "OUT_OF_STOCK",
  "DRAFT",
  "ARCHIVED"
] as const;
export const productSortFields = ["name", "sku", "category", "price", "stock", "status", "createdAt"] as const;

export const productIdParamSchema = z.object({
  id: z.string().uuid("Product id must be a valid UUID")
});

export const createProductBodySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  sku: z.string().trim().min(2, "SKU must be at least 2 characters"),
  category: z.string().trim().min(2, "Category must be at least 2 characters"),
  price: z.coerce.number().nonnegative("Price cannot be negative"),
  stock: z.coerce.number().int("Stock must be a whole number").nonnegative("Stock cannot be negative"),
  status: z.enum(productStatuses).default("ACTIVE")
});

export const updateProductBodySchema = createProductBodySchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one product field must be provided"
  });

export const productQuerySchema = z.object({
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  status: z.enum(productStatuses).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.enum(productSortFields).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc")
});

export type CreateProductInput = z.infer<typeof createProductBodySchema>;
export type UpdateProductInput = z.infer<typeof updateProductBodySchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
