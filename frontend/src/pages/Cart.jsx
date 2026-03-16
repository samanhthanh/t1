import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";

const resetNotify = () => {
  localStorage.setItem("cart_notify", "0");
  window.dispatchEvent(new Event("cart_notify"));
};

function Cart() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const load = () => api.get("/user/cart").then((res) => setItems(res.data));

  useEffect(() => {
    load();
    resetNotify();
  }, []);

  return (
    <section>
      <h1>Giỏ hàng</h1>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <button type="button" className="back-btn" onClick={() => navigate(-1)}>Quay lại</button>
      </div>
      <ul className="list">
        {items.map((i) => (
          <li key={i.id}>
            <span>{i.product?.name}</span>
            <span>Số lượng: {i.quantity}</span>
            <span>Giá: {i.priceAtAdd}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Cart;
