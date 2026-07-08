// src/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { auth, db } from "../firebase/firebaseConfig";
import { FirebaseError } from "firebase/app";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updatePassword as firebaseUpdatePassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  addPoints: (points: number) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // 1. تسجيل مستخدم جديد وحفظ بياناته البدنية والتحفيزية في Firestore
      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
          );
          const uid = userCredential.user.uid;

          const newUser: User = {
            id: uid,
            name,
            email,
            role: email.includes("admin") ? "ADMIN" : "USER",
            points: 0,
            tier: "Bronze",
            streak: 1,
            joinedDate: new Date().toISOString(),
          };

          await setDoc(doc(db, "users", uid), newUser);

          set({ user: newUser, isAuthenticated: true, isLoading: false });
        } catch (err) {
          let customError = "حدث خطأ أثناء التسجيل";

          // حل مشكلة النوع unknown عبر فحص الخطأ بأمان
          if (err instanceof FirebaseError) {
            if (err.code === "auth/email-already-in-use")
              customError = "هذا الإيميل مسجل مسبقاً";
            if (err.code === "auth/weak-password")
              customError = "كلمة السر ضعيفة جداً";
          } else if (err instanceof Error) {
            customError = err.message;
          }

          set({ error: customError, isLoading: false });
          throw err;
        }
      },

      // 2. دالة تسجيل الدخول والتحقق الآمن وجلب بيانات الـ Firestore
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password,
          );
          const uid = userCredential.user.uid;

          const userDoc = await getDoc(doc(db, "users", uid));

          if (userDoc.exists()) {
            const foundUser = userDoc.data() as User;
            set({ user: foundUser, isAuthenticated: true, isLoading: false });
            return true;
          } else {
            set({
              error: "لم يتم العثور على بيانات المستخدم بقاعدة البيانات",
              isLoading: false,
            });
            return false;
          }
        } catch (err) {
          let customError = "فشل تسجيل الدخول، تأكد من البيانات";

          if (err instanceof FirebaseError) {
            if (err.code === "auth/user-not-found")
              customError = "الحساب غير موجود، يرجى التسجيل";
            if (err.code === "auth/wrong-password")
              customError = "كلمة السر غير صحيحة";
          }

          set({ error: customError, isLoading: false });
          return false;
        }
      },

      // 3. إضافة النقاط وتحديث المستند ديناميكياً بـ Firestore في الوقت الفعلي
      addPoints: async (points: number) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            points: currentUser.points + points,
          };

          try {
            await setDoc(
              doc(db, "users", currentUser.id),
              { points: updatedUser.points },
              { merge: true },
            );
            set({ user: updatedUser });
          } catch (err) {
            console.error("خطأ أثناء تحديث النقاط في السيرفر:", err);
          }
        }
      },

      // 4. تحديث كلمة السر وتشفيرها مباشرة على سيرفرات جوجل الآمنة
      updatePassword: async (newPassword: string) => {
        const currentUser = auth.currentUser;
        if (currentUser) {
          try {
            set({ isLoading: true, error: null });
            await firebaseUpdatePassword(currentUser, newPassword);
            set({ isLoading: false });
            return true;
          } catch (err) {
            console.log(err);
            set({
              error:
                "فشل تحديث كلمة السر، يرجى إعادة تسجيل الدخول والمحاولة مجدداً",
              isLoading: false,
            });
            return false;
          }
        }
        return false;
      },

      // 5. تسجيل الخروج الآمن وإنهاء الجلسة البرمجية
      logout: async () => {
        try {
          await signOut(auth);
          set({ user: null, isAuthenticated: false, error: null });
        } catch (err) {
          console.error("خطأ أثناء تسجيل الخروج:", err);
        }
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
