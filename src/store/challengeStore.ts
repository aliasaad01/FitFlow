// src/store/challengeStore.ts
import { create } from "zustand";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";

export interface Challenge {
  id: string; // Document ID من فايربيز
  title: string;
  points: number;
  target: number;
  current: number;
  isBig: boolean;
  desc: string;
  iconName: string; // نص يمثل اسم الأيقونة
  completed?: boolean;
}

interface ChallengeState {
  challenges: Challenge[];
  isLoading: boolean;
  fetchChallenges: () => () => void; // تعيد دالة إلغاء الاشتراك unsubscribe
  completeChallengeInDB: (id: string, targetValue: number) => Promise<void>;
}

export const useChallengeStore = create<ChallengeState>((set) => ({
  challenges: [],
  isLoading: true,

  // جلب التحديات بالوقت الفعلي من سيرفر Firestore
  fetchChallenges: () => {
    set({ isLoading: true });

    const unsubscribe = onSnapshot(
      collection(db, "challenges"),
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Challenge[];

        set({ challenges: items, isLoading: false });
      },
      (error) => {
        console.error("خطأ أثناء جلب التحديات بالوقت الفعلي:", error);
        set({ isLoading: false });
      },
    );

    return unsubscribe;
  },

  // تحديث حالة التحدي وجعله مكتملاً في السيرفر
  completeChallengeInDB: async (id, targetValue) => {
    try {
      const challengeRef = doc(db, "challenges", id);
      await updateDoc(challengeRef, {
        current: targetValue,
        completed: true,
      });
    } catch (err) {
      console.error("خطأ أثناء تحديث وثيقة التحدي:", err);
    }
  },
}));
