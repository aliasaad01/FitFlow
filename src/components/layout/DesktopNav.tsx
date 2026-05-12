import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const DesktopNav = () => {
  const { logout, user } = useAuthStore();

  const navLinks = [
    { path: "/", label: "الرئيسية" },
    { path: "/workouts", label: "التمارين" },
    { path: "/challenges", label: "التحديات" },
    { path: "/nutrition", label: "التغذية" },
    { path: "/profile", label: "حسابي" },
  ];

  return (
    <nav className="hidden md:block sticky top-0 bg-card-bg border-b border-white/5 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-brand-primary">FitFlow</div>

        <div className="flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `
                font-bold transition-colors
                ${isActive ? "text-brand-primary" : "text-text-muted hover:text-white"}
              `}
            >
              {link.label}
            </NavLink>
          ))}

          {user?.role === "ADMIN" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl bg-brand-primary/10 border border-brand-primary/20 font-bold transition-all ${isActive ? "bg-brand-primary text-white" : "text-brand-primary hover:bg-brand-primary hover:text-white"}`
              }
            >
              لوحة التحكم
            </NavLink>
          )}
        </div>

        <button
          onClick={logout}
          className="bg-white/5 hover:bg-red-500/10 hover:text-red-500 px-4 py-2 rounded-lg transition-all text-sm"
        >
          تسجيل الخروج
        </button>
      </div>
    </nav>
  );
};

export default DesktopNav;
