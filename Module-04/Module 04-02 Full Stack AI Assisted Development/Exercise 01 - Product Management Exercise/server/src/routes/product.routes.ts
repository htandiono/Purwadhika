import { Router } from "express";
import { create, findAll, findOne, remove, update } from "../controllers/product.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createProductBodySchema,
  productIdParamSchema,
  productQuerySchema,
  updateProductBodySchema
} from "../validations/product.validation";

const router = Router();

router.use(authenticate);

router.post("/", validate({ body: createProductBodySchema }), create);
router.get("/", validate({ query: productQuerySchema }), findAll);
router.get("/:id", validate({ params: productIdParamSchema }), findOne);
router.patch("/:id", validate({ params: productIdParamSchema, body: updateProductBodySchema }), update);
router.delete("/:id", validate({ params: productIdParamSchema }), remove);

export default router;
