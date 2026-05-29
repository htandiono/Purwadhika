import { ProductStatus } from "../../types/product";
import { productStatusLabels } from "../../utils/productStatus";
import { cn } from "../../utils/cn";

const statusStyles: Record<ProductStatus, string> = {
  ACTIVE: "bg-blue-50 text-blue-700 ring-blue-200",
  INACTIVE: "bg-slate-100 text-slate-600 ring-slate-300",
  LOW_STOCK: "bg-amber-50 text-amber-700 ring-amber-200",
  DRAFT: "bg-slate-100 text-slate-700 ring-slate-300",
  OUT_OF_STOCK: "bg-rose-50 text-rose-700 ring-rose-200",
  ARCHIVED: "bg-zinc-100 text-zinc-700 ring-zinc-300"
};

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  return (
    <span
      className={cn(
        "inline-flex min-w-24 items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
        statusStyles[status]
      )}
    >
      {productStatusLabels[status]}
    </span>
  );
}
