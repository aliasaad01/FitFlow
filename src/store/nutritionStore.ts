import { create } from "zustand";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

export interface Recipe {
  id?: string;
  title: string;
  calories: string;
  ingredients: string;
  image: string;
}

export interface Swap {
  id?: string;
  bad: string;
  good: string;
  why: string;
}

export interface Tip {
  id?: string;
  title: string;
  desc: string;
}

interface NutritionState {
  recipes: Recipe[];
  swaps: Swap[];
  tips: Tip[];
  isLoading: boolean;
  fetchNutritionData: () => () => void;
}

export const useNutritionStore = create<NutritionState>((set) => ({
  recipes: [],
  swaps: [],
  tips: [],
  isLoading: true,

  fetchNutritionData: () => {
    set({ isLoading: true });

    // 1. جلب الوصفات بالوقت الفعلي
    const unsubRecipes = onSnapshot(collection(db, "recipes"), (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Recipe[];
      set({ recipes: items });
    });

    // 2. جلب البدائل بالوقت الفعلي
    const unsubSwaps = onSnapshot(collection(db, "swaps"), (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Swap[];
      set({ swaps: items });
    });

    // 3. جلب النصائح بالوقت الفعلي
    const unsubTips = onSnapshot(collection(db, "tips"), (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Tip[];
      set({ tips: items, isLoading: false });
    });

    // دالة تنظيف الاشتراكات عند مغادرة الصفحة
    return () => {
      unsubRecipes();
      unsubSwaps();
      unsubTips();
    };
  },
}));
