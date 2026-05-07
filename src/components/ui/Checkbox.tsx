import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, ...props }) => {
  return (
    <label className="flex items-center space-x-2 space-x-reverse cursor-pointer group">
      <input
        type="checkbox"
        className="w-4 h-4 rounded border-white/10 bg-main-bg text-brand-primary focus:ring-brand-primary focus:ring-offset-main-bg accent-brand-primary"
        {...props}
      />
      <span className="text-sm text-text-muted group-hover:text-white transition-colors mx-2">
        {label}
      </span>
    </label>
  );
};

export default Checkbox;
