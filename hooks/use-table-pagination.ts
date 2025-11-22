import { useCallback, useEffect, useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const LIMIT = 10;
const START_PAGE = 1;

export function useTablePagination(initialPageCount: number) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get search params with fallback values
  const pageIndex = Math.max(
    0,
    Number(searchParams?.get("page") ?? START_PAGE) - 1
  );
  const pageSize = Number(searchParams?.get("perPage") ?? LIMIT);
  const searchValue = searchParams?.get("search") ?? "";

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex,
    pageSize,
  });

  const [localSearchValue, setLocalSearchValue] = useState<string>(searchValue);

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }
      return newSearchParams.toString();
    },
    [searchParams]
  );

  const updateUrl = useCallback(
    (params: Record<string, string | number | null>) => {
      router.push(`${pathname}?${createQueryString(params)}`, {
        scroll: false,
      });
    },
    [createQueryString, pathname, router]
  );

  // Update URL when pagination changes
  useEffect(() => {
    updateUrl({
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    });
  }, [pagination, updateUrl]);

  // Update URL when search changes
  useEffect(() => {
    updateUrl({
      page: 1,
      search: localSearchValue || null,
    });
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [localSearchValue, updateUrl]);

  // Sync with URL params
  useEffect(() => {
    setPagination({
      pageIndex: Math.max(
        0,
        Number(searchParams.get("page") ?? START_PAGE) - 1
      ),
      pageSize: Number(searchParams.get("perPage") ?? LIMIT),
    });
    setLocalSearchValue(searchParams.get("search") ?? "");
  }, [searchParams]);

  return {
    pagination,
    setPagination,
    searchValue: localSearchValue,
    setSearchValue: setLocalSearchValue,
  };
}
