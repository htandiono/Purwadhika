import { Trash2 } from "lucide-react";
import { Product } from "../../types/product";
import { Alert } from "../ui/Alert";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";

type DeleteProductDialogProps = {
  product: Product | null;
  error?: string | null;
  isDeleting?: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
};

export function DeleteProductDialog({
  error,
  isDeleting = false,
  onCancel,
  onConfirm,
  product
}: DeleteProductDialogProps) {
  return (
    <Modal onClose={onCancel} open={Boolean(product)} title="Delete Product">
      <div className="space-y-5">
        {error ? <Alert variant="error">{error}</Alert> : null}
        <p className="text-sm leading-6 text-slate-700">
          Delete <span className="font-semibold text-slate-950">{product?.name}</span> with SKU{" "}
          <span className="font-semibold text-slate-950">{product?.sku}</span>? This action cannot be undone.
        </p>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button onClick={onCancel} variant="secondary">
            Cancel
          </Button>
          <Button
            icon={<Trash2 className="h-4 w-4" />}
            isLoading={isDeleting}
            onClick={onConfirm}
            variant="danger"
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
