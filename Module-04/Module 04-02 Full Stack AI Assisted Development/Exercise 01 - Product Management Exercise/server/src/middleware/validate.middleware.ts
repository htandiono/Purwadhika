import { RequestHandler } from "express";
import { ZodTypeAny } from "zod";
import { ApiError, ApiErrorDetail } from "../utils/apiError";

type ValidationSchemas = {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
};

export function validate(schemas: ValidationSchemas): RequestHandler {
  return (req, _res, next) => {
    const errors: ApiErrorDetail[] = [];

    for (const [key, schema] of Object.entries(schemas) as Array<
      [keyof ValidationSchemas, ZodTypeAny]
    >) {
      const result = schema.safeParse(req[key]);

      if (!result.success) {
        result.error.issues.forEach((issue) => {
          errors.push({
            field: [key, ...issue.path].join("."),
            message: issue.message
          });
        });
        continue;
      }

      (req as unknown as Record<string, unknown>)[key] = result.data;
    }

    if (errors.length > 0) {
      return next(new ApiError(400, "Validation failed", errors));
    }

    return next();
  };
}
