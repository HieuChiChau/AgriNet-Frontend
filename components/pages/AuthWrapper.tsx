"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { authService } from "@/lib/services";
import { getAuthorizationClient } from "@/lib/apis/cache-client";
import { UserRole } from "@/constants/role";
import Loading from "@/app/loading_screen";
import { useToast } from "@/hooks/use-toast";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const { user, setUser, setIsLoggedIn, logout } = useUser();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsChecking(true);
        const token = getAuthorizationClient();
        const isManagePage = pathname.startsWith("/manage");

        if (!token) {
          setIsChecking(false);
          return;
        }

        if (token && !user) {
          try {
            const response = await authService.getProfile();
            if (response.status === "success" && response.result) {
              const user = authService.transformUser(response.result);
              setUser(user);

              if (isManagePage && user.role !== UserRole.Admin) {
                toast({
                  title: "Không có quyền truy cập",
                  description: "Bạn không có quyền truy cập trang này",
                  variant: "destructive",
                });
                router.push("/");
                setIsChecking(false);
                return;
              }
            } else {
              logout();
            }
          } catch (error) {
            logout();
          }
        } else if (user) {
          if (isManagePage && user.role !== UserRole.Admin) {
            toast({
              title: "Không có quyền truy cập",
              description: "Bạn không có quyền truy cập trang này",
              variant: "destructive",
            });
            router.push("/");
            return;
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [pathname, user, router, setUser, setIsLoggedIn, logout, toast]);

  if (isChecking && pathname.startsWith("/manage")) {
    return <Loading />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
