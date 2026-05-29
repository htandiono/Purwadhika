import { Prisma } from "@prisma/client";
import { prisma } from "../prisma/client";
import { ApiError } from "../utils/apiError";
import {
  CreateProductInput,
  ProductQueryInput,
  UpdateProductInput
} from "../validations/product.validation";

export async function createProduct(payload: CreateProductInput) {
  return prisma.product.create({
    data: {
      name: payload.name,
      sku: payload.sku,
      category: payload.category,
      price: new Prisma.Decimal(payload.price),
      stock: payload.stock,
      status: payload.status
    }
  });
}

export async function getProducts(query: ProductQueryInput) {
  const where: Prisma.ProductWhereInput = {};

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { sku: { contains: query.search, mode: "insensitive" } }
    ];
  }

  if (query.category) {
    where.category = { contains: query.category, mode: "insensitive" };
  }

  if (query.status) {
    where.status = query.status;
  }

  const skip = (query.page - 1) * query.limit;

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      orderBy: { [query.sortBy]: query.sortOrder },
      skip,
      take: query.limit
    }),
    prisma.product.count({ where })
  ]);

  return {
    products,
    meta: {
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit)
    }
  };
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
}

export async function updateProduct(id: string, payload: UpdateProductInput) {
  await getProductById(id);

  const data: Prisma.ProductUpdateInput = {
    ...payload,
    price: payload.price === undefined ? undefined : new Prisma.Decimal(payload.price)
  };

  return prisma.product.update({
    where: { id },
    data
  });
}

export async function deleteProduct(id: string) {
  await getProductById(id);

  return prisma.product.delete({
    where: { id }
  });
}
