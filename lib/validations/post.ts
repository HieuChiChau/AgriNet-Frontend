import { z } from "zod";
import { ProductCategory } from "@/types/post";

const imageSchema = z
  .string()
  .trim()
  .refine(
    (value) => /^https?:\/\//.test(value) || value.startsWith("data:image/"),
    "URL hình ảnh không hợp lệ"
  );

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "Tiêu đề là bắt buộc")
    .min(5, "Tiêu đề phải có ít nhất 5 ký tự")
    .max(200, "Tiêu đề không được vượt quá 200 ký tự"),
  content: z
    .string()
    .min(1, "Nội dung là bắt buộc")
    .min(10, "Nội dung phải có ít nhất 10 ký tự"),
  images: z
    .array(imageSchema)
    .max(5, "Chỉ được tải lên tối đa 5 ảnh")
    .optional(),
});

export const updatePostSchema = createPostSchema.partial();

export const searchPostSchema = z.object({
  category: z.nativeEnum(ProductCategory).optional(),
  province: z.string().optional(),
  district: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  keyword: z.string().optional(),
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(20),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;
export type UpdatePostFormData = z.infer<typeof updatePostSchema>;
export type SearchPostFormData = z.infer<typeof searchPostSchema>;
