import { Request, Response } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct
} from "../services/product.service";
import { asyncHandler } from "../utils/asyncHandler";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const product = await createProduct(req.body);

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product
  });
});

export const findAll = asyncHandler(async (req: Request, res: Response) => {
  const result = await getProducts(req.query as never);

  res.status(200).json({
    success: true,
    message: "Products retrieved successfully",
    data: result.products,
    meta: result.meta
  });
});

export const findOne = asyncHandler(async (req: Request, res: Response) => {
  const product = await getProductById(req.params.id);

  res.status(200).json({
    success: true,
    message: "Product retrieved successfully",
    data: product
  });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const product = await updateProduct(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product
  });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await deleteProduct(req.params.id);

  res.status(200).json({
    success: true,
    message: "Product deleted successfully"
  });
});
