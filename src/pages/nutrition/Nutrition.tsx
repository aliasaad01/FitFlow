import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUtensils,
  FaLightbulb,
  FaExchangeAlt,
  FaLeaf,
  FaChevronLeft,
} from "react-icons/fa";

const Nutrition = () => {
  const [activeTab, setActiveTab] = useState("recipes");

  const categories = [
    { id: "recipes", label: "وصفات", icon: <FaUtensils /> },
    { id: "swaps", label: "بدائل", icon: <FaExchangeAlt /> },
    { id: "tips", label: "نصائح", icon: <FaLightbulb /> },
  ];

  const content = {
    recipes: [
      // وجبات خفيفة وفطور
      {
        title: "بودينغ بذور الشيا والتوت",
        calories: "180 سعرة",
        ingredients: "بذور شيا، حليب لوز، عسل، توت بري",
        image:
          "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=500",
      },
      {
        title: "توست الأفوكادو بالبيض",
        calories: "250 سعرة",
        ingredients: "خبز بر، أفوكادو، بيض مسلوق، فلفل أحمر",
        image:
          "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=500",
      },
      {
        title: "كاسات الزبادي والجرانولا",
        calories: "210 سعرة",
        ingredients: "زبادي يوناني، جرانولا منزلية، مكسرات، عسل",
        image:
          "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=500",
      },

      // وجبات غداء خفيفة
      {
        title: "سلطة الكينوا والحمص",
        calories: "320 سعرة",
        ingredients: "كينوا، حمص مسلوق، بقدونس، خيار، ليمون",
        image:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500",
      },
      {
        title: "رول الدجاج بالخس",
        calories: "280 سعرة",
        ingredients: "صدور دجاج مشوية، أوراق خس كبيرة، صوص زبادي",
        image:
          "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=500",
      },
      {
        title: "سلطة التونة بالذرة",
        calories: "240 سعرة",
        ingredients: "تونة بالماء، ذرة، فلفل ملون، زيت زيتون",
        image:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500",
      },

      // وجبات عشاء وسناك
      {
        title: "شوربة العدس والليمون",
        calories: "150 سعرة",
        ingredients: "عدس أصفر، بصل، كمون، عصير ليمون",
        image:
          "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=500",
      },
      {
        title: "كرات الطاقة بالتمر",
        calories: "90 سعرة/حبة",
        ingredients: "تمر، شوفان، زبدة فول سوداني، كاكاو خام",
        image:
          "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=500",
      },
    ],
    swaps: [
      {
        bad: "الخبز الأبيض",
        good: "خبز الحبوب الكاملة",
        why: "ألياف أكثر وشبع يدوم لفترة أطول.",
      },
      {
        bad: "السكر الأبيض",
        good: "ستيفيا أو عسل طبيعي",
        why: "تجنب ارتفاع مستويات الأنسولين المفاجئ.",
      },
      {
        bad: "البطاطس المقلية",
        good: "البطاطس الحلوة المشوية",
        why: "فيتامين A أكثر ومؤشر غلايسمي أقل.",
      },
      {
        bad: "المشروبات الغازية",
        good: "مياه فوارة مع ليمون",
        why: "ترطيب حقيقي بدون سكريات مضافة.",
      },
      {
        bad: "الزيوت المهدرجة",
        good: "زيت الزيتون أو بخاخ الزبدة",
        why: "دهون صحية تدعم صحة القلب والهرمونات.",
      },
      {
        bad: "الأرز الأبيض",
        good: "أرز القرنبيط أو الكينوا",
        why: "سعرات أقل بـ 70% وبروتين أعلى.",
      },
      {
        bad: "الحلويات المصنعة",
        good: "فواكه مجففة أو شوكولاتة داكنة",
        why: "مضادات أكسدة وسكر طبيعي غير مكرر.",
      },
      {
        bad: "صوص المايونيز",
        good: "صوص الزبادي والثوم",
        why: "بروتين أعلى ودهون أقل بكثير.",
      },
    ],
    tips: [
      {
        title: "قاعدة الـ 80/20",
        desc: "كلي بذكاء ونظام 80% من وقتك، واتركي 20% للاستمتاع بوجباتك المفضلة بمرونة.",
      },
      {
        title: "التنفس قبل الأكل",
        desc: "خذي 3 أنفاس عميقة قبل البدء بالأكل لتهدئة الجهاز العصبي وتحسين الهضم.",
      },
      {
        title: "شرب الماء والانتظار",
        desc: "أحياناً يشعر الجسم بالعطش ويترجمه كجوع، اشربي كأساً وانتظري 10 دقائق.",
      },
      {
        title: "قاعدة المضغ البطئ",
        desc: "امضغي اللقمة 15-20 مرة؛ هذا يعطي الدماغ وقتاً لإرسال إشارات الشبع (تحتاج 20 دقيقة).",
      },
      {
        title: "البروتين أولاً",
        desc: "ابدئي وجبتك بالبروتين ثم الألياف ثم الكربوهيدرات لتقليل امتصاص السكر.",
      },
      {
        title: "النوم والشهية",
        desc: "قلة النوم ترفع هرمون الجوع (Ghrelin) وتصعب عليكِ مقاومة السكريات.",
      },
      {
        title: "الخضروات الورقية",
        desc: "اجعلي نصف طبقك دائماً من الخضروات الورقية؛ حجم كبير وسعرات شبه معدومة.",
      },
      {
        title: "تحضير الوجبات (Meal Prep)",
        desc: "تجهيز وجباتك مسبقاً يحميكِ من خيارات اللحظة الأخيرة غير الصحية عند الجوع.",
      },
    ],
  };

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
          التغذية هي 70% من النتيجة. اكتشفي خياراتنا المختارة لتعزيز طاقتكِ.
        </p>
      </section>

      {/* 2. Navigation Tabs - Mobile Optimized (Horizontal Scroll) */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl w-fit backdrop-blur-sm">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap
                ${
                  activeTab === cat.id
                    ? "bg-brand-primary text-white shadow-[0_8px_20px_rgba(255,105,180,0.3)]"
                    : "text-gray-400 hover:text-white"
                }
              `}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Content Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
        <AnimatePresence mode="wait">
          {activeTab === "recipes" &&
            content.recipes.map((recipe, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={i}
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
            content.swaps.map((swap, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={i}
                className="bg-white/5 border border-white/10 p-6 rounded-[28px] flex flex-col justify-between gap-4 relative overflow-hidden group"
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
            content.tips.map((tip, i) => (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                key={i}
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

      {/* 4. Bottom Info - Sticky feel for mobile */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-[28px] text-center md:text-right">
        <h4 className="text-white font-bold mb-2 flex items-center gap-2 justify-center md:justify-start">
          <FaLightbulb className="text-brand-primary" /> هل لديكِ استفسار؟
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
