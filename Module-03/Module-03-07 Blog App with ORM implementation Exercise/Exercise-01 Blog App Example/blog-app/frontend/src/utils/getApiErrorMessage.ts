import axios from "axios";

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || "Request failed";
  }

  return "Something went wrong";
}
