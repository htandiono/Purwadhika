import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Ban,
  Boxes,
  Layers3,
  PackagePlus,
  RotateCcw,
  Search,
  Tags
} from "lucide-react";
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
import { productStatusLabels, productStatusOptions } from "../utils/productStatus";
import { cn } from "../utils/cn";

type FilterState = {
  search: string;
  category: string;
  status: "" | ProductStatus;
};

type StatCardProps = {
  label: string;
  value: string | number;
  detail: string;
  icon: typeof Boxes;
  tone: "blue" | "amber" | "rose" | "slate" | "violet";
};

const statusFilterOptions = [{ label: "All statuses", value: "" }, ...productStatusOptions];

const cardTones: Record<StatCardProps["tone"], string> = {
  blue: "bg-blue-50 text-blue-700 ring-blue-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  rose: "bg-rose-50 text-rose-700 ring-rose-100",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
  violet: "bg-violet-50 text-violet-700 ring-violet-100"
};

function StatCard({ detail, icon: Icon, label, tone, value }: StatCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold uppercase tracking-normal text-slate-500">{label}</p>
          <p className="mt-2 truncate text-2xl font-semibold text-slate-950">{value}</p>
        </div>
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1", cardTones[tone])}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      <p className="mt-3 truncate text-xs text-slate-500">{detail}</p>
    </div>
  );
}

export function DashboardPage() {
  const { error, isLoading, loadProducts, meta, products, query, updateQuery } = useProducts();
  const [filters, setFilters] = useState<FilterState>({ search: "", category: "", status: "" });
  const [summaryProducts, setSummaryProducts] = useState<Product[]>([]);
  const [summaryTotal, setSummaryTotal] = useState<number | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadSummaryProducts = useCallback(async () => {
    setSummaryError(null);

    try {
      const response = await productsApi.list({
        limit: 100,
        page: 1,
        sortBy: "category",
        sortOrder: "asc"
      });
      setSummaryProducts(response.data ?? []);
      setSummaryTotal(response.meta?.total ?? null);
    } catch (requestError) {
      setSummaryError(
        requestError instanceof Error ? requestError.message : "Unable to load dashboard metrics"
      );
    }
  }, []);

  useEffect(() => {
    void loadSummaryProducts();
  }, [loadSummaryProducts]);

  const summarySource = summaryProducts.length > 0 ? summaryProducts : products;

  const stats = useMemo(() => {
    const inventoryValue = summarySource.reduce(
      (total, product) => total + Number(product.price) * product.stock,
      0
    );
    const lowStock = summarySource.filter(
      (product) => product.status === "LOW_STOCK" || (product.stock > 0 && product.stock <= 10)
    ).length;
    const outOfStock = summarySource.filter(
      (product) => product.status === "OUT_OF_STOCK" || product.stock === 0
    ).length;
    const active = summarySource.filter((product) => product.status === "ACTIVE").length;
    const inactive = summarySource.filter((product) =>
      ["INACTIVE", "DRAFT", "ARCHIVED"].includes(product.status)
    ).length;
    const categoryCounts = summarySource.reduce<Record<string, number>>((acc, product) => {
      acc[product.category] = (acc[product.category] ?? 0) + 1;
      return acc;
    }, {});
    const categoryBreakdown = Object.entries(categoryCounts)
      .map(([category, count]) => ({
        category,
        count,
        percentage: summarySource.length === 0 ? 0 : Math.round((count / summarySource.length) * 100)
      }))
      .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category));
    const statusCounts = summarySource.reduce<Record<ProductStatus, number>>((acc, product) => {
      acc[product.status] = (acc[product.status] ?? 0) + 1;
      return acc;
    }, {} as Record<ProductStatus, number>);

    return {
      total: summaryTotal ?? meta.total,
      active,
      inactive,
      lowStock,
      outOfStock,
      categoryBreakdown,
      statusCounts,
      inventoryValue
    };
  }, [meta.total, summarySource, summaryTotal]);

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

  async function refreshDashboardData() {
    await Promise.all([loadProducts(), loadSummaryProducts()]);
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
      await refreshDashboardData();
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
      await refreshDashboardData();
    } catch (requestError) {
      setDeleteError(requestError instanceof Error ? requestError.message : "Unable to delete product");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-normal text-blue-600">Product overview</p>
          <h2 className="mt-1 truncate text-2xl font-semibold text-slate-950">Inventory dashboard</h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            Monitor product status, stock risk, categories, and pricing from one operational view.
          </p>
        </div>
        <Button className="w-full sm:w-auto" icon={<PackagePlus className="h-4 w-4" />} onClick={openCreateModal}>
          Add Product
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard detail="Across all seeded and manual records" icon={Boxes} label="Total products" tone="blue" value={stats.total} />
        <StatCard detail={`${stats.inactive} inactive records`} icon={Activity} label="Active products" tone="violet" value={stats.active} />
        <StatCard detail="Products at or below stock threshold" icon={AlertTriangle} label="Low stock" tone="amber" value={stats.lowStock} />
        <StatCard detail="Unavailable inventory" icon={Ban} label="Out of stock" tone="rose" value={stats.outOfStock} />
        <StatCard detail="Estimated stocked value" icon={Tags} label="Inventory value" tone="slate" value={formatCurrency(stats.inventoryValue)} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-950">Products by category</h3>
              <p className="mt-1 text-xs text-slate-500">Distribution across the loaded catalog sample</p>
            </div>
            <div className="rounded-md bg-blue-50 p-2 text-blue-600">
              <Layers3 className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {stats.categoryBreakdown.map((item) => (
              <div className="space-y-2" key={item.category}>
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="truncate font-medium text-slate-700">{item.category}</span>
                  <span className="shrink-0 text-slate-500">{item.count} products</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${Math.max(item.percentage, 5)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-950">Active vs inactive</h3>
              <p className="mt-1 text-xs text-slate-500">Status health across product records</p>
            </div>
            <div className="rounded-md bg-blue-50 p-2 text-blue-600">
              <Activity className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {(["ACTIVE", "INACTIVE", "LOW_STOCK", "OUT_OF_STOCK"] as ProductStatus[]).map((status) => {
              const count = stats.statusCounts[status] ?? 0;
              const percentage = summarySource.length === 0 ? 0 : Math.round((count / summarySource.length) * 100);

              return (
                <div className="space-y-2" key={status}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{productStatusLabels[status]}</span>
                    <span className="text-slate-500">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className={cn(
                        "h-2 rounded-full",
                        status === "ACTIVE" && "bg-blue-500",
                        status === "INACTIVE" && "bg-slate-400",
                        status === "LOW_STOCK" && "bg-amber-500",
                        status === "OUT_OF_STOCK" && "bg-rose-500"
                      )}
                      style={{ width: `${Math.max(percentage, count > 0 ? 5 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
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

      {summaryError ? <Alert variant="error">{summaryError}</Alert> : null}
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
