import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

// استيراد الصفحات
import { lazy, Suspense } from "react";
import PageLoader from "../components/layout/PageLoader";

const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const Home = lazy(() => import("../pages/home/Home"));
const Workouts = lazy(() => import("../pages/workouts/Workouts"));
const Challenges = lazy(() => import("../pages/challenges/Challenges"));
const Nutrition = lazy(() => import("../pages/nutrition/Nutrition"));
const Profile = lazy(() => import("../pages/profile/Profile"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
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
      </Routes>{" "}
    </Suspense>
  );
};

export default AppRoutes;
