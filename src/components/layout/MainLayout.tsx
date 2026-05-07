import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import DesktopNav from "./DesktopNav";
import Footer from "./Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-main-bg text-white">
      {/* يظهر فقط في الشاشات الكبيرة */}
      <DesktopNav />

      {/* المحتوى الرئيسي */}
      <main className="grow pb-24 md:pb-8 px-4 pt-6 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

      {/* يظهر فقط في الموبايل */}
      <BottomNav />
      <Footer />
    </div>
  );
};

export default MainLayout;
