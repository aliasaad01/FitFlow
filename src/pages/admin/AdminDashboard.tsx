// src/pages/AdminDashboard.tsx
import { useState, useMemo, useEffect } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/authStore";
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import {
  FaUsers,
  FaMedal,
  FaUserShield,
  FaSearch,
  FaTrashAlt,
  FaCheckCircle,
  FaArrowRight,
  FaPlusCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import type { User } from "../../types";

const AdminDashboard = () => {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // حالات فورم إضافة التحدي الجديد
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [points, setPoints] = useState(50);
  const [target, setTarget] = useState(1000);
  const [iconName, setIconName] = useState("walking");
  const [isBig, setIsBig] = useState(false);
  const [issubmitting, setIsSubmitting] = useState(false);

  // 1. جلب قائمة المستخدمين بالوقت الفعلي
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          ...doc.data(),
        })) as User[];
        setUsers(items);
        setIsLoading(false);
      },
      (error) => {
        console.error("خطأ أثناء جلب المستخدمين:", error);
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // 2. دالة لحذف مستخدم
  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("هل أنتِ متأكدة من حذف هذا الحساب نهائياً من النظام؟")) {
      try {
        await deleteDoc(doc(db, "users", userId));
      } catch (err) {
        console.error("خطأ أثناء حذف المستخدم:", err);
      }
    }
  };

  // 3. دالة معالجة فورم إضافة التحدي الجديد
  const handleAddChallenge = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !desc) {
      alert("الرجاء ملء حقول اسم ووصف التحدي!");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "challenges"), {
        title,
        desc,
        points: Number(points),
        target: Number(target),
        current: 0,
        iconName,
        isBig,
        completed: false,
      });

      // إعادة تهيئة الحقول بعد النجاح
      setTitle("");
      setDesc("");
      setPoints(50);
      setTarget(1000);
      setIconName("walking");
      setIsBig(false);
      alert("تمت إضافة التحدي بنجاح وهو متاح للمشتركات الآن! 🎉");
    } catch (error) {
      console.error("خطأ أثناء إضافة التحدي:", error);
      alert("حدث خطأ أثناء إضافة التحدي، حاول مجدداً.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. حساب الإحصائيات ديناميكياً
  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => u.role === "ADMIN").length;
    const highPoints = users.filter((u) => u.points > 1000).length;
    return [
      {
        label: "إجمالي المشتركات",
        value: total,
        icon: <FaUsers />,
        color: "bg-blue-500",
      },
      {
        label: "المدراء (Admins)",
        value: admins,
        icon: <FaUserShield />,
        color: "bg-purple-500",
      },
      {
        label: "بطلات +1000 نقطة",
        value: highPoints,
        icon: <FaMedal />,
        color: "bg-yellow-500",
      },
      {
        label: "حالة النظام",
        value: "متصل",
        icon: <FaCheckCircle />,
        color: "bg-green-500",
      },
    ];
  }, [users]);

  // 5. فلترة البحث
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div
      className="min-h-screen bg-main-bg text-right p-6 space-y-12"
      dir="rtl"
    >
      {/* Header */}
      <div className="pb-4 border-b border-gray-800">
        <Link
          to={"/"}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl border border-white/10 transition-all font-bold w-fit"
        >
          <FaArrowRight className="text-brand-primary" /> العودة للموقع الرئيسي
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-4">
        <div>
          <h1 className="text-3xl font-black text-white">إدارة نظام FitFlow</h1>
          <p className="text-gray-400">
            مرحباً {currentUser?.name}، لديكِ كامل الصلاحيات في لوحة التحكم.
          </p>
        </div>

        <div className="relative w-full md:w-96">
          <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="بحث عن مستخدم بالاسم أو الإيميل..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card-bg border border-white/10 rounded-2xl py-3 pr-12 pl-4 text-white focus:border-brand-primary outline-none transition-all"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className="bg-card-bg border border-white/5 p-6 rounded-4xl shadow-xl"
          >
            <div
              className={`${s.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl mb-4 shadow-lg`}
            >
              {s.icon}
            </div>
            <p className="text-gray-500 font-bold text-sm">{s.label}</p>
            <h3 className="text-3xl font-black text-white mt-1">{s.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-card-bg border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">
            قائمة العضوات المسجلات
          </h2>
        </div>

        {isLoading ? (
          <div className="p-20 text-center text-gray-400 font-bold animate-pulse">
            جاري تحميل قائمة المشتركات من السيرفر...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-white/5 text-gray-400 text-sm">
                  <th className="p-6">المستخدم</th>
                  <th className="p-6">الصلاحية</th>
                  <th className="p-6">النقاط</th>
                  <th className="p-6">تاريخ الانضمام</th>
                  <th className="p-6">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-brand-primary to-pink-600 flex items-center justify-center text-white font-bold shadow-lg">
                          {u.name ? u.name.charAt(0) : "U"}
                        </div>
                        <div>
                          <p className="text-white font-bold">
                            {u.name || "مستخدم جديد"}
                          </p>
                          <p className="text-gray-500 text-xs">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span
                        className={`px-4 py-1 rounded-full text-[10px] font-black ${
                          u.role === "ADMIN"
                            ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-yellow-500 font-bold">
                        <FaMedal className="text-xs" /> {u.points}
                      </div>
                    </td>
                    <td className="p-6 text-gray-400 text-sm">
                      {u.joinedDate
                        ? new Date(u.joinedDate).toLocaleDateString("ar-EG")
                        : "---"}
                    </td>
                    <td className="p-6">
                      {u.email !== currentUser?.email && (
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="text-gray-600 hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-xl"
                        >
                          <FaTrashAlt />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="p-20 text-center text-gray-500 font-bold">
                لا يوجد مستخدمين مطابقين للبحث...
              </div>
            )}
          </div>
        )}
      </div>

      {/* فورم إضافة تحدي جديد */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card-bg border border-brand-primary/20 p-8 rounded-[40px] shadow-2xl relative overflow-hidden"
      >
        <div className="flex items-center gap-3 text-brand-primary mb-6">
          <FaPlusCircle size={24} />
          <h2 className="text-xl font-bold text-white">
            إضافة تحدي سحابي جديد
          </h2>
        </div>

        <form
          onSubmit={handleAddChallenge}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400 font-bold">
              عنوان التحدي
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: تحدي شرب الماء، خطوات الصباح..."
              className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-brand-primary outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400 font-bold">
              اسم الأيقونة (iconName)
            </label>
            <select
              value={iconName}
              onChange={(e) => setIconName(e.target.value)}
              className="bg-main-bg border border-white/10 rounded-2xl p-4 text-white focus:border-brand-primary outline-none transition-all"
            >
              <option value="walking">walking (تحديات المشي والحركة)</option>
              <option value="clock">clock (تحديات الوقت والصيام)</option>
              <option value="glass">glass (تحديات السوائل والماء)</option>
              <option value="gem">gem (تحديات الجيم والرياضة)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm text-gray-400 font-bold">
              وصف التحدي
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="اكتبي تفاصيل أو شروط هذا التحدي للمشتركات..."
              rows={3}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-brand-primary outline-none transition-all resize-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400 font-bold">
              الهدف المطلوب تحقيقه (Target)
            </label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              placeholder="مثال: 6000 (خطوة)، 8 (أكواب)"
              className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-brand-primary outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400 font-bold">
              النقاط الممنوحة عند الإكمال (Points)
            </label>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-brand-primary outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-3 mt-4">
            <input
              type="checkbox"
              id="isBig"
              checked={isBig}
              onChange={(e) => setIsBig(e.target.checked)}
              className="w-5 h-5 accent-brand-primary cursor-pointer"
            />
            <label
              htmlFor="isBig"
              className="text-sm text-gray-300 font-bold cursor-pointer select-none"
            >
              تمييز كـ "تحدي كبير" (يأخذ مساحة أكبر بالصفحة)
            </label>
          </div>

          <div className="md:col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              disabled={issubmitting}
              className="w-full md:w-auto px-8 py-4 bg-brand-primary hover:bg-brand-primary/80 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg transition-all"
            >
              {issubmitting ? "جاري الإرسال للسيرفر..." : "نشر التحدي فوراً"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
