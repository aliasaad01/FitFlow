import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

// استيراد الصفحات
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/home/Home";
import Workouts from "../pages/workouts/Workouts";
import Challenges from "../pages/challenges/Challenges";
import Nutrition from "../pages/nutrition/Nutrition";
import Profile from "../pages/profile/Profile";
import AdminDashboard from "../pages/admin/AdminDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. المسارات العامة */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 2. مسارات المستخدمين (المحمية) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* 3. مسار الأدمن (تعديل: حماية الصلاحية + فصل الـ Layout إذا لزم الأمر) */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        {/* إذا بدك الأدمن يشوف الـ Navbar العادي خليه جوا MainLayout */}
        {/* إذا بدك صفحة كاملة خاصة فيه (وهو الأرجح) خليها هيك: */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* 4. مسار افتراضي */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
