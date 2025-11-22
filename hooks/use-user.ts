import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/user";

interface UserStore {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  logout: () => void;
}

export const useUser = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,

      setUser: (user) =>
        set({
          user,
          isLoggedIn: !!user,
        }),

      setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),

      logout: () =>
        set({
          user: null,
          isLoggedIn: false,
        }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
