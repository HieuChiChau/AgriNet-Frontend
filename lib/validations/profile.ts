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
  firstName: z
    .string()
    .trim()
    .min(1, "Họ là bắt buộc")
    .max(50, "Họ tối đa 50 ký tự"),
  lastName: z
    .string()
    .trim()
    .min(1, "Tên là bắt buộc")
    .max(50, "Tên tối đa 50 ký tự"),
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
    )
    .or(z.literal("").transform(() => null)),
  address: z
    .string()
    .trim()
    .optional()
    .or(z.literal("").transform(() => null)),
  latitude: z
    .string()
    .trim()
    .optional()
    .or(z.literal("").transform(() => null)),
  longitude: z
    .string()
    .trim()
    .optional()
    .or(z.literal("").transform(() => null)),
  bio: z
    .string()
    .trim()
    .max(280, "Giới thiệu tối đa 280 ký tự")
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
