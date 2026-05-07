import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "full";
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading,
  className,
  ...props
}) => {
  // تعريف الستايلات بناءً على الـ variant
  const variants = {
    primary: "bg-brand-primary hover:opacity-90 text-white",
    secondary: "bg-brand-secondary hover:opacity-90 text-white",
    outline:
      "border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white",
    ghost: "bg-transparent hover:bg-white/5 text-text-muted",
  };

  const sizes = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2.5",
    lg: "px-8 py-3.5 text-lg",
    full: "w-full py-3",
  };

  const baseStyles =
    "rounded-lg font-bold transition-all transform active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
