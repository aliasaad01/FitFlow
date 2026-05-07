// src/pages/auth/Register.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Checkbox from "../../components/ui/Checkbox";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(formData.name, formData.email, formData.password);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-main-bg px-4">
      <div className="w-full max-w-md bg-card-bg p-8 rounded-2xl border border-white/5 shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-2 font-cairo">
          ابدئي رحلتكِ
        </h2>
        <p className="text-text-muted text-center mb-8">
          أنشئي حسابكِ للانضمام لمجتمعنا المتألق
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="الاسم الكامل"
            placeholder="جين دو"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="البريد الإلكتروني"
            type="email"
            placeholder="hello@bloom.com"
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

          <Checkbox label="أوافق على شروط الخدمة وسياسة الخصوصية" required />

          <Button type="submit" size="full" isLoading={isLoading}>
            إنشاء الحساب
          </Button>

          <p className="text-center text-sm text-text-muted">
            لديكِ حساب بالفعل؟
            <button
              onClick={() => navigate("/login")}
              className="text-brand-primary mr-1 font-bold"
            >
              تسجيل الدخول
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
