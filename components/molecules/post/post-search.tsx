"use client";

import { useState } from "react";
import { ProductCategory, PostSearchParams } from "@/types/post";
import { Input } from "@/components/atoms/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Button } from "@/components/atoms/button";
import { Icons } from "@/components/icons";

interface PostSearchProps {
  onSearch: (params: PostSearchParams) => void;
  isLoading?: boolean;
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

export function PostSearch({ onSearch, isLoading = false }: PostSearchProps) {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [province, setProvince] = useState<string>("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSearch = () => {
    const params: PostSearchParams = {
      page: 1,
      limit: 20,
    };

    if (keyword.trim()) {
      params.keyword = keyword.trim();
    }

    if (category !== "all") {
      params.category = category;
    }

    if (province !== "all") {
      params.province = province;
    }

    if (minPrice) {
      params.minPrice = Number(minPrice);
    }

    if (maxPrice) {
      params.maxPrice = Number(maxPrice);
    }

    onSearch(params);
  };

  const handleReset = () => {
    setKeyword("");
    setCategory("all");
    setProvince("all");
    setMinPrice("");
    setMaxPrice("");
    onSearch({ page: 1, limit: 20 });
  };

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Từ khóa</label>
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Danh mục</label>
          <Select value={category} onValueChange={(value) => setCategory(value as ProductCategory | "all")}>
            <SelectTrigger>
              <SelectValue placeholder="Tất cả danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {Object.entries(categoryLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tỉnh/Thành phố</label>
          <Select value={province} onValueChange={setProvince}>
            <SelectTrigger>
              <SelectValue placeholder="Tất cả tỉnh/thành" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {vietnamProvinces.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSearch} disabled={isLoading}>
          <Icons.search className="mr-2 h-4 w-4" />
          Tìm kiếm
        </Button>
        <Button variant="outline" onClick={handleReset} disabled={isLoading}>
          Đặt lại
        </Button>
      </div>
    </div>
  );
}

