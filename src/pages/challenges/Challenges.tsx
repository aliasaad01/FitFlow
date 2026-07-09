import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../store/authStore";
import { useChallengeStore } from "../../store/challengeStore";
import {
  FaWalking,
  FaClock,
  FaCheck,
  FaCalendarCheck,
  FaGlassWhiskey,
  FaGem,
} from "react-icons/fa";
import { BiTargetLock } from "react-icons/bi";

// دالة مساعدة لترجمة النصوص القادمة من Firestore إلى مكونات أيقونات حقيقية
const renderIcon = (iconName: string, size: number) => {
  switch (iconName) {
    case "walking":
      return <FaWalking size={size} />;
    case "clock":
      return <FaClock size={size} />;
    case "glass":
    case "water":
      return <FaGlassWhiskey size={size} />;
    case "gem":
    case "star":
      return <FaGem size={size} />;
    default:
      return <FaGem size={size} />;
  }
};

const Challenges = () => {
  const { user, addPoints } = useAuthStore();
  const { challenges, isLoading, fetchChallenges, completeChallengeInDB } =
    useChallengeStore();
  const [completedId, setCompletedId] = useState<string | null>(null);

  // جلب التحديات عند تحميل الصفحة وإلغاء الاستماع عند الخروج منها لمنع تسريب الذاكرة
  useEffect(() => {
    const unsubscribe = fetchChallenges();
    return () => unsubscribe();
  }, [fetchChallenges]);

  // بيانات أيام الأسبوع للالتزام
  const weekDays = [
    { day: "س", status: "completed" },
    { day: "ح", status: "completed" },
    { day: "ن", status: "completed" },
    { day: "ث", status: "current" },
    { day: "ر", status: "pending" },
    { day: "خ", status: "pending" },
    { day: "ج", status: "pending" },
  ];

  const handleComplete = async (id: string, points: number, target: number) => {
    setCompletedId(id);

    // 1. تحديث نقاط المستخدم في الـ AuthStore وفي جدول الـ Users بـ Firestore
    await addPoints(points);

    // 2. تحديث التحدي في جدول الـ Challenges بـ Firestore
    await completeChallengeInDB(id, target);

    setTimeout(() => setCompletedId(null), 3000);
  };

  return (
    <div
      className="max-w-6xl mx-auto px-4 py-12 space-y-12 text-right"
      dir="rtl"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        {/* 1. الترحيب والعنوان */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
            لوحة التحديات
          </h1>
          <p className="text-gray-400 text-lg">
            حوّلي مجهودكِ اليومي إلى إنجازات ملموسة ✨
          </p>
        </motion.section>

        {/* بوكس النقاط المدمج */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card-bg border border-brand-primary/30 p-3 md:p-4 rounded-2xl flex items-center gap-4 self-start md:self-auto min-w-40"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,105,180,0.3)]">
            <FaGem size={18} />
          </div>
          <div>
            <p className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase">
              نقاطكِ الحالية
            </p>
            <motion.h2
              key={user?.points}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-xl md:text-2xl font-black text-white"
            >
              {user?.points?.toLocaleString() || 0}
            </motion.h2>
          </div>
        </motion.div>
      </div>

      {/* 2. قسم التزامكِ الأسبوعي */}
      <motion.section
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-linear-to-br from-brand-primary/20 via-brand-primary/5 to-transparent border border-brand-primary/20 rounded-4xl p-8 relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-brand-primary mb-2">
              <div className="p-2 bg-brand-primary/20 rounded-lg">
                <FaCalendarCheck size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">
                التزامكِ الأسبوعي
              </h2>
            </div>
            <p className="text-gray-300 max-w-sm text-sm leading-relaxed">
              رائع! لقد أكملتِ 3 أيام بنجاح. استمري اليوم للحفاظ على "سلسلة
              الإنجاز" وفتح المكافأة الكبرى.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {weekDays.map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div
                  className={`
                  w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-xl font-bold transition-all duration-700
                  ${
                    item.status === "completed"
                      ? "bg-brand-primary text-white shadow-[0_0_20px_rgba(255,105,180,0.4)]"
                      : item.status === "current"
                        ? "bg-white/5 border-2 border-brand-primary text-brand-primary shadow-[0_0_15px_rgba(255,105,180,0.1)]"
                        : "bg-white/5 text-gray-700 border border-white/5"
                  }
                `}
                >
                  {item.status === "completed" ? (
                    <FaCheck size={20} />
                  ) : (
                    item.day
                  )}
                </div>
                {item.status === "current" && (
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-[10px] font-bold text-brand-primary uppercase"
                  >
                    اليوم
                  </motion.span>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 3. شبكة التحديات الحقيقية القادمة من السيرفر */}
      {isLoading ? (
        <div className="text-center text-gray-400 py-12 text-lg font-bold animate-pulse">
          جاري تحميل التحديات بالوقت الفعلي من السيرفر...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((ch, index) => {
            const percentage = Math.min(
              Math.round((ch.current / ch.target) * 100),
              100,
            );

            return (
              <motion.div
                key={ch.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-card-bg border border-white/5 p-8 rounded-[40px] flex flex-col justify-between group hover:border-brand-primary/30 transition-all duration-500 relative overflow-hidden
                  ${ch.isBig ? "lg:col-span-2" : "lg:col-span-1"}
                `}
              >
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-brand-primary/5 rounded-full blur-[80px] group-hover:bg-brand-primary/10 transition-all" />

                <div>
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-4 bg-white/5 text-brand-primary rounded-2xl group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-white transition-all duration-500">
                      {renderIcon(ch.iconName, ch.isBig ? 28 : 24)}
                    </div>
                    <div className="text-left bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                      <span className="text-xs text-gray-500 block mb-1">
                        النقاط
                      </span>
                      <span className="text-xl font-black text-brand-primary">
                        +{ch.points}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                    {ch.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-8">
                    {ch.desc}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold px-1">
                      <span className="text-brand-primary">{percentage}%</span>
                      <span className="text-gray-500">
                        {ch.current.toLocaleString()} /{" "}
                        {ch.target.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-brand-primary shadow-[0_0_15px_#FF69B4]"
                      />
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {completedId === ch.id ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center text-green-400 font-bold py-3 bg-green-400/5 rounded-2xl border border-green-400/10"
                      >
                        تم بنجاح! +{ch.points} نقطة
                      </motion.div>
                    ) : (
                      <button
                        key="action-btn"
                        onClick={() =>
                          handleComplete(ch.id, ch.points, ch.target)
                        }
                        className="w-full py-4 bg-white/5 border border-white/10 hover:border-brand-primary/50 hover:bg-brand-primary/5 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-3 group/btn"
                      >
                        سجلي الإنجاز{" "}
                        <BiTargetLock className="group-hover/btn:rotate-90 transition-transform duration-500" />
                      </button>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Footer التحفيزي */}
      <footer className="text-center pt-10 opacity-40">
        <p className="text-sm">كل خطوة صغيرة تقربكِ من هدفكِ الكبير.</p>
      </footer>
    </div>
  );
};

export default Challenges;
