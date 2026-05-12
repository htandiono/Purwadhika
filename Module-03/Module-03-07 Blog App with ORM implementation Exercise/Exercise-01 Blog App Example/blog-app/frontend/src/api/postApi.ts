import api from "./api";
import type { ApiResponse, Comment, Post } from "../types";

export interface PostInput {
  content: string;
  imageUrl?: string;
  isPublished?: boolean;
}

export interface CommentInput {
  content: string;
}

export async function getPosts(search?: string) {
  const params = search ? { search } : undefined;
  const response = await api.get<ApiResponse<Post[]>>("/posts", { params });
  return response.data;
}

export async function getPostById(id: number) {
  const response = await api.get<ApiResponse<Post>>(`/posts/${id}`);
  return response.data;
}

export async function createPost(input: PostInput) {
  const response = await api.post<ApiResponse<Post>>("/posts", input);
  return response.data;
}

export async function updatePost(id: number, input: PostInput) {
  const response = await api.put<ApiResponse<Post>>(`/posts/${id}`, input);
  return response.data;
}

export async function deletePost(id: number) {
  const response = await api.delete<ApiResponse<{ id: number }>>(`/posts/${id}`);
  return response.data;
}

export async function publishPost(id: number, isPublished: boolean) {
  const response = await api.patch<ApiResponse<Post>>(`/posts/${id}/publish`, { isPublished });
  return response.data;
}

export async function likePost(id: number) {
  const response = await api.post<ApiResponse<{ likeCount: number }>>(`/posts/${id}/like`);
  return response.data;
}

export async function unlikePost(id: number) {
  const response = await api.delete<ApiResponse<{ likeCount: number }>>(`/posts/${id}/like`);
  return response.data;
}

export async function getPostComments(id: number) {
  const response = await api.get<ApiResponse<Comment[]>>(`/posts/${id}/comments`);
  return response.data;
}

export async function createComment(id: number, input: CommentInput) {
  const response = await api.post<ApiResponse<Comment>>(`/posts/${id}/comments`, input);
  return response.data;
}
