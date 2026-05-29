export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
};
