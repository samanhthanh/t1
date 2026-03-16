import { useEffect, useState } from "react";
import api from "../api.js";

export default function AdminInventory() {
  const [products, setProducts] = useState([]);

  const load = async () => {
    const res = await api.get("/admin/products?page=0&size=100");
    setProducts(res.data.content || []);
  };

  useEffect(() => {
    load();
  }, []);

  const updateInventory = async (id, quantity) => {
    await api.patch(`/admin/products/${id}/inventory`, { quantity: Number(quantity) });
    load();
  };

  return (
    <section>
      <h1>Tồn kho</h1>
      <div className="panel">
        <ul className="list">
          {products.map((p) => (
            <li key={p.id}>
              <span>{p.name}</span>
              <input
                type="number"
                placeholder="Số lượng"
                onBlur={(e) => updateInventory(p.id, e.target.value)}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
