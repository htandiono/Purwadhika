import { ProductFormValues, ProductStatus } from "../types/product";

type ProductFormDraft = {
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: string;
  status: ProductStatus;
};

export function validateProductForm(values: ProductFormDraft) {
  const errors: Partial<Record<keyof ProductFormDraft, string>> = {};
  const price = Number(values.price);
  const stock = Number(values.stock);

  if (values.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (values.sku.trim().length < 2) {
    errors.sku = "SKU must be at least 2 characters";
  }

  if (values.category.trim().length < 2) {
    errors.category = "Category must be at least 2 characters";
  }

  if (!Number.isFinite(price) || price < 0) {
    errors.price = "Price must be zero or greater";
  }

  if (!Number.isInteger(stock) || stock < 0) {
    errors.stock = "Stock must be a whole number zero or greater";
  }

  return {
    errors,
    values: {
      name: values.name.trim(),
      sku: values.sku.trim(),
      category: values.category.trim(),
      price,
      stock,
      status: values.status
    } satisfies ProductFormValues
  };
}
