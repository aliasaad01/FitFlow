import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // استيراد الأيقونات

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  type,
  className,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="w-full space-y-2 text-right">
      {label && (
        <label className="block text-sm text-text-muted mr-1">{label}</label>
      )}
      <div className="relative">
        <input
          type={isPassword && showPassword ? "text" : type}
          className={`
            w-full bg-main-bg border rounded-lg p-3 outline-none transition-all
            ${error ? "border-red-500" : "border-white/10 focus:border-brand-primary"}
            ${isPassword ? "pl-10" : ""} /* مساحة للأيقونة */
            ${className}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default Input;
