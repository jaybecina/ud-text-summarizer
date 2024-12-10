import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { z } from "zod";

const userSchema = z.object({
  id: z.string(),
  first_name: z.string().min(2, "First Name must be at least 2 characters"),
  last_name: z.string().min(2, "Last Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

type User = z.infer<typeof userSchema>;
type UserT = {
  email: string;
  id: string;
  first_name: string | null;
  last_name: string | null;
};

interface UserState {
  user: UserT | null;
  isLoading: boolean;
  setUser: (user: UserT | null) => void;
  setLoading: (isLoading: boolean) => void;
  clearUserStore: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isLoading: false,
        setUser: (user) => set({ user }),
        setLoading: (isLoading) => set({ isLoading }),
        clearUserStore: () => {
          localStorage.removeItem("user-storage");
          set({
            user: null,
            isLoading: false,
          });
        },
      }),
      {
        name: "user-storage",
        partialize: (state) => ({ user: state.user }),
      }
    ),
    { name: "user-store" }
  )
);
