export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface LikeSummary {
  userId: number;
}

export interface Comment {
  id: number;
  content: string;
  postId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: User;
}

export interface Post {
  id: number;
  content: string;
  imageUrl: string | null;
  isPublished: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: User;
  likeCount: number;
  commentCount: number;
  comments?: Comment[];
  likes?: LikeSummary[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthData {
  token: string;
  user: User;
}
