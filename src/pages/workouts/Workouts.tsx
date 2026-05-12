import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../store/authStore";
import {
  FaPlay,
  FaCheck,
  FaInfoCircle,
  FaLevelUpAlt,
  FaGem,
} from "react-icons/fa";
import { MdOutlineTimer, MdFitnessCenter } from "react-icons/md";

const Workouts = () => {
  const { user, addPoints } = useAuthStore();
  const [activeTab, setActiveTab] = useState("main"); // main, warmup, stretch
  const [completedWorkouts, setCompletedWorkouts] = useState<number[]>([]);

  const categories = [
    { id: "warmup", label: "إحماء عام", icon: <MdOutlineTimer /> },
    { id: "main", label: "تمارين القوة", icon: <MdFitnessCenter /> },
    { id: "stretch", label: "ستريتشات", icon: <FaLevelUpAlt /> },
  ];

  const workouts = [
    {
      id: 1,
      category: "main",
      title: "سكوات صحيح (Squat)",
      duration: "45 ثانية",
      level: "مبتدئ - متقدم",
      video:
        "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-squats-in-the-gym-23150-large.mp4",
      tips: "حافظي على استقامة الظهر واجعلي الركبتين باتجاه أصابع القدم.",
      correction: "خطأ شائع: تقوس الظهر أو تجاوز الركبة لأصابع القدم.",
    },
    {
      id: 2,
      category: "main",
      title: "لانجز (Lunges)",
      duration: "60 ثانية",
      level: "متوسط",
      video:
        "https://assets.mixkit.co/videos/preview/mixkit-young-woman-doing-lunges-at-the-gym-23154-large.mp4",
      tips: "النزول بزاوية 90 درجة للركبتين.",
      correction: "خطأ شائع: عدم توازن الجسم أو النزول السريع جداً.",
    },
    {
      id: 3,
      category: "warmup",
      title: "إحماء المفاصل العلوي",
      duration: "5 دقائق",
      level: "للجميع",
      video:
        "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-arm-stretches-in-the-gym-23146-large.mp4",
      tips: "حركات دائرية بطيئة لتنشيط الدورة الدموية.",
      correction: "تجنبي الحركات الفجائية السريعة.",
    },
  ];

  const handleWorkoutComplete = (id: number) => {
    if (!completedWorkouts.includes(id)) {
      addPoints(5); // 5 نقاط لكل تمرين
      setCompletedWorkouts([...completedWorkouts, id]);
    }
  };

  const filteredWorkouts = workouts.filter((w) => w.category === activeTab);

  return (
    <div
      className="max-w-6xl mx-auto px-4 py-12 space-y-12 text-right"
      dir="rtl"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        {/* 1. Header & Tabs */}
        <section className="space-y-6">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">
              مكتبة التمارين
            </h1>
            <p className="text-gray-400">
              فيديوهات قصيرة لتعليمكِ الأداء الصحيح بكل دقة.
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
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
        </section>

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

      {/* 2. Workouts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence>
          {filteredWorkouts.map((workout) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card-bg border border-white/5 rounded-4xl overflow-hidden group hover:border-brand-primary/30 transition-all"
            >
              {/* Video Player Section */}
              <div className="relative aspect-video bg-black">
                <video
                  src={workout.video}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  muted
                  loop
                  playsInline
                  onMouseOver={(e) => e.currentTarget.play()}
                  onMouseOut={(e) => e.currentTarget.pause()}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent pointer-events-none" />
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-lg text-xs text-white flex items-center gap-2">
                  <FaPlay size={10} className="text-brand-primary" /> فيديو
                  تعليمي
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-white">
                    {workout.title}
                  </h3>
                  <span className="text-[10px] bg-brand-primary/10 text-brand-primary px-2 py-1 rounded-full font-bold uppercase">
                    {workout.level}
                  </span>
                </div>

                <div className="flex gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MdOutlineTimer className="text-brand-primary" />{" "}
                    {workout.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaCheck className="text-green-500" /> +5 نقاط
                  </span>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl space-y-2">
                  <p className="text-xs text-gray-300 leading-relaxed flex items-start gap-2">
                    <FaInfoCircle className="text-brand-primary mt-0.5 shrink-0" />
                    {workout.tips}
                  </p>
                  <p className="text-[11px] text-red-400/80 italic border-t border-white/5 pt-2 mt-2">
                    {workout.correction}
                  </p>
                </div>

                <button
                  onClick={() => handleWorkoutComplete(workout.id)}
                  disabled={completedWorkouts.includes(workout.id)}
                  className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2
                    ${
                      completedWorkouts.includes(workout.id)
                        ? "bg-green-500/10 text-green-500 border border-green-500/20"
                        : "bg-brand-primary text-white hover:scale-[1.02] active:scale-95 shadow-lg shadow-brand-primary/20"
                    }
                  `}
                >
                  {completedWorkouts.includes(workout.id) ? (
                    <>أنجزت التمرين ✓</>
                  ) : (
                    <>تم الإنجاز +5 نقاط</>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 3. نصيحة للمبتدئات */}
      <div className="bg-white/5 border-r-4 border-brand-primary p-6 rounded-2xl">
        <h4 className="font-bold text-white mb-1">ملاحظة للمبتدئات:</h4>
        <p className="text-sm text-gray-400 leading-relaxed">
          إذا كنتِ في البداية، ركزي على دقة الحركة أكثر من السرعة. يمكنكِ دائماً
          تقليل المدى الحركي (مثل النزول لنصف المسافة في السكوات) حتى تتقني
          التوازن.
        </p>
      </div>
    </div>
  );
};

export default Workouts;
