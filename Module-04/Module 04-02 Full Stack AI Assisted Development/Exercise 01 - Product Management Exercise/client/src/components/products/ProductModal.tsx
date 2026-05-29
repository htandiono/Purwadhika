import { Product, ProductFormValues } from "../../types/product";
import { Modal } from "../ui/Modal";
import { ProductForm } from "./ProductForm";

type ProductModalProps = {
  open: boolean;
  mode: "create" | "edit";
  product?: Product | null;
  isSubmitting?: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (values: ProductFormValues) => Promise<void>;
};

export function ProductModal({
  error,
  isSubmitting,
  mode,
  onClose,
  onSubmit,
  open,
  product
}: ProductModalProps) {
  const isEdit = mode === "edit";

  return (
    <Modal
      description={isEdit ? "Update product details and stock status." : "Create a new product record."}
      onClose={onClose}
      open={open}
      title={isEdit ? "Edit Product" : "Add Product"}
    >
      <ProductForm
        error={error}
        isSubmitting={isSubmitting}
        onCancel={onClose}
        onSubmit={onSubmit}
        product={isEdit ? product : null}
        submitLabel={isEdit ? "Save Changes" : "Create Product"}
      />
    </Modal>
  );
}
