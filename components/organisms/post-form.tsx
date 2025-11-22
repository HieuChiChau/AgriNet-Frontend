"use client";

import { ChangeEvent, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostSchema, type CreatePostFormData } from "@/lib/validations";
import { ProductCategory } from "@/types/post";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/atoms/form";
import { Input } from "@/components/atoms/input";
import { Textarea } from "@/components/atoms/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Button } from "@/components/atoms/button";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";

interface PostFormProps {
  onSubmit: (data: CreatePostFormData) => Promise<void>;
  isLoading?: boolean;
  defaultValues?: Partial<CreatePostFormData>;
}

const categoryLabels: Record<ProductCategory, string> = {
  [ProductCategory.RICE]: "Lúa gạo",
  [ProductCategory.VEGETABLES]: "Rau củ",
  [ProductCategory.FRUITS]: "Trái cây",
  [ProductCategory.COFFEE]: "Cà phê",
  [ProductCategory.CASSAVA]: "Sắn",
  [ProductCategory.CORN]: "Ngô",
  [ProductCategory.OTHER]: "Khác",
};

const vietnamProvinces = [
  "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu",
  "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước",
  "Bình Thuận", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông",
  "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang",
  "Hà Nam", "Hà Tĩnh", "Hải Dương", "Hậu Giang", "Hòa Bình",
  "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu",
  "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định",
  "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên",
  "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị",
  "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên",
  "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "TP. Hồ Chí Minh",
  "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái",
];

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

export function PostForm({ onSubmit, isLoading = false, defaultValues }: PostFormProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      description: "",
      category: ProductCategory.OTHER,
      price: 0,
      quantity: 0,
      unit: "kg",
      location: {
        province: "",
        district: "",
      },
      images: [],
      ...defaultValues,
    },
  });
  const images = form.watch("images") ?? [];

  const handleSubmit = async (data: CreatePostFormData) => {
    await onSubmit(data);
  };

  const readFileAsDataURL = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;

    const remainingSlots = MAX_IMAGES - images.length;
    if (remainingSlots <= 0) {
      toast({
        title: "Đã đạt giới hạn",
        description: `Chỉ được tải lên tối đa ${MAX_IMAGES} ảnh.`,
        variant: "destructive",
      });
      return;
    }

    const validFiles: File[] = [];
    files.forEach((file) => {
      if (file.size > MAX_IMAGE_SIZE) {
        toast({
          title: "Ảnh quá lớn",
          description: `${file.name} vượt quá 2MB, vui lòng chọn ảnh nhỏ hơn.`,
          variant: "destructive",
        });
      } else {
        validFiles.push(file);
      }
    });

    if (!validFiles.length) return;

    const limitedFiles = validFiles.slice(0, remainingSlots);
    const dataUrls = await Promise.all(
      limitedFiles.map((file) => readFileAsDataURL(file))
    );
    const newImages = [...images, ...dataUrls];
    form.setValue("images", newImages, { shouldDirty: true });
  };

  const handleRemoveImage = (index: number) => {
    const filtered = images.filter((_, idx) => idx !== index);
    form.setValue("images", filtered, { shouldDirty: true });
  };

  const triggerSelectImages = () => {
    fileInputRef.current?.click();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề</FormLabel>
              <FormControl>
                <Input placeholder="Ví dụ: Lúa gạo thơm chất lượng cao" {...field} />
              </FormControl>
              <FormDescription>
                Tiêu đề ngắn gọn, mô tả rõ sản phẩm của bạn
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả chi tiết</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Mô tả về sản phẩm, chất lượng, nguồn gốc..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Danh mục</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Đơn vị</FormLabel>
                <FormControl>
                  <Input placeholder="kg, tấn, bao..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá (VNĐ)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số lượng</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="location.province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tỉnh/Thành phố</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tỉnh/thành phố" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vietnamProvinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location.district"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quận/Huyện</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập quận/huyện" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location.address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ chi tiết (tùy chọn)</FormLabel>
              <FormControl>
                <Input placeholder="Số nhà, tên đường..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem>
              <FormLabel>Hình ảnh sản phẩm</FormLabel>
              <FormDescription>
                Tối đa {MAX_IMAGES} ảnh, mỗi ảnh không quá 2MB.
              </FormDescription>
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleImageUpload}
                />
                <div className="flex flex-wrap gap-3">
                  {images.map((src, idx) => (
                    <div
                      key={`${src}-${idx}`}
                      className="relative h-28 w-28 overflow-hidden rounded-xl border border-green-100 shadow-sm"
                    >
                      <Image
                        src={src}
                        alt={`Ảnh ${idx + 1}`}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                      <button
                        type="button"
                        aria-label="Xóa ảnh"
                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
                        onClick={() => handleRemoveImage(idx)}
                      >
                        <Icons.close className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {images.length < MAX_IMAGES && (
                    <button
                      type="button"
                      onClick={triggerSelectImages}
                      className="flex h-28 w-28 flex-col items-center justify-center rounded-xl border-2 border-dashed border-green-200 text-sm font-medium text-green-600 transition hover:border-green-400"
                    >
                      <Icons.media className="mb-2 h-6 w-6" />
                      Thêm ảnh
                    </button>
                  )}
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Đăng bài"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

