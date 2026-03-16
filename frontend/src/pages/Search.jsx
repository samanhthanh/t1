import { useState } from "react";
import api from "../api.js";

export default function Search() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const img = (url) => {
    if (!url) return "https://via.placeholder.com/300";
    if (url.startsWith("/uploads/")) return `http://localhost:8080${url}`;
    return url;
  };

  const onSearch = async (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    const res = await api.get(`/public/search?q=${encodeURIComponent(q)}`);
    setResults(res.data);
  };

  return (
    <section>
      <h1>Tìm kiếm sản phẩm</h1>
      <form className="search" onSubmit={onSearch}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nhập từ khóa..." />
        <button type="submit">Tìm kiếm</button>
      </form>
      <div className="grid">
        {results.map((p) => (
          <div className="card" key={p.id}>
            <div className="image" style={{ backgroundImage: `url(${img(p.imageUrl)})` }} />
            <div className="card-body">
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <div className="price">{p.price} VND</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
