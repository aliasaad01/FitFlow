import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // تصحيح الاستيراد وحل مشكلة التكرار والمكتبة
import { useNutritionStore } from "../../store/nutritionStore";
import {
  FaUtensils,
  FaLightbulb,
  FaExchangeAlt,
  FaLeaf,
  FaChevronLeft,
} from "react-icons/fa";

// البيانات الاحتياطية (Fallback) مع إضافة حقل الـ id لحل خطأ الـ TypeScript
const localFallback = {
  recipes: [
    {
      id: "f1",
      title: "بودينغ بذور الشيا والتوت",
      calories: "180 سعرة",
      ingredients: "بذور شيا، حليب لوز، عسل، توت بري",
      image: "/imges/nutrition-1.jfif",
    },
    {
      id: "f2",
      title: "توست الأفوكادو بالبيض",
      calories: "250 سعرة",
      ingredients: "خبز بر، أفوكادو، بيض مسلوق، فلفل أحمر",
      image: "/imges/nutrition-2.jfif",
    },
    {
      id: "f3",
      title: "كاسات الزبادي والجرانولا",
      calories: "210 سعرة",
      ingredients: "زبادي يوناني، جرانولا منزلية، مكسرات، عسل",
      image: "/imges/nutrition-3.jfif",
    },
    {
      id: "f4",
      title: "سلطة الكينوا والحمص",
      calories: "320 سعرة",
      ingredients: "كينوا، حمص مسلوق، بقدونس، خيار، ليمون",
      image: "/imges/nutrition-4.jfif",
    },
    {
      id: "f5",
      title: "رول الدجاج بالخس",
      calories: "280 سعرة",
      ingredients: "صدور دجاج مشوية، أوراق خس كبيرة، صوص زبادي",
      image: "/imges/nutrition-5.jfif",
    },
    {
      id: "f6",
      title: "سلطة التونة بالذرة",
      calories: "240 سعرة",
      ingredients: "تونة بالماء، ذرة، فلفل ملون، زيت زيتون",
      image: "/imges/nutrition-6.jfif",
    },
    {
      id: "f7",
      title: "شوربة العدس والليمون",
      calories: "150 سعرة",
      ingredients: "عدس أصفر، بصل، كمون، عصير ليمون",
      image: "/imges/nutrition-7.jfif",
    },
    {
      id: "f8",
      title: "كرات الطاقة بالتمر",
      calories: "90 سعرة/حبة",
      ingredients: "تمر، شوفان، زبدة فول سوداني، كاكاو خام",
      image: "/imges/nutrition-8.jfif",
    },
  ],
  swaps: [
    {
      id: "s1",
      bad: "الخبز الأبيض",
      good: "خبز الحبوب الكاملة",
      why: "ألياف أكثر وشبع يدوم لفترة أطول.",
    },
    {
      id: "s2",
      bad: "السكر الأبيض",
      good: "ستيفيا أو عسل طبيعي",
      why: "تجنب ارتفاع مستويات الأنسولين المفاجئ.",
    },
    {
      id: "s3",
      bad: "البطاطس المقلية",
      good: "البطاطس الحلوة المشوية",
      why: "فيتامين A أكثر ومؤشر غلايسمي أقل.",
    },
    {
      id: "s4",
      bad: "المشروبات الغازية",
      good: "مياه فوارة مع ليمون",
      why: "ترطيب حقيقي بدون سكريات مضافة.",
    },
    {
      id: "s5",
      bad: "الزيوت المهدرجة",
      good: "زيت الزيتون أو بخاخ الزبدة",
      why: "دهون صحية تدعم صحة القلب والهرمونات.",
    },
    {
      id: "s6",
      bad: "الأرز الأبيض",
      good: "أرز القرنبيط أو الكينوا",
      why: "سعرات أقل بـ 70% بروتين أعلى.",
    },
    {
      id: "s7",
      bad: "الحلويات المصنعة",
      good: "فواكه مجففة أو شوكولاتة داكنة",
      why: "مضادات أكسدة وسكر طبيعي غير مكرر.",
    },
    {
      id: "s8",
      bad: "صوص المايونيز",
      good: "صوص الزبادي والثوم",
      why: "بروتين أعلى ودهون أقل بكثير.",
    },
  ],
  tips: [
    {
      id: "t1",
      title: "قاعدة الـ 80/20",
      desc: "كلي بذكاء ونظام 80% من وقتك، واتركي 20% للاستمتاع بوجباتك المفضلة بمرونة.",
    },
    {
      id: "t2",
      title: "التنفس قبل الأكل",
      desc: "خذي 3 أنفاس عميقة قبل البدء بالأكل لتهدئة الجهاز العصبي وتحسين الهضم.",
    },
    {
      id: "t3",
      title: "شرب الماء والانتظار",
      desc: "أحياناً يشعر الجسم بالعطش ويترجمه كجوع، اشربي كأساً وانتظري 10 دقائق.",
    },
    {
      id: "t4",
      title: "قاعدة المضغ البطئ",
      desc: "امضغي اللقمة 15-20 مرة؛ هذا يعطي الدماغ وقتاً لإرسال إشارات الشبع (تحتاج 20 دقيقة).",
    },
    {
      id: "t5",
      title: "البروتين أولاً",
      desc: "ابدئي وجبتك بالبروتين ثم الألياف ثم الكربوهيدرات لتقليل امتصاص السكر.",
    },
    {
      id: "t6",
      title: "النوم والشهية",
      desc: "قلة النوم ترفع هرمون الجوع (Ghrelin) وتصعب عليكِ مقاومة السكريات.",
    },
    {
      id: "t7",
      title: "الخضروات الورقية",
      desc: "اجعلي نصف طبقك دائماً من الخضروات الورقية؛ حجم كبير وسعرات شبه معدومة.",
    },
    {
      id: "t8",
      title: "تحضير الوجبات (Meal Prep)",
      desc: "تجهيز وجباتك مسبقاً يحميكِ من خيارات اللحظة الأخيرة غير الصحية عند الجوع.",
    },
  ],
};

const Nutrition = () => {
  const [activeTab, setActiveTab] = useState("recipes");
  const { recipes, swaps, tips, isLoading, fetchNutritionData } =
    useNutritionStore();

  useEffect(() => {
    const unsubscribe = fetchNutritionData();
    return () => unsubscribe();
  }, [fetchNutritionData]);

  const categories = [
    { id: "recipes", label: "وصفات", icon: <FaUtensils /> },
    { id: "swaps", label: "بدائل", icon: <FaExchangeAlt /> },
    { id: "tips", label: "نصائح", icon: <FaLightbulb /> },
  ];

  const currentRecipes = recipes.length > 0 ? recipes : localFallback.recipes;
  const currentSwaps = swaps.length > 0 ? swaps : localFallback.swaps;
  const currentTips = tips.length > 0 ? tips : localFallback.tips;

  return (
    <div
      className="max-w-6xl mx-auto px-4 py-6 md:py-12 space-y-8 text-right mb-20 md:mb-0"
      dir="rtl"
    >
      {/* 1. Header Section */}
      <section className="space-y-2">
        <motion.h1
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl md:text-5xl font-black text-white leading-tight"
        >
          وقود <span className="text-brand-primary">الإزهار</span> 🌿
        </motion.h1>
        <p className="text-gray-400 text-sm md:text-lg max-w-xl">
          التغذية هي 70% من النتيجة. اكتشفي خياراتنا المختارة لتعزيز طاقتكِ
          السحابية.
        </p>
      </section>

      {/* 2. Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all
                ${
                  activeTab === cat.id
                    ? "bg-brand-primary text-white shadow-[0_0_20px_rgba(255,105,180,0.3)]"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }
              `}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && recipes.length === 0 && (
        <div className="text-center p-10 text-gray-500 animate-pulse">
          جاري فحص البيانات السحابية...
        </div>
      )}

      {/* 3. Content Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
        <AnimatePresence>
          {activeTab === "recipes" &&
            currentRecipes.map((recipe, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={recipe.id || i}
                className="bg-card-bg border border-white/5 rounded-[28px] overflow-hidden group active:scale-[0.98] transition-transform"
              >
                <div className="h-52 md:h-60 overflow-hidden relative">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white border border-white/10">
                    {recipe.calories}
                  </div>
                </div>
                <div className="p-5 md:p-6 space-y-2">
                  <h3 className="text-lg md:text-xl font-bold text-white leading-tight">
                    {recipe.title}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 italic">
                    المكونات: {recipe.ingredients}
                  </p>
                  <div className="pt-4 flex items-center text-brand-primary text-xs font-bold gap-1 cursor-pointer">
                    مشاهدة التفاصيل <FaChevronLeft size={8} />
                  </div>
                </div>
              </motion.div>
            ))}

          {activeTab === "swaps" &&
            currentSwaps.map((swap, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                key={swap.id || i}
                className="bg-card-bg border border-white/10 p-6 rounded-[28px] flex flex-col justify-between gap-4 relative overflow-hidden group"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="text-center flex-1">
                    <p className="text-[10px] text-gray-500 uppercase mb-1 font-bold">
                      بدلاً من
                    </p>
                    <span className="text-red-400/80 line-through text-sm font-medium">
                      {swap.bad}
                    </span>
                  </div>
                  <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary group-hover:rotate-180 transition-transform duration-500">
                    <FaExchangeAlt />
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-[10px] text-gray-500 uppercase mb-1 font-bold">
                      اختاري
                    </p>
                    <span className="text-green-400 font-bold text-sm">
                      {swap.good}
                    </span>
                  </div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl text-[11px] text-gray-400 text-center leading-relaxed">
                  {swap.why}
                </div>
              </motion.div>
            ))}

          {activeTab === "tips" &&
            currentTips.map((tip, i) => (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                key={tip.id || i}
                className="bg-linear-to-br from-brand-primary/10 to-transparent border border-brand-primary/20 p-6 rounded-[28px] relative group"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-brand-primary text-white p-3 rounded-2xl shadow-lg shadow-brand-primary/20 group-hover:scale-110 transition-transform">
                    <FaLeaf size={16} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">
                      {tip.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {tip.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

      {/* 4. Bottom Info */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-[28px] text-center md:text-right">
        <h4 className="text-white font-bold mb-2 flex items-center gap-2 justify-center md:justify-start">
          <FaLightbulb className="text-brand-primary" /> هل لديكِ استفسار?
        </h4>
        <p className="text-xs text-gray-400 leading-relaxed">
          يمكنكِ دائماً مراسلة خبيرة التغذية عبر قسم المحادثة للحصول على خطة
          مخصصة تناسب احتياجاتكِ الصحية.
        </p>
      </div>
    </div>
  );
};

export default Nutrition;
