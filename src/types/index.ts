import type { JSX } from "react";

export type Role = "USER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  avatar?: string;
  points: number; // نقاط الولاء
  tier: "Bronze" | "Silver" | "Gold"; // مستوى العضوية
  streak: number; // الأيام المتتالية
  joinedDate: string;
  photoURL?: string;
  beforeImg?: string;
  afterImg?: string;
}

export type WorkoutLevel =
  | "Beginner"
  | "Medium"
  | "Advanced"
  | "مبتدئ"
  | "متوسط"
  | "متقدم"
  | "عام";
export type WorkoutCategory =
  | "Yoga"
  | "HIIT"
  | "Strength"
  | "Mobility"
  | "Wellness";

export interface Workout {
  id: string;
  title: string;
  duration: number | string; // يقبل عدد الدقائق أو نص مثل "25 دقيقة"
  level?: WorkoutLevel | string;
  category?: WorkoutCategory;
  thumbnail?: string; // صورة التمرين الأساسية
  image?: string; // أضفناها كبديل لدعم رابط الصور في البيانات الافتراضية
  videoUrl?: string;
  isCompleted?: boolean; // لمتابعة الإنجاز
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon?: string;
  participants: number; // عدد المشاركات
  progress: number; // نسبة الإنجاز للمستخدم الحالي
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

// البدائل الذكية المذكورة في التصميم
export interface HealthySwap {
  oldItem: string;
  newItem: string;
  benefit: string;
}

export interface WeeklyActivity {
  day: string; // MON, TUE...
  value: number; // قيمة النشاط للبار تشارت
}

export interface UserStats {
  weight: number;
  restingHR: number;
  avgSleep: number;
  timeSpent: number; // إجمالي الوقت بالدقائق
}

export interface ChallengeItem {
  id: number;
  title: string;
  icon: JSX.Element;
  points: number;
  target: number;
  current: number;
  isBig: boolean;
  desc: string;
  completed?: boolean; // علامة الاستفهام تعني أنه اختياري
}

// واجهة رد سيرفر كلاوديناري المتوقع
export interface CloudinaryUploadResponse {
  secure_url: string;
  [key: string]: unknown; // للسماح بالحقول الأخرى التي يرجعها السيرفر دون مشاكل
}

// واجهة البيانات التي سيتم إرسالها لـ Firestore
export interface UserUpdateFields {
  photoURL?: string;
  beforeImg?: string;
  afterImg?: string;
}
