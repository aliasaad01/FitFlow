import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import DesktopNav from "./DesktopNav";
import Footer from "./Footer";
import TopNav from "./TopNav";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-main-bg text-white">
      {/* يظهر فقط في الشاشات الكبيرة */}
      <DesktopNav />
      {/* يظهر فقط في الموبايل */}
      <TopNav />

      {/* المحتوى الرئيسي */}
      <main className="grow pb-4 px-4 pt-2 md:pt-6 max-w-7xl mx-auto w-full mt-23 md:mt-0">
        <Outlet />
      </main>

      {/* يظهر فقط في الموبايل */}
      <BottomNav />
      <Footer />
    </div>
  );
};

export default MainLayout;
