import { FormEvent, useMemo, useState } from "react";
import { PackagePlus, RotateCcw, Search } from "lucide-react";
import { productsApi } from "../api/productsApi";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { DeleteProductDialog } from "../components/products/DeleteProductDialog";
import { ProductModal } from "../components/products/ProductModal";
import { ProductTable } from "../components/products/ProductTable";
import { useProducts } from "../hooks/useProducts";
import { Product, ProductFormValues, ProductStatus } from "../types/product";
import { formatCurrency } from "../utils/currency";
import { productStatusOptions } from "../utils/productStatus";

type FilterState = {
  search: string;
  category: string;
  status: "" | ProductStatus;
};

const statusFilterOptions = [{ label: "All statuses", value: "" }, ...productStatusOptions];

export function DashboardPage() {
  const { error, isLoading, loadProducts, meta, products, query, updateQuery } = useProducts();
  const [filters, setFilters] = useState<FilterState>({ search: "", category: "", status: "" });
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const stats = useMemo(() => {
    const inventoryValue = products.reduce(
      (total, product) => total + Number(product.price) * product.stock,
      0
    );

    return {
      total: meta.total,
      active: products.filter((product) => product.status === "ACTIVE").length,
      lowStock: products.filter((product) => product.stock <= 5).length,
      inventoryValue
    };
  }, [meta.total, products]);

  function handleApplyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateQuery({
      search: filters.search.trim() || undefined,
      category: filters.category.trim() || undefined,
      status: filters.status || undefined
    });
  }

  function handleResetFilters() {
    setFilters({ search: "", category: "", status: "" });
    updateQuery({
      search: undefined,
      category: undefined,
      status: undefined
    });
  }

  function openCreateModal() {
    setModalMode("create");
    setSelectedProduct(null);
    setModalError(null);
    setIsProductModalOpen(true);
  }

  function openEditModal(product: Product) {
    setModalMode("edit");
    setSelectedProduct(product);
    setModalError(null);
    setIsProductModalOpen(true);
  }

  async function handleSubmitProduct(values: ProductFormValues) {
    setIsSubmitting(true);
    setModalError(null);

    try {
      if (modalMode === "edit" && selectedProduct) {
        await productsApi.update(selectedProduct.id, values);
      } else {
        await productsApi.create(values);
      }

      setSelectedProduct(null);
      setIsProductModalOpen(false);
      await loadProducts();
    } catch (requestError) {
      setModalError(requestError instanceof Error ? requestError.message : "Unable to save product");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await productsApi.remove(deleteTarget.id);
      setDeleteTarget(null);
      await loadProducts();
    } catch (requestError) {
      setDeleteError(requestError instanceof Error ? requestError.message : "Unable to delete product");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">Products</h2>
          <p className="mt-1 text-sm text-slate-600">Manage product records, stock levels, pricing, and status.</p>
        </div>
        <Button icon={<PackagePlus className="h-4 w-4" />} onClick={openCreateModal}>
          Add Product
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total products</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">{stats.total}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Active on page</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-700">{stats.active}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Low stock on page</p>
          <p className="mt-2 text-2xl font-semibold text-amber-700">{stats.lowStock}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Page inventory value</p>
          <p className="mt-2 truncate text-2xl font-semibold text-slate-950">{formatCurrency(stats.inventoryValue)}</p>
        </div>
      </div>

      <form
        className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_180px_auto_auto]"
        onSubmit={handleApplyFilters}
      >
        <Input
          aria-label="Search products"
          onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
          placeholder="Search name or SKU"
          value={filters.search}
        />
        <Input
          aria-label="Filter by category"
          onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))}
          placeholder="Category"
          value={filters.category}
        />
        <Select
          aria-label="Filter by status"
          onChange={(event) =>
            setFilters((current) => ({ ...current, status: event.target.value as FilterState["status"] }))
          }
          options={statusFilterOptions}
          value={filters.status}
        />
        <Button icon={<Search className="h-4 w-4" />} type="submit">
          Search
        </Button>
        <Button icon={<RotateCcw className="h-4 w-4" />} onClick={handleResetFilters} variant="secondary">
          Reset
        </Button>
      </form>

      {error ? <Alert variant="error">{error}</Alert> : null}

      <ProductTable
        isLoading={isLoading}
        onDelete={(product) => {
          setDeleteError(null);
          setDeleteTarget(product);
        }}
        onEdit={openEditModal}
        products={products}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          Page {meta.page} of {Math.max(meta.totalPages, 1)} · {meta.total} total products
        </p>
        <div className="flex gap-2">
          <Button
            disabled={(query.page ?? 1) <= 1}
            onClick={() => updateQuery({ page: Math.max((query.page ?? 1) - 1, 1) })}
            variant="secondary"
          >
            Previous
          </Button>
          <Button
            disabled={(query.page ?? 1) >= Math.max(meta.totalPages, 1)}
            onClick={() => updateQuery({ page: (query.page ?? 1) + 1 })}
            variant="secondary"
          >
            Next
          </Button>
        </div>
      </div>

      <ProductModal
        error={modalError}
        isSubmitting={isSubmitting}
        mode={modalMode}
        onClose={() => {
          setModalError(null);
          setSelectedProduct(null);
          setIsProductModalOpen(false);
        }}
        onSubmit={handleSubmitProduct}
        open={isProductModalOpen}
        product={selectedProduct}
      />

      <DeleteProductDialog
        error={deleteError}
        isDeleting={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        product={deleteTarget}
      />
    </div>
  );
}
