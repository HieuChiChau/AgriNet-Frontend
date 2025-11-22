"use client";

import { useState } from "react";
import { Category } from "@/types/post";
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
import { GoogleMapsAutocomplete } from "@/components/molecules/common/google-maps-autocomplete";

interface ForumFilterParams {
  categoryName?: string;
  productName?: string;
  price?: string;
  quantity?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
}

interface ForumFilterProps {
  onFilter: (params: ForumFilterParams) => void;
  isLoading?: boolean;
}

const categoryLabels: Record<Category, string> = {
  [Category.VEGETABLE]: "Rau củ",
  [Category.FRUIT]: "Cây ăn quả",
  [Category.INDUSTRIAL_PLANT]: "Cây công nghiệp",
};

export function ForumFilter({ onFilter, isLoading = false }: ForumFilterProps) {
  const [categoryName, setCategoryName] = useState<string>("all");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);

  const handleFilter = () => {
    const params: ForumFilterParams = {};

    if (categoryName && categoryName !== "all") {
      params.categoryName = categoryName;
    }
    if (productName.trim()) {
      params.productName = productName.trim();
    }
    if (price.trim()) {
      params.price = price.trim();
    }
    if (quantity.trim()) {
      params.quantity = quantity.trim();
    }
    if (address.trim()) {
      params.address = address.trim();
    }
    if (latitude !== undefined) {
      params.latitude = latitude;
    }
    if (longitude !== undefined) {
      params.longitude = longitude;
    }

    onFilter(params);
  };

  const handleReset = () => {
    setCategoryName("all");
    setProductName("");
    setPrice("");
    setQuantity("");
    setAddress("");
    setLatitude(undefined);
    setLongitude(undefined);
    onFilter({});
  };

  const handleAddressSelect = (selectedAddress: string, lat?: string, lng?: string) => {
    setAddress(selectedAddress);
    if (lat) setLatitude(parseFloat(lat));
    if (lng) setLongitude(parseFloat(lng));
  };

  return (
    <div className="space-y-4 rounded-lg border border-green-100 bg-white/80 p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Danh mục</label>
          <Select value={categoryName} onValueChange={setCategoryName}>
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
          <label className="text-sm font-medium text-gray-700">Tên sản phẩm</label>
          <Input
            placeholder="Nhập tên sản phẩm..."
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFilter()}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Giá</label>
          <Input
            type="text"
            placeholder="Nhập giá..."
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFilter()}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Số lượng</label>
          <Input
            type="text"
            placeholder="Nhập số lượng..."
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFilter()}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Địa chỉ</label>
          <GoogleMapsAutocomplete
            value={address}
            onSelect={handleAddressSelect}
            onChange={setAddress}
            placeholder="Nhập địa chỉ hoặc chọn từ bản đồ..."
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleFilter} disabled={isLoading} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
          <Icons.search className="mr-2 h-4 w-4" />
          Tìm kiếm
        </Button>
        <Button variant="outline" onClick={handleReset} disabled={isLoading} className="border-green-200 text-green-700 hover:bg-green-50">
          Đặt lại
        </Button>
      </div>
    </div>
  );
}

