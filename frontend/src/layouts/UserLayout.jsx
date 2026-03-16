import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { setAuthToken } from "../api.js";

const getNotifyCount = () => {
  const raw = localStorage.getItem("cart_notify");
  const num = Number(raw);
  return Number.isFinite(num) ? num : 0;
};

export default function UserLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [notifyCount, setNotifyCount] = useState(getNotifyCount());

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQuery(params.get("q") || "");
  }, [location.search]);

  useEffect(() => {
    const sync = () => setNotifyCount(getNotifyCount());
    const onStorage = (e) => {
      if (e.key === "cart_notify") sync();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("cart_notify", sync);
    sync();
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cart_notify", sync);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setAuthToken(null);
    navigate("/shop/login");
  };

  const onSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(`/shop${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  };

  const hideHeader = location.pathname === "/shop/login" || location.pathname === "/shop/register";
  const isAuthed = Boolean(localStorage.getItem("token"));

  return (
    <div className="app">
      {!hideHeader && (
        <header className="store-header">
          <div className="store-logo">HYPERH</div>
          <nav className="store-nav">
            <Link to="/shop">Trang chủ</Link>
            <a href="#">Giới thiệu</a>
            <Link to="/shop">Sản phẩm</Link>
            <a href="#">Hỗ trợ khách hàng</a>
            <a href="#">Tin tức</a>
            <a href="#">Liên hệ</a>
            <a href="#">Hàng Order</a>
          </nav>
          <div className="store-actions">
            <Link className="cart-btn" to="/shop/cart">
              Giỏ hàng
              {notifyCount > 0 && <span className="cart-badge">+{notifyCount}</span>}
            </Link>
            {isAuthed ? (
              <button className="link logout-btn" onClick={logout}>Đăng xuất</button>
            ) : (
              <>
                <Link className="link" to="/shop/login">Đăng nhập</Link>
                <Link className="link" to="/shop/register">Đăng ký</Link>
              </>
            )}
          </div>
        </header>
      )}

      <main className="content">
        <Outlet />
      </main>

      <footer className="store-footer">
        <div className="footer-grid">
          <div>
            <h4>HYPERH</h4>
            <p>Thời trang tối giản cho mọi ngày.</p>
          </div>
          <div>
            <h4>Liên kết</h4>
            <a href="#">Giới thiệu</a>
            <a href="#">Sản phẩm</a>
            <a href="#">Tin tức</a>
            <a href="#">Liên hệ</a>
          </div>
          <div>
            <h4>Hỗ trợ</h4>
            <a href="#">Chính sách đổi trả</a>
            <a href="#">Hướng dẫn mua hàng</a>
            <a href="#">Câu hỏi thường gặp</a>
          </div>
          <div>
            <h4>Liên hệ</h4>
            <p>Hotline: 0900 000 000</p>
            <p>Email: support@hyperh.vn</p>
          </div>
        </div>
        <div className="footer-bottom">© 2026 HYPERH. All rights reserved.</div>
      </footer>
    </div>
  );
}
