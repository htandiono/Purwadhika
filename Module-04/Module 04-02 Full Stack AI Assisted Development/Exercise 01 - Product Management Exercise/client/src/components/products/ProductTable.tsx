import { Edit3, Trash2 } from "lucide-react";
import { Product } from "../../types/product";
import { formatCurrency } from "../../utils/currency";
import { Button } from "../ui/Button";
import { ProductStatusBadge } from "./ProductStatusBadge";

type ProductTableProps = {
  products: Product[];
  isLoading?: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

export function ProductTable({ isLoading = false, onDelete, onEdit, products }: ProductTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[860px] w-full table-fixed divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="w-[24%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-normal text-slate-500">
                Product
              </th>
              <th className="w-[14%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-normal text-slate-500">
                SKU
              </th>
              <th className="w-[16%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-normal text-slate-500">
                Category
              </th>
              <th className="w-[12%] px-4 py-3 text-right text-xs font-semibold uppercase tracking-normal text-slate-500">
                Price
              </th>
              <th className="w-[10%] px-4 py-3 text-right text-xs font-semibold uppercase tracking-normal text-slate-500">
                Stock
              </th>
              <th className="w-[16%] px-4 py-3 text-center text-xs font-semibold uppercase tracking-normal text-slate-500">
                Status
              </th>
              <th className="w-[8%] px-4 py-3 text-right text-xs font-semibold uppercase tracking-normal text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {Array.from({ length: 7 }).map((__, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-4">
                      <div className="h-4 animate-pulse rounded bg-slate-200" />
                    </td>
                  ))}
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td className="px-4 py-12 text-center text-sm text-slate-500" colSpan={7}>
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr className="hover:bg-slate-50" key={product.id}>
                  <td className="px-4 py-4">
                    <p className="truncate text-sm font-medium text-slate-950">{product.name}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="truncate font-mono text-sm text-slate-700">{product.sku}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="truncate text-sm text-slate-700">{product.category}</p>
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-medium text-slate-950">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-4 py-4 text-right text-sm text-slate-700">{product.stock}</td>
                  <td className="px-4 py-4 text-center">
                    <ProductStatusBadge status={product.status} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        aria-label={`Edit ${product.name}`}
                        icon={<Edit3 className="h-4 w-4" />}
                        onClick={() => onEdit(product)}
                        size="icon"
                        title="Edit"
                        variant="secondary"
                      />
                      <Button
                        aria-label={`Delete ${product.name}`}
                        icon={<Trash2 className="h-4 w-4" />}
                        onClick={() => onDelete(product)}
                        size="icon"
                        title="Delete"
                        variant="secondary"
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
