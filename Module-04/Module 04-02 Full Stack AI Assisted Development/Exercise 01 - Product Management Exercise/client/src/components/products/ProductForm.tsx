import { FormEvent, useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Product, ProductFormValues, ProductStatus } from "../../types/product";
import { productStatusOptions } from "../../utils/productStatus";
import { validateProductForm } from "../../utils/validation";
import { Alert } from "../ui/Alert";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

type ProductFormDraft = {
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: string;
  status: ProductStatus;
};

type ProductFormProps = {
  product?: Product | null;
  submitLabel: string;
  isSubmitting?: boolean;
  error?: string | null;
  onCancel: () => void;
  onSubmit: (values: ProductFormValues) => Promise<void>;
};

function getInitialValues(product?: Product | null): ProductFormDraft {
  return {
    name: product?.name ?? "",
    sku: product?.sku ?? "",
    category: product?.category ?? "",
    price: product?.price ? String(product.price) : "",
    stock: product ? String(product.stock) : "0",
    status: product?.status ?? "ACTIVE"
  };
}

export function ProductForm({
  error,
  isSubmitting = false,
  onCancel,
  onSubmit,
  product,
  submitLabel
}: ProductFormProps) {
  const [values, setValues] = useState<ProductFormDraft>(() => getInitialValues(product));
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormDraft, string>>>({});

  useEffect(() => {
    setValues(getInitialValues(product));
    setErrors({});
  }, [product]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = validateProductForm(values);
    setErrors(result.errors);

    if (Object.keys(result.errors).length > 0) {
      return;
    }

    await onSubmit(result.values);
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error ? <Alert variant="error">{error}</Alert> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          autoFocus
          error={errors.name}
          label="Product name"
          onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
          value={values.name}
        />
        <Input
          error={errors.sku}
          label="SKU"
          onChange={(event) => setValues((current) => ({ ...current, sku: event.target.value }))}
          value={values.sku}
        />
        <Input
          error={errors.category}
          label="Category"
          onChange={(event) => setValues((current) => ({ ...current, category: event.target.value }))}
          value={values.category}
        />
        <Select
          label="Status"
          onChange={(event) =>
            setValues((current) => ({ ...current, status: event.target.value as ProductStatus }))
          }
          options={productStatusOptions}
          value={values.status}
        />
        <Input
          error={errors.price}
          label="Price"
          min="0"
          onChange={(event) => setValues((current) => ({ ...current, price: event.target.value }))}
          step="0.01"
          type="number"
          value={values.price}
        />
        <Input
          error={errors.stock}
          label="Stock"
          min="0"
          onChange={(event) => setValues((current) => ({ ...current, stock: event.target.value }))}
          step="1"
          type="number"
          value={values.stock}
        />
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        <Button onClick={onCancel} variant="secondary">
          Cancel
        </Button>
        <Button icon={<Save className="h-4 w-4" />} isLoading={isSubmitting} type="submit">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
