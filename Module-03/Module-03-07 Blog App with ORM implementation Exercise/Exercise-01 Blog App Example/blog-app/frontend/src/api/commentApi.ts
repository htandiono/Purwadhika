import api from "./api";
import type { ApiResponse } from "../types";

export async function deleteComment(id: number) {
  const response = await api.delete<ApiResponse<{ id: number }>>(`/comments/${id}`);
  return response.data;
}
