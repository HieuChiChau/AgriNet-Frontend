"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { authService } from "@/lib/services";
import { getAuthorizationClient } from "@/lib/apis/cache-client";
import { UserRole } from "@/constants/role";
import Loading from "@/app/loading_screen";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/query/user";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const { user, setUser, logout } = useUser();
  const [isChecking, setIsChecking] = useState(true);
  const token = getAuthorizationClient();
  const isManagePage = pathname.startsWith("/manage");

  // Chỉ fetch profile nếu có token và chưa có user
  const { data: profileData, isLoading: isProfileLoading } = useUserProfile({
    enabled: !!token && !user,
  });

  useEffect(() => {
    if (isProfileLoading) {
      setIsChecking(true);
      return;
    }

    if (!token) {
      setIsChecking(false);
      return;
    }

    // Nếu có profile data và chưa có user, set user
    if (profileData?.status === "success" && profileData.result && !user) {
      const transformedUser = authService.transformUser(profileData.result);
      setUser(transformedUser);

      if (isManagePage && transformedUser.role !== UserRole.Admin) {
        toast({
          title: "Không có quyền truy cập",
          description: "Bạn không có quyền truy cập trang này",
          variant: "destructive",
        });
        router.push("/");
        setIsChecking(false);
        return;
      }
    } else if (token && !user && !isProfileLoading && !profileData) {
      // Token có nhưng không fetch được profile -> logout
      logout();
    }

    // Kiểm tra quyền truy cập nếu đã có user
    if (user && isManagePage && user.role !== UserRole.Admin) {
      toast({
        title: "Không có quyền truy cập",
        description: "Bạn không có quyền truy cập trang này",
        variant: "destructive",
      });
      router.push("/");
      setIsChecking(false);
      return;
    }

    setIsChecking(false);
  }, [
    token,
    user,
    profileData,
    isProfileLoading,
    isManagePage,
    router,
    setUser,
    logout,
    toast,
  ]);

  if (isChecking && pathname.startsWith("/manage")) {
    return <Loading />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
