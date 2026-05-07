export type Role = "USER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  points: number; // نقاط الولاء
  tier: "Bronze" | "Silver" | "Gold"; // مستوى العضوية
  streak: number; // الأيام المتتالية
  joinedDate: string;
}

export type WorkoutLevel = "Beginner" | "Medium" | "Advanced";
export type WorkoutCategory =
  | "Yoga"
  | "HIIT"
  | "Strength"
  | "Mobility"
  | "Wellness";

export interface Workout {
  id: string;
  title: string;
  duration: number; // بالدقائق
  level: WorkoutLevel;
  category: WorkoutCategory;
  thumbnail: string; // صورة التمرين
  videoUrl: string;
  isCompleted?: boolean; // لمتابعة الإنجاز[cite: 1]
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon?: string;
  participants: number; // عدد المشاركات[cite: 1]
  progress: number; // نسبة الإنجاز للمستخدم الحالي[cite: 1]
  status: "Active" | "Coming Soon";
  rewardPoints: number; // النقاط اللي بتربحها عند الإكمال
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  timeToPrepare: string;
  image: string;
  category: "Breakfast" | "Lunch" | "Dinner" | "Snack";
}

export interface NutritionTip {
  id: number;
  title: string;
  description: string;
}

// البدائل الذكية المذكورة في التصميم[cite: 1]
export interface HealthySwap {
  oldItem: string;
  newItem: string;
  benefit: string;
}

export interface WeeklyActivity {
  day: string; // MON, TUE...
  value: number; // قيمة النشاط للبار تشارت[cite: 1]
}

export interface UserStats {
  weight: number;
  restingHR: number;
  avgSleep: number;
  timeSpent: number; // إجمالي الوقت بالدقائق[cite: 1]
}
