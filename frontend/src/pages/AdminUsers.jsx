import { useEffect, useState } from "react";
import api from "../api.js";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const load = async () => {
    const u = await api.get("/admin/users");
    setUsers(u.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <section>
      <h1>Tài khoản</h1>
      <div className="panel">
        <ul className="list">
          {users.map((u) => (
            <li key={u.id}>
              <span>{u.email}</span>
              <span>{u.role}</span>
              <span>{u.enabled ? "Hoạt động" : "Vô hiệu"}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
