// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// interface Workout {
//   id: string;
//   title: string;
//   level: string;
//   duration: string;
// }

// interface ContentState {
//   workouts: Workout[];
//   tips: string[];
//   addWorkout: (workout: Workout) => void;
//   addTip: (tip: string) => void;
//   deleteWorkout: (id: string) => void;
// }

// export const useContentStore = create<ContentState>()(
//   persist(
//     (set) => ({
//       workouts: [
//         {
//           id: "1",
//           title: "تمارين كارديو صباحية",
//           level: "مبتدئ",
//           duration: "20 دقيقة",
//         },
//       ],
//       tips: [
//         "اشربي الكثير من الماء",
//         "النوم الكافي يساعد على الاستشفاء العضلي",
//       ],

//       addWorkout: (workout) =>
//         set((state) => ({
//           workouts: [...state.workouts, workout],
//         })),

//       addTip: (tip) =>
//         set((state) => ({
//           tips: [...state.tips, tip],
//         })),

//       deleteWorkout: (id) =>
//         set((state) => ({
//           workouts: state.workouts.filter((w) => w.id !== id),
//         })),
//     }),
//     { name: "content-storage" },
//   ),
// );
