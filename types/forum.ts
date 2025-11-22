import { Post } from "@/types/post";
import { UserRole } from "@/constants/role";

export interface ForumUser {
  id: string | number;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  location: string;
  company?: string;
  badge?: string;
}

export interface ForumPost extends Post {
  excerpt: string;
  tags: string[];
  likes: number;
  commentsCount: number;
  bookmarked?: boolean;
  highlights?: string[];
}

export interface ForumComment {
  id: string;
  postId: string | number;
  content: string;
  createdAt: string;
  author: ForumUser;
  replies?: ForumComment[];
}
