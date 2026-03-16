import { useState } from "react";
import api, { setAuthToken } from "../api.js";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.role === "ADMIN") {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setAuthToken(null);
        setError("Tài khoản không có quyền user.");
        return;
      }
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      setAuthToken(res.data.token);
      navigate("/shop");
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 400) {
        setError("Sai tài khoản hoặc mật khẩu.");
      } else {
        setError(err?.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.");
      }
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Đăng nhập</h1>
        <form className="stack" onSubmit={submit}>
          {error && <p className="error">{error}</p>}
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mật khẩu" />
          <button type="submit">Đăng nhập</button>
        </form>
        <p className="auth-hint">
          Chưa có tài khoản? <Link to="/shop/register">Đăng ký</Link>
        </p>
      </div>
    </section>
  );
}
