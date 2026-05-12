import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/authStore";
import {
  FaUsers,
  FaMedal,
  FaUserShield,
  FaSearch,
  FaTrashAlt,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { usersList, user: currentUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");

  // حساب الإحصائيات من الـ usersList الحقيقية في المتجر
  const stats = useMemo(() => {
    const total = usersList.length;
    const admins = usersList.filter((u) => u.role === "ADMIN").length;
    const highPoints = usersList.filter((u) => u.points > 1000).length;
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
  }, [usersList]);

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-main-bg text-right p-6" dir="rtl">
      {/* Header */}
      <div className="pb-4 border-b border-gray-800">
        <Link
          to={"/"}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl border border-white/10 transition-all font-bold w-fit"
        >
          <FaArrowRight className="text-brand-primary" /> العودة للموقع الرئيسي
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 mt-4">
        <div>
          <h1 className="text-3xl font-black text-white">إدارة نظام FitFlow</h1>
          <p className="text-gray-400">
            مرحباً {currentUser?.name}، لديك كامل الصلاحيات في لوحة التحكم.
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-brand-primary to-pink-600 flex items-center justify-center text-white font-bold shadow-lg">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-bold">{user.name}</p>
                        <p className="text-gray-500 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span
                      className={`px-4 py-1 rounded-full text-[10px] font-black ${
                        user.role === "ADMIN"
                          ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                          : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-yellow-500 font-bold">
                      <FaMedal className="text-xs" /> {user.points}
                    </div>
                  </td>
                  <td className="p-6 text-gray-400 text-sm">
                    {new Date(user.joinedDate).toLocaleDateString("ar-EG")}
                  </td>
                  <td className="p-6">
                    <button className="text-gray-600 hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-xl">
                      <FaTrashAlt />
                    </button>
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
      </div>
    </div>
  );
};

export default AdminDashboard;
