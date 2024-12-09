import { create } from "zustand";
import { persist } from "zustand/middleware";
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
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
