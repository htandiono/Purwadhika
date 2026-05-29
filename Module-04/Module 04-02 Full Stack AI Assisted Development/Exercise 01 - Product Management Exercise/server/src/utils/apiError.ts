export type ApiErrorDetail = {
  field?: string;
  message: string;
};

export class ApiError extends Error {
  statusCode: number;
  errors?: ApiErrorDetail[];

  constructor(statusCode: number, message: string, errors?: ApiErrorDetail[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
