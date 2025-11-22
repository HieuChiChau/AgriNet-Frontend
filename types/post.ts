import { User } from "./user";

export enum PostStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  SOLD = "sold",
  EXPIRED = "expired",
}

export enum ProductCategory {
  RICE = "rice",
  VEGETABLES = "vegetables",
  FRUITS = "fruits",
  COFFEE = "coffee",
  CASSAVA = "cassava",
  CORN = "corn",
  OTHER = "other",
}

export enum Category {
  VEGETABLE = "Rau củ",
  FRUIT = "Cây ăn quả",
  INDUSTRIAL_PLANT = "Cây công nghiệp",
}

export interface Post {
  id: string | number;
  title: string;
  description: string;
  category: ProductCategory;
  price: number;
  quantity: number;
  unit: string;
  location: {
    province: string;
    district: string;
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  images: string[];
  status: PostStatus;
  farmer: User;
  farmerId: string | number;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  views?: number;
  interestedCustomers?: number;
  user?: User;
}

export interface CreatePostData {
  title: string;
  description: string;
  category: ProductCategory;
  price: number;
  quantity: number;
  unit: string;
  location: {
    province: string;
    district: string;
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  images?: string[];
  expiresAt?: string;
}

export interface UpdatePostData extends Partial<CreatePostData> {
  status?: PostStatus;
}

export interface PostSearchParams {
  category?: ProductCategory;
  province?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  keyword?: string;
  page?: number;
  limit?: number;
}

export interface Customer {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  location: {
    province: string;
    district: string;
  };
  rating?: number;
  totalTransactions?: number;
  avatar?: string;
}
