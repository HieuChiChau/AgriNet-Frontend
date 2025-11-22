import { z } from "zod";

const avatarSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) =>
      !value || /^https?:\/\//.test(value) || value.startsWith("data:image/"),
    "Avatar phải là đường dẫn hợp lệ hoặc ảnh đã upload"
  )
  .or(z.literal("").transform(() => undefined));

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(100, "Tên tối đa 100 ký tự"),
  email: z
    .string()
    .trim()
    .min(1, "Email là bắt buộc")
    .email("Email không hợp lệ"),
  avatar: avatarSchema,
  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || /^[0-9\-\+\s]{8,15}$/.test(value),
      "Số điện thoại không hợp lệ"
    ),
  location: z
    .string()
    .trim()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  bio: z
    .string()
    .trim()
    .max(280, "Giới thiệu tối đa 280 ký tự")
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
