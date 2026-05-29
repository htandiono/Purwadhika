import { useCallback, useEffect, useState } from "react";
import { productsApi } from "../api/productsApi";
import { Product, ProductListMeta, ProductListQuery } from "../types/product";

const defaultMeta: ProductListMeta = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0
};

const defaultQuery: ProductListQuery = {
  page: 1,
  limit: 10,
  sortBy: "createdAt",
  sortOrder: "desc"
};

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<ProductListMeta>(defaultMeta);
  const [query, setQuery] = useState<ProductListQuery>(defaultQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await productsApi.list(query);
      setProducts(response.data ?? []);
      setMeta(response.meta ?? defaultMeta);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load products");
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const updateQuery = useCallback((nextQuery: ProductListQuery) => {
    setQuery((current) => ({
      ...current,
      ...nextQuery,
      page: nextQuery.page ?? 1
    }));
  }, []);

  return {
    products,
    meta,
    query,
    isLoading,
    error,
    loadProducts,
    updateQuery
  };
}
