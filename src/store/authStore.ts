// src/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  usersList: User[]; // قائمة لتخزين كل المستخدمين المسجلين
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  addPoints: (points: number) => void;
  updatePassword: (newPassword: string) => void; // إضافة دالة لتحديث كلمة السر
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      usersList: [], // تبدأ فارغة وتُحفظ في الـ LocalStorage بفضل persist
      isAuthenticated: false,
      isLoading: false,
      error: null,

      addPoints: (points: number) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            points: currentUser.points + points,
          };
          // تحديث المستخدم الحالي وقائمته في السجل العام
          const updatedList = get().usersList.map((u) =>
            u.email === currentUser.email ? updatedUser : u,
          );
          set({ user: updatedUser, usersList: updatedList });
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        await new Promise((resolve) => setTimeout(resolve, 800));

        const existingUser = get().usersList.find((u) => u.email === email);
        if (existingUser) {
          set({ error: "هذا الإيميل مسجل مسبقاً", isLoading: false });
          return;
        }

        const newUser: User = {
          id: Math.random().toString(36).substring(2, 9),
          name,
          email,
          password, // نُخزن كلمة السر هنا داخل القائمة
          role: email.includes("admin") ? "ADMIN" : "USER",
          points: 0,
          tier: "Bronze",
          streak: 1,
          joinedDate: new Date().toISOString(),
        };

        set({
          user: newUser,
          usersList: [...get().usersList, newUser],
          isAuthenticated: true,
          isLoading: false,
        });
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        await new Promise((resolve) => setTimeout(resolve, 800));

        const foundUser = get().usersList.find((u) => u.email === email);

        // التحقق من وجود المستخدم وتطابق كلمة السر
        if (foundUser && foundUser.password === password) {
          set({ user: foundUser, isAuthenticated: true, isLoading: false });
          return true;
        } else if (foundUser && foundUser.password !== password) {
          set({ error: "كلمة السر غير صحيحة", isLoading: false });
          return false;
        } else {
          set({ error: "الحساب غير موجود، يرجى التسجيل", isLoading: false });
          return false;
        }
      },

      updatePassword: async (newPassword: string) => {
        const currentUser = get().user;
        const list = get().usersList;

        if (currentUser) {
          // 1. تحديث كلمة السر في كائن المستخدم الحالي
          const updatedUser = { ...currentUser, password: newPassword };

          // 2. تحديث كلمة السر في القائمة العامة للمستخدمين (usersList)
          const updatedList = list.map((u) =>
            u.email === currentUser.email ? { ...u, password: newPassword } : u,
          );

          // 3. حفظ التغييرات في الـ Store (وبالتالي في LocalStorage تلقائياً)
          set({ user: updatedUser, usersList: updatedList });
          return true;
        }
        return false;
      },

      logout: () => {
        // عند الخروج، نمسح المستخدم الحالي فقط ونبقي على isAuthenticated false
        // لا نحذف auth-storage لكي لا نفقد قائمة usersList
        set({ user: null, isAuthenticated: false, error: null });
      },
    }),
    {
      name: "auth-storage", // هذا هو المفتاح في LocalStorage
    },
  ),
);
