import { useState } from "react";
import api, { setAuthToken } from "../api.js";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const res = await api.post("/auth/register", { email, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);
    setAuthToken(res.data.token);
    navigate("/shop/login");
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Đăng ký</h1>
        <form className="stack" onSubmit={submit}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mật khẩu" />
          <button type="submit">Đăng ký</button>
        </form>
        <p className="auth-hint">
          Đã có tài khoản? <Link to="/shop/login">Đăng nhập</Link>
        </p>
      </div>
    </section>
  );
}
