"use client";

import { useEffect, useState } from "react";
import { postService } from "@/lib/services";
import { Customer } from "@/types/post";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import { Icons } from "@/components/icons";
import { Skeleton } from "@/components/atoms/skeleton";

export default function CustomersPage() {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        const response = await postService.getCustomers({
          page: 1,
          limit: 50,
        });
        if (response.status === "success") {
          setCustomers(response.result.data);
        }
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách thương lái",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">Danh sách thương lái</h1>
          <p className="text-muted-foreground">
            Tìm và kết nối với các thương lái
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
        <h1 className="text-3xl font-bold">Danh sách thương lái</h1>
        <p className="text-muted-foreground">
          Tìm và kết nối với các thương lái
        </p>
      </div>

      {customers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Icons.providers className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Chưa có thương lái nào</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {customers.map((customer) => (
            <Card key={customer.id}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icons.user className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle>{customer.name}</CardTitle>
                    {customer.company && (
                      <CardDescription>{customer.company}</CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icons.locations className="h-4 w-4" />
                  <span>{customer.location.district}, {customer.location.province}</span>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>📞 {customer.phone}</span>
                  </div>
                )}
                {customer.rating && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      ⭐ {customer.rating.toFixed(1)}
                    </Badge>
                    {customer.totalTransactions && (
                      <span className="text-xs text-muted-foreground">
                        ({customer.totalTransactions} giao dịch)
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

