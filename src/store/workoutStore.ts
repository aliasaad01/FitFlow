import { create } from "zustand";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

export interface Workout {
  id: string;
  category: string;
  title: string;
  duration: string;
  level: string;
  video: string;
  tips: string;
  correction: string;
}

interface WorkoutState {
  workouts: Workout[];
  isLoading: boolean;
  fetchWorkouts: () => () => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  workouts: [],
  isLoading: true,

  fetchWorkouts: () => {
    set({ isLoading: true });

    // الاستماع للتمارين بالوقت الفعلي من كولكشن workouts
    const unsubscribe = onSnapshot(collection(db, "workouts"), (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Workout[];

      set({ workouts: items, isLoading: false });
    });

    return unsubscribe;
  },
}));
