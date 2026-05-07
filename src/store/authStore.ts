// src/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Role } from "../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  // أضفنا الـ password هنا ليتم استخدامه في المنطق
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // منطق التحقق: (بما أنه لا يوجد backend، سنضع شرطاً وهمياً)
        // مثلاً: أي كلمة سر "123456" مقبولة، أو التحقق من بيانات مخزنة سابقاً
        if (password.length < 6) {
          set({
            error: "كلمة السر يجب أن تكون 6 خانات على الأقل",
            isLoading: false,
          });
          return false;
        }

        const role: Role = email.includes("admin") ? "ADMIN" : "USER";

        const mockUser: User = {
          id: "u1",
          name: email.split("@")[0],
          email,
          role,
          points: 1250,
          tier: "Silver",
          streak: 12,
          joinedDate: new Date().toISOString(),
        };

        set({ user: mockUser, isAuthenticated: true, isLoading: false });
        return true;
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const newUser: User = {
          id: Math.random().toString(36).substring(2, 9),
          name,
          email,
          role: "USER",
          points: 0,
          tier: "Bronze",
          streak: 1,
          joinedDate: new Date().toISOString(),
        };

        set({ user: newUser, isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
        // تنظيف الـ LocalStorage عند الخروج
        localStorage.removeItem("auth-storage");
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
