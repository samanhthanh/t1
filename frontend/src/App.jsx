import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import Cart from "./pages/Cart.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminProducts from "./pages/AdminProducts.jsx";
import AdminInventory from "./pages/AdminInventory.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import AdminReports from "./pages/AdminReports.jsx";
import AdminCategories from "./pages/AdminCategories.jsx";
import UserLayout from "./layouts/UserLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

export default function App() {
  const location = useLocation();

  useEffect(() => {
    const isAdmin = location.pathname.startsWith("/admin");
    document.title = isAdmin ? "Admin" : "Clothing Shop";
    const icon = document.querySelector("link[rel='icon']");
    if (icon) {
      icon.setAttribute("href", isAdmin ? "/admin-favicon.svg" : "/user-favicon.svg");
    }
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/shop" replace />} />

      <Route path="/shop" element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="cart" element={<Cart />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminProducts />} />
        <Route path="inventory" element={<AdminInventory />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="categories" element={<AdminCategories />} />
      </Route>

      <Route path="*" element={<Navigate to="/shop" replace />} />
    </Routes>
  );
}
