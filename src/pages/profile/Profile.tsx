import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import {
  doc,
  updateDoc,
  type DocumentData,
  type WithFieldValue,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { Loader } from "lucide-react";
import {
  FaCamera,
  FaFire,
  FaTrophy,
  FaGem,
  FaChevronLeft,
  FaMedal,
  FaLock,
  FaCalculator,
  FaWeight,
  FaSignOutAlt,
  FaChalkboardTeacher,
} from "react-icons/fa";
import type { CloudinaryUploadResponse } from "../../types";

const Profile = () => {
  const { user, logout, updatePassword, isLoading } = useAuthStore();
  const navigate = useNavigate();

  // ثوابت إعدادات Cloudinary الخاصة بكِ (تم التصحيح)
  const CLOUD_NAME = "ci1j6cjc";
  const UPLOAD_PRESET = "fitflow_preset";

  // الحالات المحلية لإدارة الصور بأمان ومنع تكرار الـ Render
  const [profileImg, setProfileImg] = useState<string | null>(
    user?.photoURL || null,
  );
  const [beforeImage, setBeforeImage] = useState<string | null>(
    user?.beforeImg || null,
  );
  const [afterImage, setAfterImage] = useState<string | null>(
    user?.afterImg || null,
  );
  const [uploadingType, setUploadingType] = useState<
    "profile" | "before" | "after" | null
  >(null);

  const [activeModal, setActiveModal] = useState<
    "password" | "calories" | "bmi" | null
  >(null);

  // حاسبة السعرات - State
  const [calData, setCalData] = useState({ weight: "", height: "", age: "" });
  const [result, setResult] = useState<number | null>(null);

  // حسابات التقدم الديناميكية
  const stats = useMemo(() => {
    const points = user?.points || 0;
    const nextLevelPoints = 5000;
    const progress = Math.min((points / nextLevelPoints) * 100, 100);

    const badges = [
      { id: 1, name: "البداية القوية", unlocked: points > 500, icon: "🌱" },
      {
        id: 2,
        name: "ملكة الالتزام",
        unlocked: (user?.streak || 0) >= 7,
        icon: "🔥",
      },
      { id: 3, name: "المستوى الذهبي", unlocked: points >= 3000, icon: "👑" },
      { id: 4, name: "بطلة FitFlow", unlocked: points >= 4500, icon: "🏆" },
    ];

    return { progress, badges, points, nextLevelPoints };
  }, [user]);

  // 1. منطق تسجيل الخروج
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 2. منطق حساب السعرات (معادلة Mifflin-St Jeor للإناث)
  const calculateCalories = () => {
    const { weight, height, age } = calData;
    if (weight && height && age) {
      const bmr =
        10 * Number(weight) + 6.25 * Number(height) - 5 * Number(age) - 161;
      setResult(Math.round(bmr * 1.2)); // نشاط خفيف
    }
  };

  // 3. حفظ كلمة السر الفعلية وإغلاق المودال
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState(""); // لحفظ حقول الإدخال للمودال

  const handlePasswordUpdate = async () => {
    if (!newPassword) return;
    try {
      if (updatePassword) {
        await updatePassword(newPassword);
        alert("تم تحديث كلمة السر بنجاح!");
        setActiveModal(null);
        setNewPassword("");
        setCurrentPassword("");
      }
    } catch (err) {
      console.error("Error updating password:", err);
    }
  };

  // رفع الملفات لـ Cloudinary وتحديث الحالات ومتجر الأمان بنوع بيانات صريح ومطابق للفايربيز وبدون any
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "before" | "after",
  ) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    setUploadingType(type);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const xhr = new XMLHttpRequest();

      const uploadPromise = new Promise<CloudinaryUploadResponse>(
        (resolve, reject) => {
          xhr.open(
            "POST",
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            true,
          );

          xhr.onload = () => {
            try {
              const responseText = JSON.parse(
                xhr.responseText,
              ) as CloudinaryUploadResponse & { error?: { message: string } };
              if (xhr.status >= 200 && xhr.status < 300) {
                resolve(responseText);
              } else {
                const serverMessage =
                  responseText.error?.message ||
                  `كود حالة السيرفر: ${xhr.status}`;
                reject(new Error(serverMessage));
              }
            } catch (errorParse) {
              console.log(errorParse);
              reject(new Error("حدث خطأ أثناء معالجة رد السيرفر."));
            }
          };

          xhr.onerror = () => reject(new Error("حدث خطأ في اتصال الشبكة."));
          xhr.ontimeout = () => reject(new Error("انتهت مهلة طلب الرفع."));

          xhr.timeout = 25000;
          xhr.send(formData);
        },
      );

      const data = await uploadPromise;
      const downloadURL = data.secure_url;

      const userDocRef = doc(db, "users", user.id);

      // استخدام أنواع الفايربيز الرسمية لمنع الـ Type Mismatch
      const updateData: WithFieldValue<DocumentData> = {};
      const localUpdate: {
        photoURL?: string;
        beforeImg?: string;
        afterImg?: string;
      } = {};

      if (type === "profile") {
        updateData.photoURL = downloadURL;
        localUpdate.photoURL = downloadURL;
        await updateDoc(userDocRef, updateData);
        setProfileImg(downloadURL);
      } else if (type === "before") {
        updateData.beforeImg = downloadURL;
        localUpdate.beforeImg = downloadURL;
        await updateDoc(userDocRef, updateData);
        setBeforeImage(downloadURL);
      } else if (type === "after") {
        updateData.afterImg = downloadURL;
        localUpdate.afterImg = downloadURL;
        await updateDoc(userDocRef, updateData);
        setAfterImage(downloadURL);
      }

      // 2. تحديث متجر useAuthStore فوراً لمزامنة الصورة وتثبيتها عند عمل Refresh
      if (user) {
        Object.assign(user, localUpdate);
      }

      alert("تم رفع وتحديث الصورة بنجاح وتأمين حفظها! 🎉");
    } catch (err) {
      const errorInstance = err instanceof Error ? err : new Error(String(err));
      console.error("Cloudinary Detailed Error Log:", errorInstance);
      alert(`تنبيه Cloudinary: ${errorInstance.message}`);
    } finally {
      setUploadingType(null);
    }
  };

  const status = [
    {
      label: "النقاط",
      value: user?.points || 0,
      icon: <FaGem />,
      color: "text-blue-400",
    },
    {
      label: "التزام",
      value: user?.streak || 0,
      icon: <FaFire />,
      color: "text-orange-500",
    },
    {
      label: "تمارين",
      value: "24",
      icon: <FaTrophy />,
      color: "text-yellow-500",
    },
    {
      label: "أوسمة",
      value: "4",
      icon: <FaMedal />,
      color: "text-pink-400",
    },
  ];

  const tips = [
    {
      text: "التزمي بـ 7 ساعات نوم للتعافي العضلي.",
      color: "bg-blue-500",
    },
    {
      text: "وجبة قبل التمرين بـ 90 دقيقة هي وقودكِ.",
      color: "bg-orange-500",
    },
    {
      text: "سجلي وزنكِ مرة واحدة أسبوعياً فقط.",
      color: "bg-pink-500",
    },
    {
      text: "استبدلي السكر المكرر بالعسل الطبيعي.",
      color: "bg-yellow-500",
    },
  ];

  return (
    <div
      className="max-w-6xl mx-auto px-4 py-6 md:py-12 space-y-8 text-right mb-24 md:mb-0"
      dir="rtl"
    >
      {/* 1. Header: Personal Image & Identity */}
      <section className="relative bg-linear-to-br from-brand-primary/20 via-card-bg to-card-bg border border-white/10 rounded-[40px] p-8 md:p-12 overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="relative group">
            <label className="block w-32 h-32 md:w-44 md:h-44 rounded-full border-[6px] border-brand-primary/20 p-1.5 cursor-pointer hover:border-brand-primary transition-all relative overflow-hidden shadow-2xl">
              {uploadingType === "profile" ? (
                <div className="w-full h-full bg-black/60 rounded-full flex items-center justify-center">
                  <Loader
                    className="animate-spin text-brand-primary"
                    size={24}
                  />
                </div>
              ) : (
                <img
                  src={
                    profileImg ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=FF69B4&color=fff&size=200`
                  }
                  className="w-full h-full rounded-full object-cover"
                  alt="Profile"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=FF69B4&color=fff&size=200`;
                  }}
                />
              )}

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all">
                <FaCamera className="text-white text-2xl mb-1" />
                <span className="text-[10px] text-white font-bold">
                  تغيير الصورة
                </span>
              </div>

              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "profile")}
              />
            </label>

            <div className="absolute -bottom-2 -right-2 bg-brand-primary p-3 rounded-2xl shadow-xl border-4 border-card-bg">
              <FaGem className="text-white" />
            </div>
          </div>

          <div className="flex-1 space-y-6 w-full text-center md:text-right">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                أهلاً،{" "}
                <span className="text-brand-primary">
                  {user?.name?.split(" ")[0]}
                </span>{" "}
              </h1>
              <p className="text-gray-500 font-medium mt-2">
                عضوة متألقة في مجتمع FitFlow
              </p>
            </div>

            <div className="bg-black/20 p-5 rounded-3xl border border-white/5 backdrop-blur-md">
              <div className="flex justify-between items-center mb-3">
                <span className="text-brand-primary font-bold text-sm">
                  مستوى {user?.tier || "برونزي"}
                </span>
                <span className="text-gray-400 text-xs font-bold">
                  {stats.points} / {stats.nextLevelPoints} نقطة
                </span>
              </div>

              <div className="h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.progress}%` }}
                  className="h-full bg-linear-to-r from-brand-primary to-pink-400 rounded-full shadow-[0_0_15px_rgba(255,105,180,0.5)]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Quick Stats Grid --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {status.map((s, i) => (
          <div
            key={i}
            className="bg-card-bg border border-white/5 p-5 rounded-[30px] text-center shadow-lg"
          >
            <div className={`${s.color} text-xl mb-2 flex justify-center`}>
              {s.icon}
            </div>
            <h3 className="text-xl font-black text-white">{s.value}</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* --- Interactive Section (Before/After & Tools) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Before & After Card */}
        <div className="bg-card-bg border border-white/5 rounded-[40px] p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">توثيق الإنجاز</h2>

          <div className="grid grid-cols-2 gap-4">
            {(["before", "after"] as const).map((type) => (
              <div key={type} className="relative group">
                <label className="block aspect-3/4 bg-white/5 border-2 border-dashed border-white/10 rounded-[30px] overflow-hidden cursor-pointer hover:border-brand-primary transition-all relative">
                  {uploadingType === type ? (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader
                        className="animate-spin text-brand-primary"
                        size={20}
                      />
                    </div>
                  ) : (type === "before" ? beforeImage : afterImage) ? (
                    <img
                      src={type === "before" ? beforeImage! : afterImage!}
                      className="w-full h-full object-cover"
                      alt={type}
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 gap-2">
                      <FaCamera /> <span className="text-[10px]">رفع صورة</span>
                    </div>
                  )}

                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, type)}
                  />
                </label>

                <div
                  className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black ${type === "before" ? "bg-gray-700 text-white" : "bg-brand-primary text-white"}`}
                >
                  {type === "before" ? "قبل" : "بعد"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Center */}
        <div className="space-y-4">
          <button
            onClick={() => setActiveModal("calories")}
            className="w-full p-6 bg-linear-to-r from-brand-primary/20 to-transparent border border-brand-primary/30 rounded-[30px] flex items-center justify-between group active:scale-[0.98] transition-all shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="bg-brand-primary text-white p-3 rounded-xl shadow-lg">
                <FaCalculator />
              </div>
              <div className="text-right">
                <h3 className="text-lg font-bold text-white">حاسبة السعرات</h3>
                <p className="text-[10px] text-gray-400">
                  احسبي احتياج جسمكِ بضغطة واحدة
                </p>
              </div>
            </div>
            <FaChevronLeft className="text-brand-primary" />
          </button>

          <div className="bg-card-bg border border-white/5 rounded-[40px] p-8 space-y-3">
            <h2 className="text-xl font-bold text-white mb-4">
              التحكم والأمان
            </h2>

            <button
              onClick={() => setActiveModal("password")}
              className="w-full p-4 bg-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all text-sm text-white font-bold"
            >
              <div className="flex items-center gap-3">
                <FaLock className="text-blue-400" /> تغيير كلمة السر
              </div>
              <FaChevronLeft className="text-gray-700" />
            </button>

            <button
              onClick={() => setActiveModal("bmi")}
              className="w-full p-4 bg-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all text-sm text-white font-bold"
            >
              <div className="flex items-center gap-3">
                <FaWeight className="text-green-400" /> حاسبة كتلة الجسم BMI
              </div>
              <FaChevronLeft className="text-gray-700" />
            </button>

            <button
              onClick={handleLogout}
              className="w-full p-4 bg-red-500/5 rounded-2xl flex items-center justify-between group hover:bg-red-500/10 transition-all text-sm text-red-500 font-bold mt-4"
            >
              <div className="flex items-center gap-3">
                <FaSignOutAlt /> تسجيل الخروج
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Inspiration & Guidelines Section */}
      <section className="space-y-6 pt-10">
        <div className="flex items-center gap-3 px-2">
          <div className="h-8 w-1.5 bg-brand-primary rounded-full" />
          <h2 className="text-2xl font-black text-white tracking-tight">
            ركن الإلهام والتدريب
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ y: -5 }}
            className="md:col-span-2 bg-linear-to-br from-[#1a1a1a] to-card-bg border border-white/5 rounded-[40px] p-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
              <FaChalkboardTeacher size={120} className="text-brand-primary" />
            </div>

            <div className="relative z-10 space-y-4">
              <span className="bg-brand-primary/20 text-brand-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                نصيحة اليوم
              </span>
              <h3 className="text-2xl font-bold text-white leading-snug mt-4">
                "الاستمرارية تتفوق على القوة البدنية؛ <br />
                ما تفعليه يومياً هو ما يصنع الفرق، وليس ما تفعليه مرة في
                الأسبوع."
              </h3>
              <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <FaFire />
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  تذكري أن شرب الماء الكافي (2-3 لتر) يزيد من كفاءة حرق الدهون
                  بنسبة 30% خلال تمارينك اليومية.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="bg-card-bg border border-white/5 rounded-[40px] p-8 space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-white/5 pb-4">
              إرشادات سريعة
            </h3>
            <ul className="space-y-4">
              {tips.map((item, i) => (
                <li key={i} className="flex items-start gap-3 group">
                  <div
                    className={`mt-1.5 w-2 h-2 rounded-full ${item.color} shadow-[0_0_8px_inherit]`}
                  />
                  <p className="text-gray-400 text-xs md:text-sm font-medium group-hover:text-white transition-colors">
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-linear-to-r from-brand-primary/10 via-card-bg to-transparent border border-white/5 rounded-[30px] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-right">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-2xl">
              💡
            </div>
            <div>
              <h4 className="text-white font-bold">هل لديكِ استفسار محدد؟</h4>
              <p className="text-gray-500 text-xs mt-1">
                مدربات FitFlow متواجدات للإجابة على كافة أسئلتك الرياضية
                والغذائية.
              </p>
            </div>
          </div>
          <button className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl text-sm font-bold transition-all active:scale-95">
            تحدثي مع المدربة الآن
          </button>
        </div>
      </section>

      {/* --- Modals Overlay --- */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-card-bg border border-white/10 p-8 rounded-[40px] w-full max-w-md relative z-10 text-right"
            >
              {activeModal === "password" && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <FaLock className="text-brand-primary" /> تحديث الأمان
                  </h2>
                  <input
                    type="password"
                    placeholder="كلمة السر الحالية"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-brand-primary"
                  />
                  <input
                    type="password"
                    placeholder="كلمة السر الجديدة"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-brand-primary"
                  />
                  <button
                    onClick={handlePasswordUpdate}
                    disabled={isLoading}
                    className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl shadow-lg shadow-brand-primary/30 flex items-center justify-center"
                  >
                    {isLoading ? (
                      <Loader className="animate-spin" size={18} />
                    ) : (
                      "حفظ التغييرات"
                    )}
                  </button>
                </div>
              )}

              {activeModal === "calories" && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <FaCalculator className="text-brand-primary" /> حاسبة
                    السعرات
                  </h2>
                  <p className="text-xs text-gray-500 mb-4">
                    أدخلي بياناتكِ بدقة للحصول على أفضل نتيجة
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="الوزن (kg)"
                      value={calData.weight}
                      onChange={(e) =>
                        setCalData({ ...calData, weight: e.target.value })
                      }
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none"
                    />
                    <input
                      type="number"
                      placeholder="الطول (cm)"
                      value={calData.height}
                      onChange={(e) =>
                        setCalData({ ...calData, height: e.target.value })
                      }
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none"
                    />
                  </div>
                  <input
                    type="number"
                    placeholder="العمر"
                    value={calData.age}
                    onChange={(e) =>
                      setCalData({ ...calData, age: e.target.value })
                    }
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none"
                  />
                  <button
                    onClick={calculateCalories}
                    className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl shadow-xl"
                  >
                    احسبي الآن
                  </button>

                  {result && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-brand-primary/20 border border-brand-primary/30 rounded-2xl text-center"
                    >
                      <p className="text-gray-300 text-sm">
                        احتياجك اليومي التقريبي:
                      </p>
                      <h4 className="text-2xl font-black text-brand-primary">
                        {result} سعرة
                      </h4>
                    </motion.div>
                  )}
                </div>
              )}

              {activeModal === "bmi" && (
                <div className="space-y-4 text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    مؤشر كتلة الجسم
                  </h2>
                  <div className="p-8 bg-white/5 rounded-[30px] border border-white/5">
                    <FaWeight
                      size={40}
                      className="mx-auto text-green-400 mb-4"
                    />
                    <p className="text-gray-400 text-sm leading-relaxed">
                      هذه الميزة تساعدكِ على معرفة ما إذا كان وزنكِ مثالياً
                      لطولكِ. هل تودين البدء بالقياس؟
                    </p>
                  </div>
                  <button className="w-full py-4 bg-green-500 text-white font-bold rounded-2xl">
                    قريباً في التحديث القادم
                  </button>
                </div>
              )}

              <button
                onClick={() => setActiveModal(null)}
                className="mt-6 text-gray-500 text-xs w-full text-center hover:text-white transition-colors"
              >
                إغلاق النافذة
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
