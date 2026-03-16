import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { setAuthToken } from "../api.js";
import { useEffect } from "react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isTokenExpired = (token) => {
    if (!token) {
      return true;
    }
    const parts = token.split(".");
    if (parts.length !== 3) {
      return true;
    }
    try {
      const payload = JSON.parse(atob(parts[1]));
      const exp = payload?.exp;
      if (!exp) {
        return true;
      }
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  };

  const redirectToLogin = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setAuthToken(null);
    navigate("/admin/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "ADMIN" || isTokenExpired(token)) {
      redirectToLogin();
    }
  }, [location.pathname]);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (!token || role !== "ADMIN" || isTokenExpired(token)) {
        redirectToLogin();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setAuthToken(null);
    navigate("/admin/login");
  };

  return (
    <div className="admin">
      <aside className="sidebar">
        <div className="brand">Quản trị</div>
        <nav className="side-nav">
          <Link className={location.pathname === "/admin" ? "active" : ""} to="/admin">Sản phẩm</Link>
          <Link className={location.pathname.startsWith("/admin/categories") ? "active" : ""} to="/admin/categories">Loại hàng</Link>
          <Link className={location.pathname.startsWith("/admin/inventory") ? "active" : ""} to="/admin/inventory">Tồn kho</Link>
          <Link className={location.pathname.startsWith("/admin/users") ? "active" : ""} to="/admin/users">Tài khoản</Link>
          <Link className={location.pathname.startsWith("/admin/reports") ? "active" : ""} to="/admin/reports">Báo cáo</Link>
        </nav>
        <button className="link" onClick={logout}>Đăng xuất</button>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
