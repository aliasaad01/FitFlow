import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const TopNav = () => {
  const { logout, user } = useAuthStore();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-card-bg/80 backdrop-blur-lg border-t border-white/5 px-2 py-3 z-50 md:hidden">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-brand-primary">FitFlow</div>

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

export default TopNav;
