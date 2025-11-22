"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import { Icons } from "@/components/icons";
import { Skeleton } from "@/components/atoms/skeleton";
import { Input } from "@/components/atoms/input";
import { useUsers } from "@/hooks/query/posts";
import { Pagination } from "@/components/molecules/common/pagination";
import { authService } from "@/lib/services";
import Image from "next/image";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [name, setName] = useState("");
  const [role, setRole] = useState<number | undefined>(undefined);

  const debouncedName = useDebounce(name, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedName, role]);

  const { data, isLoading } = useUsers({
    page,
    limit,
    name: debouncedName || undefined,
    role,
  });

  const users = data?.status === "success" ? data.result.data : [];
  const pagination = data?.status === "success" ? data.result.pagination : null;

  const getRoleLabel = (role: number) => {
    if (role === 2) return "Khách hàng";
    if (role === 3) return "Nông dân";
    return "Khác";
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">Danh sách người dùng</h1>
          <p className="text-muted-foreground">
            Tìm và kết nối với các người dùng
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Danh sách người dùng</h1>
        <p className="text-muted-foreground">
          Tìm và kết nối với các người dùng
        </p>
      </div>

      {/* Filters */}
      <Card className="border-green-100">
        <CardHeader>
          <CardTitle className="text-lg">Lọc tìm kiếm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tên</label>
              <Input
                placeholder="Nhập tên..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-green-200 focus:border-green-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Vai trò</label>
              <select
                value={role || ""}
                onChange={(e) => {
                  setRole(e.target.value ? Number(e.target.value) : undefined);
                  setPage(1);
                }}
                className="flex h-10 w-full rounded-md border border-green-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2"
              >
                <option value="">Tất cả</option>
                <option value="2">Khách hàng</option>
                <option value="3">Nông dân</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {users.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Icons.providers className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Không tìm thấy người dùng nào</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => {
              const transformedUser = authService.transformUser({
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                avatar: user.avatar,
                latitude: user.latitude,
                longitude: user.longitude,
                address: user.address,
                role: user.role,
                status: user.status,
              });

              return (
                <Card key={user.id} className="border-green-100 hover:border-green-300 transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={transformedUser.name}
                          width={48}
                          height={48}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-500 text-white text-lg font-bold">
                          {user.firstName?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <CardTitle className="truncate">{transformedUser.name}</CardTitle>
                        <CardDescription>
                          <Badge variant="secondary" className="mt-1">
                            {getRoleLabel(user.role)}
                          </Badge>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icons.mail className="h-4 w-4" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icons.phone className="h-4 w-4" />
                        <a
                          href={`tel:${user.phone}`}
                          className="text-green-600 hover:text-green-700 hover:underline"
                        >
                          {user.phone}
                        </a>
                      </div>
                    )}
                    {user.address && (
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Icons.locations className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{user.address}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPage > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">
                Hiển thị {((page - 1) * limit) + 1} - {Math.min(page * limit, pagination.total)} trong tổng số {pagination.total} người dùng
              </p>
              <Pagination
                currentPage={page}
                totalPages={pagination.totalPage}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
