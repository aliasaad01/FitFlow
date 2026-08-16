// src/pages/clubs/Clubs.tsx
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaStar } from "react-icons/fa";

// ============================================================================
// 1. التعريفات والأنواع (TypeScript Interfaces & Types)
// ============================================================================
export type CityType = "دمشق" | "طرطوس" | "اللاذقية";
export type GymFilterType = "سيدات فقط" | "مكس" | "الكل";
export type GymType = "سيدات فقط" | "مكس" | "رجال";

export interface Gym {
  id: string;
  name: string;
  city: CityType;
  district: string;
  type: GymType;
  coaches: string[];
  rating: number;
  price: string;
}

export interface FormDataState {
  age: number;
  weight: number;
  height: number;
  city: CityType;
  goal: string;
  gymType: GymFilterType;
}

export interface WorkoutRecommendation {
  title: string;
  desc: string;
  frequency: string;
  focus: string;
}

export interface RecommendedProduct {
  id: string;
  title: string;
  reason: string;
  store: string;
  price: string;
}

// ============================================================================
// 2. قاعدة بيانات النوادي والمدربين
// ============================================================================
const GYMS_DATABASE: Gym[] = [
  // --- دمشق ---
  {
    id: "d1",
    name: "نادي الوردة الذهبية",
    city: "دمشق",
    district: "أبو رمانة",
    type: "سيدات فقط",
    coaches: ["كوتش ريم (زومبا وتخسيس)", "كوتش ندى (بيلاتس)"],
    rating: 4.9,
    price: "200,000 ل.س",
  },
  {
    id: "d2",
    name: "أكاديمية أبطال المزرعة",
    city: "دمشق",
    district: "المزرعة",
    type: "مكس",
    coaches: ["كوتش أسامة (فتنس)", "كوتش سارة (كارديو)"],
    rating: 4.8,
    price: "170,000 ل.س",
  },
  {
    id: "d3",
    name: "مركز المزة الرياضي",
    city: "دمشق",
    district: "المزة",
    type: "مكس",
    coaches: ["كوتش سامر (قوة بدنية)", "كوتش لين (تنسيق قوام)"],
    rating: 4.7,
    price: "180,000 ل.س",
  },
  {
    id: "d4",
    name: "نادي اللياقة الأنثوي",
    city: "دمشق",
    district: "الشعلان",
    type: "سيدات فقط",
    coaches: ["كوتش هبة (كارديو وحرق)", "كوتش ياسمين (يوغا)"],
    rating: 4.9,
    price: "220,000 ل.س",
  },
  {
    id: "d5",
    name: "فتنس سنتر مشروع دمر",
    city: "دمشق",
    district: "مشروع دمر",
    type: "مكس",
    coaches: ["كوتش فادي (كمال أجسام)", "كوتش أمل (سويدي)"],
    rating: 4.8,
    price: "250,000 ل.س",
  },
  {
    id: "d6",
    name: "نادي المالكي السكني",
    city: "دمشق",
    district: "المالكي",
    type: "سيدات فقط",
    coaches: ["كوتش مايا (بيلاتس وتنشيف)"],
    rating: 5.0,
    price: "300,000 ل.س",
  },

  // --- طرطوس ---
  {
    id: "t1",
    name: "نادي الشاطئ الذهبي",
    city: "طرطوس",
    district: "الكورنيش البحري",
    type: "سيدات فقط",
    coaches: ["كوتش رشا (كارديو وآلات)", "كوتش منار (زومبا)"],
    rating: 4.9,
    price: "140,000 ل.س",
  },
  {
    id: "t2",
    name: "مركز طرطوس الرياضي",
    city: "طرطوس",
    district: "المشروع السادس",
    type: "مكس",
    coaches: ["كوتش علي (مقاومة)", "كوتش ديمة (لياقة)"],
    rating: 4.8,
    price: "130,000 ل.س",
  },
  {
    id: "t3",
    name: "نادي أولمبيا التخصصي",
    city: "طرطوس",
    district: "شارع الثورة",
    type: "مكس",
    coaches: ["كوتش حيدر (كمال أجسام)", "كوتش نور (تخسيس)"],
    rating: 4.7,
    price: "150,000 ل.س",
  },
  {
    id: "t4",
    name: "فينيسيا للياقة الأنثوية",
    city: "طرطوس",
    district: "العريض",
    type: "سيدات فقط",
    coaches: ["كوتش لونا (بيلاتس وحرق)"],
    rating: 4.9,
    price: "160,000 ل.س",
  },

  // --- اللاذقية ---
  {
    id: "l1",
    name: "نادي مارينا الرياضي",
    city: "اللاذقية",
    district: "الكورنيش الجنوبي",
    type: "سيدات فقط",
    coaches: ["كوتش سهى (فتنس)", "كوتش ديانا (كارديو)"],
    rating: 4.9,
    price: "160,000 ل.س",
  },
  {
    id: "l2",
    name: "أكاديمية أوغاريت للياقة",
    city: "اللاذقية",
    district: "الزراعة",
    type: "مكس",
    coaches: ["كوتش ماهر (تضخيم)", "كوتش علا (سويدي)"],
    rating: 4.8,
    price: "150,000 ل.س",
  },
  {
    id: "l3",
    name: "نادي مشروع الصليبة",
    city: "اللاذقية",
    district: "الصليبة",
    type: "مكس",
    coaches: ["كوتش وائل (مقاومة)", "كوتش ريم (تخسيس)"],
    rating: 4.7,
    price: "130,000 ل.س",
  },
  {
    id: "l4",
    name: "نادي الأشرعة الزرقاء",
    city: "اللاذقية",
    district: "مشروع السابع",
    type: "سيدات فقط",
    coaches: ["كوتش حنان (يوغا وبيلاتس)"],
    rating: 4.9,
    price: "170,000 ل.س",
  },
];

const Clubs: React.FC = () => {
  const [formData, setFormData] = useState<FormDataState>({
    age: 24,
    weight: 65,
    height: 165,
    city: "دمشق",
    goal: "تخسيس وحرق سعرات",
    gymType: "سيدات فقط",
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // حالة التحكم بالنافذة المنبثقة والجيم المختار
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  const [selectedCoach, setSelectedCoach] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>(
    "صباحاً (9:00 - 12:00)",
  );
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  const bmi = useMemo<string>(() => {
    const heightInMeters = formData.height / 100;
    return (formData.weight / (heightInMeters * heightInMeters)).toFixed(1);
  }, [formData.weight, formData.height]);

  const filteredGyms = useMemo<Gym[]>(() => {
    return GYMS_DATABASE.filter((gym) => {
      const matchCity = gym.city === formData.city;
      const matchType =
        formData.gymType === "الكل" || gym.type === formData.gymType;
      return matchCity && matchType;
    });
  }, [formData.city, formData.gymType]);

  const workoutRecommendation = useMemo<WorkoutRecommendation>(() => {
    if (formData.goal === "تخسيس وحرق سعرات") {
      return {
        title: "برنامج حرق الدهون والتنشيف الشديد (HIIT & Cardio)",
        desc: `بناءً على عمركِ (${formData.age} سنة) ومؤشر جسمكِ (${bmi})، يوصي النظام بالتركيز على تمارين الكارديو المتواتر 4 أيام أسبوعياً مع تمارين المقاومة الخفيفة لتنشيط الحرق.`,
        frequency: "4 - 5 أيام / أسبوعياً",
        focus: "كارديو + مشي سريع + تمارين وزن الجسم",
      };
    } else if (formData.goal === "بناء عضلات وتنسيق قوام") {
      return {
        title: "برنامج المقاومة والتأهيل العضلي (Hypertrophy)",
        desc: `النموذج يوصي بتمارين المقاومة والأوزان التدريجية لتنسيق القوام وزيادة الكتلة العضلية مع راحة كافية بين الجولات.`,
        frequency: "3 - 4 أيام / أسبوعياً",
        focus: "أوزان متوسطة + تمارين السحب والدفع",
      };
    } else {
      return {
        title: "برنامج اللياقة المرنة والصحة العامة",
        desc: `نظام متوازن يدمج بين السويدي، البيلاتس، واليوغا لتحسين مرونة المفاصل والدورة الدموية.`,
        frequency: "3 أيام / أسبوعياً",
        focus: "مرونة + بيلاتس + تمارين إطالة",
      };
    }
  }, [formData.goal, formData.age, bmi]);

  const recommendedProducts = useMemo<RecommendedProduct[]>(() => {
    const cityStores: Record<CityType, string> = {
      دمشق: "متجر الفيتامينات - الشعلان",
      طرطوس: "محل الصيدلي الرياضي - الشارع العريض",
      اللاذقية: "المتجر الرياضي المباشر - حي الزراعة",
    };

    const currentStore = cityStores[formData.city];

    if (formData.goal === "تخسيس وحرق سعرات") {
      return [
        {
          id: "1",
          title: "مكمل L-Carnitine لحرق الدهون",
          reason: "يحفز تحويل الدهون إلى طاقة أثناء تمارين الكارديو.",
          store: currentStore,
          price: "180,000 ل.س",
        },
        {
          id: "2",
          title: "حبل قفز ذكي بعداد سعرات",
          reason: "مناسب لرفع معدل النبض وحرق السعرات بالمنزل أو الجيم.",
          store: currentStore,
          price: "75,000 ل.س",
        },
        {
          id: "3",
          title: "مشروب ألياف وبروتين نباتي",
          reason: "يساعد على الشبع وتقليل الشهية طوال اليوم.",
          store: currentStore,
          price: "210,000 ل.س",
        },
      ];
    } else {
      return [
        {
          id: "1",
          title: "مكمل واي بروتين (Whey Isolate)",
          reason: "لتسريع الاستشفاء العضلي وبناء الألياف بعد تمارين المقاومة.",
          store: currentStore,
          price: "480,000 ل.س",
        },
        {
          id: "2",
          title: "أحزمة وسوار دعم المعصم",
          reason: "لحماية المفاصل عند رفع الأوزان في الصالة.",
          store: currentStore,
          price: "60,000 ل.س",
        },
        {
          id: "3",
          title: "مكمل كيراتين مونوهايدريت Pure",
          reason: "زيادة الطاقة والقوة العضلية أثناء التمارين المكثفة.",
          store: currentStore,
          price: "220,000 ل.س",
        },
      ];
    }
  }, [formData.goal, formData.city]);

  // دالة فتح النافذة
  const handleOpenGymModal = (gym: Gym) => {
    setSelectedGym(gym);
    setSelectedCoach(gym.coaches[0] || "");
    setBookingSuccess(false);
  };

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-12 space-y-10 text-right"
      dir="rtl"
    >
      <section className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
          المستشار الذكي وتوصيات الأندية
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          أدخلي بياناتك الشخصية للحصول على التوصيات والبرنامج الرياضي المخصص لكِ
        </p>
      </section>

      {/* 1. الفورم الرئيسي */}
      <section className="bg-card-bg border border-brand-primary/30 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="border-b border-white/10 pb-4 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">بيانات المتدربة</h2>
          <span className="text-xs bg-brand-primary/10 text-brand-primary font-bold px-3 py-1 rounded-full border border-brand-primary/20">
            خطوة 1 من 2
          </span>
        </div>

        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setIsSubmitted(true);
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          <div>
            <label className="text-xs text-gray-400 font-bold block mb-2">
              المحافظة / المدينة:
            </label>
            <select
              value={formData.city}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setFormData({ ...formData, city: e.target.value as CityType });
                setIsSubmitted(false);
              }}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-white text-sm focus:outline-none focus:border-brand-primary"
            >
              <option value="دمشق" className="bg-card-bg">
                دمشق وريفها
              </option>
              <option value="طرطوس" className="bg-card-bg">
                طرطوس
              </option>
              <option value="اللاذقية" className="bg-card-bg">
                اللاذقية
              </option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400 font-bold block mb-2">
              الهدف الرياضي:
            </label>
            <select
              value={formData.goal}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setFormData({ ...formData, goal: e.target.value });
                setIsSubmitted(false);
              }}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-white text-sm focus:outline-none focus:border-brand-primary"
            >
              <option value="تخسيس وحرق سعرات" className="bg-card-bg">
                تخسيس وخسارة وزن
              </option>
              <option value="بناء عضلات وتنسيق قوام" className="bg-card-bg">
                بناء كتلة عضلية وتنسيق
              </option>
              <option value="لياقة عامة ومرونة" className="bg-card-bg">
                لياقة وصحة عامة
              </option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400 font-bold block mb-2">
              تفضيل الصالة الرياضية:
            </label>
            <select
              value={formData.gymType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setFormData({
                  ...formData,
                  gymType: e.target.value as GymFilterType,
                });
                setIsSubmitted(false);
              }}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-white text-sm focus:outline-none focus:border-brand-primary"
            >
              <option value="سيدات فقط" className="bg-card-bg">
                سيدات فقط
              </option>
              <option value="مكس" className="bg-card-bg">
                مختلط (مكس)
              </option>
              <option value="الكل" className="bg-card-bg">
                جميع الصالات المتاحة
              </option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400 font-bold block mb-2">
              العمر (سنة):
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData({ ...formData, age: Number(e.target.value) });
                setIsSubmitted(false);
              }}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-white text-sm focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 font-bold block mb-2">
              الوزن (كغ):
            </label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData({ ...formData, weight: Number(e.target.value) });
                setIsSubmitted(false);
              }}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-white text-sm focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 font-bold block mb-2">
              الطول (سم):
            </label>
            <input
              type="number"
              value={formData.height}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData({ ...formData, height: Number(e.target.value) });
                setIsSubmitted(false);
              }}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-white text-sm focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="md:col-span-3 pt-2">
            <button
              type="submit"
              className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl hover:bg-brand-primary/90 transition-all text-sm cursor-pointer"
            >
              عرض التوصيات والنتائج المخصصة
            </button>
          </div>
        </form>
      </section>

      {/* 2. النتائج والتوصيات */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="space-y-10"
          >
            {/* أ) برنامج التمارين */}
            <section className="bg-card-bg border border-white/10 rounded-3xl p-6 md:p-8 space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h2 className="text-xl font-bold text-white">
                  البرنامج الرياضي المقترح لكِ
                </h2>
                <span className="text-xs text-gray-400">
                  BMI: <strong className="text-brand-primary">{bmi}</strong>
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-bold text-brand-primary">
                  {workoutRecommendation.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {workoutRecommendation.desc}
                </p>

                <div className="flex flex-wrap gap-3 pt-2 text-xs">
                  <span className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-gray-300">
                    التكرار:{" "}
                    <strong className="text-white">
                      {workoutRecommendation.frequency}
                    </strong>
                  </span>
                  <span className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-gray-300">
                    التركيز:{" "}
                    <strong className="text-white">
                      {workoutRecommendation.focus}
                    </strong>
                  </span>
                </div>
              </div>
            </section>

            {/* ب) بطاقات الأندية قابلة للنقر بالكامل */}
            <section className="space-y-5">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">
                  الأندية والمدربات في ({formData.city}):
                </h2>
                <span className="text-xs text-gray-400">
                  {filteredGyms.length} نتائج
                </span>
              </div>

              {filteredGyms.length === 0 ? (
                <div className="text-center py-8 text-gray-400 bg-card-bg rounded-2xl border border-white/5 text-sm">
                  لا توجد صالات مطابقة للتفضيل المختارة حالياً.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredGyms.map((gym) => (
                    <div
                      key={gym.id}
                      onClick={() => handleOpenGymModal(gym)}
                      className="bg-card-bg border border-white/5 p-6 rounded-3xl space-y-4 hover:border-brand-primary/60 transition-all flex flex-col justify-between cursor-pointer group hover:bg-white/2"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h3 className="text-base font-bold text-white group-hover:text-brand-primary transition-colors">
                            {gym.name}
                          </h3>
                          <span className="text-xs text-yellow-400 font-bold flex items-center gap-1">
                            <FaStar size={12} /> {gym.rating}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">
                          {gym.city} - {gym.district} ({gym.type})
                        </p>
                        <p className="text-xs text-gray-300 pt-1">
                          المدربات: {gym.coaches.join(" ، ")}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-primary">
                          {gym.price}
                        </span>
                        <span className="bg-brand-primary/10 group-hover:bg-brand-primary text-brand-primary group-hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all border border-brand-primary/20">
                          اختيار الجيم والمدربة
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ج) المكملات والأدوات */}
            <section className="bg-card-bg border border-white/10 rounded-3xl p-6 md:p-8 space-y-5">
              <h2 className="text-xl font-bold text-white">
                توصيات المستلزمات والمكملات
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-white">
                        {prod.title}
                      </h3>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {prod.reason}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-white/5 text-xs flex justify-between items-center">
                      <span className="text-gray-400">{prod.store}</span>
                      <span className="text-green-400 font-bold">
                        {prod.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. نافذة تفاصيل اختيار الجيم والمدربة (Modal) */}
      <AnimatePresence>
        {selectedGym && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedGym(null)} // إغلاق عند النقر خارج النافذة
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()} // منع الإغلاق عند النقر داخل النافذة
              className="bg-card-bg border border-brand-primary/30 rounded-3xl p-6 md:p-8 w-full max-w-lg space-y-6 text-right relative shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h3 className="text-lg font-bold text-white">
                  حجز مخصص: {selectedGym.name}
                </h3>
                <button
                  onClick={() => setSelectedGym(null)}
                  className="text-gray-400 hover:text-white text-sm cursor-pointer p-1"
                >
                  ✕
                </button>
              </div>

              {!bookingSuccess ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 font-bold block mb-2">
                      اختاري الكوتش / المدربة المفضلة:
                    </label>
                    <select
                      value={selectedCoach}
                      onChange={(e) => setSelectedCoach(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-white text-sm focus:outline-none focus:border-brand-primary"
                    >
                      {selectedGym.coaches.map((coach, index) => (
                        <option
                          key={index}
                          value={coach}
                          className="bg-card-bg"
                        >
                          {coach}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 font-bold block mb-2">
                      التوقيت المفضل للتدريب:
                    </label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-white text-sm focus:outline-none focus:border-brand-primary"
                    >
                      <option
                        value="صباحاً (9:00 - 12:00)"
                        className="bg-card-bg"
                      >
                        الفترة الصباحية (9:00 - 12:00)
                      </option>
                      <option
                        value="ظهراً (12:00 - 4:00)"
                        className="bg-card-bg"
                      >
                        فترة الظهيرة (12:00 - 4:00)
                      </option>
                      <option
                        value="مساءً (4:00 - 8:00)"
                        className="bg-card-bg"
                      >
                        الفترة المسائية (4:00 - 8:00)
                      </option>
                    </select>
                  </div>

                  <div className="bg-white/5 p-4 rounded-2xl space-y-1 text-xs text-gray-300">
                    <p>
                      المكان:{" "}
                      <strong className="text-white">
                        {selectedGym.city} - {selectedGym.district}
                      </strong>
                    </p>
                    <p>
                      تكلفة الاشتراك:{" "}
                      <strong className="text-brand-primary">
                        {selectedGym.price}
                      </strong>
                    </p>
                  </div>

                  <button
                    onClick={() => setBookingSuccess(true)}
                    className="w-full py-3.5 bg-brand-primary text-white font-bold rounded-2xl hover:bg-brand-primary/90 transition-all text-sm cursor-pointer"
                  >
                    تأكيد حجز الحصة التجريبية
                  </button>
                </div>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <div className="text-brand-primary flex justify-center">
                    <FaCheckCircle size={48} />
                  </div>
                  <h4 className="text-lg font-bold text-white">
                    تم تسجيل الطلب بنجاح!
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed max-w-sm mx-auto">
                    تم توجيه طلبكِ لنادي{" "}
                    <strong className="text-white">{selectedGym.name}</strong>{" "}
                    مع الكوتش{" "}
                    <strong className="text-brand-primary">
                      {selectedCoach}
                    </strong>{" "}
                    ({selectedTime}). سيتم التواصل معكِ لتأكيد الموعد.
                  </p>
                  <button
                    onClick={() => setSelectedGym(null)}
                    className="mt-4 px-6 py-2.5 bg-white/10 text-white rounded-xl text-xs font-bold hover:bg-white/20 transition-all cursor-pointer"
                  >
                    العودة للتوصيات
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Clubs;
