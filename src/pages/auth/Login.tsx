import React, { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Checkbox from "../../components/ui/Checkbox";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // محاكاة عملية التحقق (المنطق البرمجي)
    setTimeout(() => {
      // لنفترض أن كلمة السر الصحيحة هي "123456" لأي مستخدم حالياً
      if (formData.password.length < 6) {
        setError("كلمة السر يجب أن تكون 6 أحرف على الأقل");
        setLoading(false);
        return;
      }

      const role = formData.email.includes("admin") ? "ADMIN" : "USER";
      login(formData.email, role);
      setLoading(false);
      navigate("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-main-bg px-4">
      <div className="w-full max-w-md bg-card-bg p-8 rounded-2xl border border-white/5 shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-2">مرحباً بكِ</h2>
        <p className="text-text-muted text-center mb-8">سجلي دخولك للمتابعة</p>

        <form onSubmit={handleLogin} className="space-y-5">
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
            error={error}
          />

          <div className="text-left">
            <Checkbox label="تذكريني" />
            <button
              type="button"
              className="text-xs text-brand-primary hover:underline"
            >
              نسيتي كلمة السر؟
            </button>
          </div>

          <Button type="submit" size="full" isLoading={loading}>
            تسجيل الدخول
          </Button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card-bg px-2 text-text-muted">
                أو المتابعة عبر
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="full"
            type="button"
            onClick={() => navigate("/register")}
          >
            إنشاء حساب جديد
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
