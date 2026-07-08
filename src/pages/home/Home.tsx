import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Star, Quote, Loader } from "lucide-react";
import Button from "../../components/ui/Button";
import { FaPlay, FaTrophy } from "react-icons/fa";
import { collection, query, limit, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

// تعريف نوع البيانات لحماية التايب سكريبت من الأخطاء
interface Workout {
  id: string;
  title: string;
  duration?: string;
  level?: string;
  thumbnail?: string;
  image?: string;
}

const Home = () => {
  const navigate = useNavigate();

  // حالات جلب البيانات المقترحة من فايربيز
  const [suggestedWorkouts, setSuggestedWorkouts] = useState<Workout[]>([]);
  const [loadingWorkouts, setLoadingWorkouts] = useState(true);

  // جلب البيانات ديناميكياً عند تحميل الصفحة
  useEffect(() => {
    const fetchSuggestedWorkouts = async () => {
      try {
        const q = query(collection(db, "workouts"), limit(3));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const workoutsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().title || "تمرين رياضي",
            duration: doc.data().duration || "20 دقيقة",
            level: doc.data().level || "تأثير منخفض",
            thumbnail:
              doc.data().thumbnail || doc.data().image || "/imges/home-1.webp",
          }));
          setSuggestedWorkouts(workoutsData);
        } else {
          // بيانات احتياطية متوافقة مع روابط مشروعك الأصلي في حال كانت قاعدة البيانات فارغة
          setSuggestedWorkouts([
            {
              id: "1",
              title: "روتين الصباح",
              duration: "20 دقيقة",
              level: "تأثير منخفض",
              thumbnail: "/imges/home-1.webp",
            },
            {
              id: "2",
              title: "القوة الأساسية",
              duration: "20 دقيقة",
              level: "تأثير منخفض",
              thumbnail: "/imges/home-3.webp",
            },
            {
              id: "3",
              title: "تمارين الاستطالة",
              duration: "20 دقيقة",
              level: "تأثير منخفض",
              thumbnail: "/imges/home-2.webp",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching workouts from Firebase:", error);
      } finally {
        setLoadingWorkouts(false);
      }
    };

    fetchSuggestedWorkouts();
  }, []);

  // تأثيرات الظهور الأصلية كما هي
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="space-y-24 pb-5">
      {/* --- 1. Hero Section مع صورة خلفية --- */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden rounded-[40px] mt-4">
        <div className="absolute inset-0 z-0">
          <img
            src="/imges/home-3.webp"
            className="w-full h-full object-cover opacity-40"
            alt="Fitness Background"
          />
          <div className="absolute inset-0 bg-linear-to-t from-main-bg via-transparent to-transparent" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 text-brand-primary font-medium"
          >
            مرحباً بكِ في FitFlow
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-black mb-6 leading-tight"
          >
            قوتكِ تزهر من الداخل، <br />{" "}
            <span className="text-brand-primary">ابدئي رحلة التحول اليوم</span>
          </motion.h1>

          <p className="text-text-muted text-lg mb-10 max-w-2xl mx-auto">
            ابدئي رحلتكِ في مساحة صُممت خصيصاً لكِ، حيث تجتمع القوة مع الأنوثة.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="gap-2"
              onClick={() => navigate("/workouts")}
            >
              <FaPlay size={18} fill="currentColor" /> ابدئي التمارين
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              onClick={() => navigate("/challenges")}
            >
              <FaTrophy size={18} /> خوضي التحدي
            </Button>
          </div>
        </div>
      </section>

      {/* --- 2. Features Section (Grid عرض ناعم) --- */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="px-4"
      >
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card-bg border border-white/5 p-10 rounded-4xl flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4">تتبع التقدم البصري</h2>
            <p className="text-text-muted mb-8">
              شاهدي نموكِ من خلال رسوم بيانية تفاعلية تحتفل بكل انتصار صغير.
            </p>

            <div className="h-40 flex items-end gap-3">
              {[40, 65, 45, 90, 55, 80].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  className={`flex-1 rounded-t-xl ${h === 90 ? "bg-brand-primary" : "bg-brand-primary/20"}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-brand-primary/10 p-8 rounded-4xl border border-brand-primary/20">
              <h3 className="font-bold text-xl mb-2">معلومات صحية</h3>
              <p className="text-sm text-text-muted">
                نصائح مخصصة بناءً على أدائكِ اليومي.
              </p>
            </div>

            <div className="bg-card-bg p-8 rounded-4xl border border-white/5">
              <h3 className="font-bold text-xl mb-2">مجتمع رياضي</h3>
              <p className="text-sm text-text-muted">
                أكثر من 12 ألف متدربة بانتظاركِ.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* --- 3. Workouts Preview (تمارين مختارة مع جلب البيانات الحية) --- */}
      <section className="px-4 space-y-8">
        <div className="flex justify-between items-end">
          <h2 className="text-3xl font-bold font-display">تمارين مقترحة</h2>
          <Button
            variant="ghost"
            className="text-brand-primary gap-1"
            onClick={() => navigate("/workouts")}
          >
            كل التمارين <ArrowRight size={16} />
          </Button>
        </div>

        {loadingWorkouts ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="animate-spin text-brand-primary" size={32} />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {suggestedWorkouts.map((workout) => (
              <motion.div
                key={workout.id}
                whileHover={{ y: -10 }}
                className="bg-card-bg rounded-2xl overflow-hidden border border-white/5 cursor-pointer"
                onClick={() => navigate(`/workouts/${workout.id}`)}
              >
                <div className="h-44 bg-white/5 relative overflow-hidden">
                  <img
                    src={workout.thumbnail}
                    alt={workout.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-white">{workout.title}</h4>
                  <p className="text-xs text-text-muted mt-1">
                    {workout.duration} • {workout.level}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* --- 4. Quote & Testimonials (آراء المستخدمين) --- */}
      <section className="bg-brand-primary/5 py-20 rounded-[40px] text-center px-4">
        <Quote
          className="mx-auto text-brand-primary mb-6 opacity-50"
          size={48}
        />

        <h2 className="text-2xl md:text-4xl italic font-light max-w-3xl mx-auto mb-12">
          "اللياقة ليست مجرد تمرين، بل هي نمط حياة يجعل قلبكِ يزهر كل يوم."
        </h2>

        <div className="flex flex-wrap justify-center gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/10 overflow-hidden">
                <img
                  src="/imges/myPhoto.png"
                  alt="/myPhoto.png"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex text-yellow-500">
                <Star size={14} fill="currentColor" />{" "}
                <Star size={14} fill="currentColor" />{" "}
                <Star size={14} fill="currentColor" />{" "}
                <Star size={14} fill="currentColor" />{" "}
                <Star size={14} fill="currentColor" />
              </div>

              <p className="text-xs text-text-muted font-display">
                "تغيرت حياتي مع FitFlow"
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
