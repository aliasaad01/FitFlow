import React, { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Checkbox from "../../components/ui/Checkbox";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // استدعاء الدوال والحالات من الـ Store المطور
  const { login, error: storeError } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");

    // 1. استدعاء دالة تسجيل الدخول من الـ Store
    // الدالة الآن تبحث في الـ usersList المحفوظة
    const success = await login(formData.email, formData.password);

    if (success) {
      // 2. الحصول على بيانات المستخدم بعد نجاح الدخول لتحديد الوجهة
      // قمنا بعمل Get للحالة المحدثة
      const currentUser = useAuthStore.getState().user;

      setLoading(false);

      // 3. منطق التوجيه: إذا كان أدمن يذهب للـ Dashboard، وإذا مستخدم عادي يذهب للرئيسية/البروفايل
      if (currentUser?.role === "ADMIN") {
        navigate("/admin-dashboard"); // سنقوم بإنشاء هذا المسار لاحقاً
      } else {
        navigate("/profile");
      }
    } else {
      setLoading(false);
      // عرض الخطأ القادم من الـ Store (مثل: المستخدم غير موجود)
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-main-bg px-4"
      dir="rtl"
    >
      <div className="w-full max-w-md bg-card-bg p-8 rounded-[30px] border border-white/5 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
            مرحباً بكِ مجدداً
          </h2>
          <p className="text-gray-500 text-sm font-medium">
            سجلي دخولكِ للوصول إلى خطتكِ الرياضية
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* عرض الأخطاء إن وجدت */}
          {(formError || storeError) && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-4 rounded-xl text-center font-bold">
              {formError || storeError}
            </div>
          )}

          <Input
            label="البريد الإلكتروني"
            type="email"
            placeholder="example@mail.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />

          <Input
            label="كلمة السر"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />

          <div className="flex items-center justify-between px-1">
            <Checkbox label="تذكريني" />
            <button
              type="button"
              className="text-xs text-brand-primary font-bold hover:opacity-80 transition-opacity"
            >
              نسيتي كلمة السر؟
            </button>
          </div>

          <Button type="submit" size="full" isLoading={loading}>
            تسجيل الدخول
          </Button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/5"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card-bg px-4 text-gray-600 font-bold">
                أو
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="full"
            type="button"
            onClick={() => navigate("/register")}
            className="border-white/5 text-white hover:bg-white/5"
          >
            إنشاء حساب جديد
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
