import { NavLink } from "react-router-dom";
import { Home, Dumbbell, Trophy, Utensils, User, MapPin } from "lucide-react"; // تم إضافة MapPin

const BottomNav = () => {
  const navItems = [
    { path: "/", icon: <Home size={22} />, label: "الرئيسية" },
    { path: "/workouts", icon: <Dumbbell size={22} />, label: "تمارين" },
    { path: "/challenges", icon: <Trophy size={22} />, label: "تحديات" },
    { path: "/nutrition", icon: <Utensils size={22} />, label: "تغذية" },
    { path: "/clubs", icon: <MapPin size={22} />, label: "الأندية" }, // العنصر الجديد
    { path: "/profile", icon: <User size={22} />, label: "حسابي" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card-bg/80 backdrop-blur-lg border-t border-white/5 px-2 py-3 z-50 md:hidden">
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center gap-1 transition-all duration-300
              ${isActive ? "text-brand-primary scale-110" : "text-text-muted"}
            `}
          >
            {item.icon}
            <span className="text-[9px] font-bold">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
