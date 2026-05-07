// src/data/mockData.ts
import type { Workout, Challenge, HealthySwap } from "../types/index";

export const MOCK_WORKOUTS: Workout[] = [
  {
    id: "1",
    title: "يوغا الصباح المريحة",
    duration: 30,
    level: "Beginner",
    category: "Yoga",
    thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
    videoUrl: "#",
  },
  {
    id: "2",
    title: "تمارين هيت للمبتدئين",
    duration: 45,
    level: "Beginner",
    category: "HIIT",
    thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    videoUrl: "#",
  },
];

export const MOCK_CHALLENGES: Challenge[] = [
  {
    id: "c1",
    title: "تحدي 10,000 خطوة",
    description: "نشطي دورتكِ الدموية عبر المشي يومياً",
    participants: 1200,
    progress: 72, // 7,200 من أصل 10,000[cite: 1]
    status: "Active",
    rewardPoints: 100,
  },
  {
    id: "c2",
    title: "عادات الترطيب",
    description: "اشربي 8 أكواب ماء لمدة 30 يوم",
    participants: 3500,
    progress: 37,
    status: "Active",
    rewardPoints: 150,
  },
];

export const HEALTHY_SWAPS: HealthySwap[] = [
  {
    oldItem: "رقائق البطاطس",
    newItem: "فشار محضر بالهواء",
    benefit: "ألياف أعلى وسعرات أقل",
  },
  {
    oldItem: "شوكولاتة الحليب",
    newItem: "70% شوكولاتة داكنة",
    benefit: "مضادات أكسدة وسكر أقل",
  },
];
