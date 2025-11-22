"use client";

import { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostSchema, type CreatePostFormData } from "@/lib/validations";
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
import { Button } from "@/components/atoms/button";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { GoogleMapsAutocomplete } from "@/components/molecules/common/google-maps-autocomplete";

interface PostFormProps {
  onSubmit: (data: CreatePostFormData & {
    imageFiles: File[];
    address?: string;
    latitude?: string;
    longitude?: string;
  }) => Promise<void>;
  isLoading?: boolean;
  defaultValues?: Partial<CreatePostFormData>;
}

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

interface ImageWithFile {
  dataUrl: string;
  file: File;
}

export function PostForm({ onSubmit, isLoading = false, defaultValues }: PostFormProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFiles, setImageFiles] = useState<ImageWithFile[]>([]);
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");

  const form = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      content: "",
      images: [],
      ...defaultValues,
    },
    mode: "onChange",
  });
  const images = form.watch("images") ?? [];

  const handleSubmit = async (data: CreatePostFormData) => {
    await onSubmit({
      ...data,
      imageFiles: imageFiles.map((img) => img.file),
      address: address || undefined,
      latitude: latitude || undefined,
      longitude: longitude || undefined,
    });
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
    const newImageFiles: ImageWithFile[] = await Promise.all(
      limitedFiles.map(async (file) => ({
        file,
        dataUrl: await readFileAsDataURL(file),
      }))
    );

    setImageFiles([...imageFiles, ...newImageFiles]);
    const dataUrls = [...images, ...newImageFiles.map((img) => img.dataUrl)];
    form.setValue("images", dataUrls, { shouldDirty: true });
  };

  const handleRemoveImage = (index: number) => {
    const filteredFiles = imageFiles.filter((_, idx) => idx !== index);
    setImageFiles(filteredFiles);
    const filteredImages = images.filter((_, idx) => idx !== index);
    form.setValue("images", filteredImages, { shouldDirty: true });
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
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nội dung</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập nội dung bài đăng của bạn... (mô tả sản phẩm, giá cả, số lượng, địa điểm, v.v.)"
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Bạn có thể nhập bất kỳ thông tin nào về sản phẩm của mình
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Địa điểm (tùy chọn)</FormLabel>
          <FormControl>
            <GoogleMapsAutocomplete
              value={address || ""}
              latitude={latitude}
              longitude={longitude}
              onSelect={(addr, lat, lng) => {
                setAddress(addr);
                setLatitude(lat);
                setLongitude(lng);
              }}
              onChange={(value) => {
                setAddress(value);
                if (!value) {
                  setLatitude("");
                  setLongitude("");
                }
              }}
              placeholder="Nhập địa chỉ để tự động lấy tọa độ (để trống sẽ dùng địa chỉ của bạn)..."
            />
          </FormControl>
          <FormDescription>
            Nếu không nhập, hệ thống sẽ sử dụng địa chỉ của bạn
          </FormDescription>
        </FormItem>

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
                  {imageFiles.map((img, idx) => (
                    <div
                      key={`${img.dataUrl}-${idx}`}
                      className="relative h-28 w-28 overflow-hidden rounded-xl border border-green-100 shadow-sm"
                    >
                      <Image
                        src={img.dataUrl}
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
                  {imageFiles.length < MAX_IMAGES && (
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

