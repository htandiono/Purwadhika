import { Edit3, PackageSearch, Trash2 } from "lucide-react";
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
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-950">Product inventory</h3>
          <p className="text-xs text-slate-500">Live data from the product API</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[940px] w-full table-fixed divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="w-[25%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-normal text-slate-500">
                Product
              </th>
              <th className="w-[15%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-normal text-slate-500">
                SKU
              </th>
              <th className="w-[18%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-normal text-slate-500">
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
              <th className="w-[9%] px-4 py-3 text-right text-xs font-semibold uppercase tracking-normal text-slate-500">
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
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <PackageSearch className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">No products found</p>
                      <p className="mt-1 text-slate-500">Adjust the filters or add a new product.</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr className="transition hover:bg-blue-50/40" key={product.id}>
                  <td className="px-4 py-4">
                    <p className="truncate text-sm font-medium text-slate-950">{product.name}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="truncate rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700">{product.sku}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex max-w-full items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      <span className="truncate">{product.category}</span>
                    </span>
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
