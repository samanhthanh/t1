import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api.js";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").trim();
  const type = (searchParams.get("type") || "").trim();
  const [searchText, setSearchText] = useState(query);

  const [detailProduct, setDetailProduct] = useState(null);
  const [detailImage, setDetailImage] = useState("");
  const [detailQty, setDetailQty] = useState(1);
  const [detailError, setDetailError] = useState("");
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailSuccess, setDetailSuccess] = useState("");
  const [toast, setToast] = useState("");

  const img = (url) => {
    if (!url) return "https://via.placeholder.com/300";
    if (url.startsWith("/uploads/")) return `http://localhost:8080${url}`;
    return url;
  };

  const loadAll = () => {
    api.get("/public/products").then((res) => setProducts(res.data));
  };

  const loadCategories = () => {
    api.get("/public/categories").then((res) => setCategories(res.data || []));
  };

  const formatVnd = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return value;
    return new Intl.NumberFormat("vi-VN").format(Number(value));
  };

  const bumpNotify = () => {
    const raw = localStorage.getItem("cart_notify");
    const num = Number(raw);
    const next = Number.isFinite(num) ? num + 1 : 1;
    localStorage.setItem("cart_notify", String(next));
    window.dispatchEvent(new Event("cart_notify"));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    setSearchText(query);
    if (!query) {
      loadAll();
      return;
    }
    api.get(`/public/search?q=${encodeURIComponent(query)}`).then((res) => setProducts(res.data));
  }, [query]);

  const filteredProducts = type
    ? products.filter((p) => (p.type || "").toLowerCase() === type.toLowerCase())
    : products;

  const submitSearch = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    const value = searchText.trim();
    if (value) {
      next.set("q", value);
    } else {
      next.delete("q");
    }
    setSearchParams(next);
  };

  const openDetail = async (id) => {
    setDetailError("");
    setDetailSuccess("");
    setDetailQty(1);
    setDetailLoading(true);
    try {
      const res = await api.get(`/public/products/${id}`);
      const data = res.data;
      setDetailProduct(data);
      const gallery = Array.isArray(data.images) ? data.images.map((i) => i.url) : [];
      setDetailImage(gallery[0] || data.imageUrl || "");
    } catch (err) {
      setDetailError("Không tải được chi tiết sản phẩm.");
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setDetailProduct(null);
    setDetailError("");
    setDetailSuccess("");
    setDetailQty(1);
    setDetailImage("");
  };

  const addToCart = async () => {
    if (!detailProduct) return;
    setDetailError("");
    setDetailSuccess("");
    try {
      await api.post("/user/cart/items", {
        productId: Number(detailProduct.id),
        quantity: Number(detailQty)
      });
      const message = `Đã thêm ${detailProduct.name} (x${detailQty}) vào giỏ hàng.`;
      setDetailSuccess(message);
      setToast(message);
      setTimeout(() => setToast(""), 2500);
      bumpNotify();
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setDetailError("Vui lòng đăng nhập để mua hàng.");
      } else {
        setDetailError("Thêm vào giỏ hàng thất bại. Vui lòng thử lại.");
      }
    }
  };

  const addToCartFromList = async (product) => {
    if (!product) return;
    setDetailError("");
    setDetailSuccess("");
    try {
      await api.post("/user/cart/items", {
        productId: Number(product.id),
        quantity: 1
      });
      const message = `Đã thêm ${product.name} (x1) vào giỏ hàng.`;
      setToast(message);
      setTimeout(() => setToast(""), 2500);
      bumpNotify();
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setDetailError("Vui lòng đăng nhập để mua hàng.");
      } else {
        setDetailError("Thêm vào giỏ hàng thất bại. Vui lòng thử lại.");
      }
    }
  };

  return (
    <section className="home">
      {toast && <div className="toast">{toast}</div>}
      <div className="hero">
        <div className="hero-content">
          <h1>
            LET&apos;S CREATE SOMETHING
            <span>AWESOME</span>
          </h1>
          <p>Your design printed onto T-Shirts, badges, stickers & more custom products.</p>
          <button className="ghost">SHOP NOW</button>
        </div>
      </div>

      <div className="category-grid">
        <div className="category-card shoes">
          <span>SHOES</span>
          <small>COLLECTION</small>
        </div>
        <div className="category-card tshirt">
          <span>T-SHIRT</span>
          <small>COLLECTION</small>
        </div>
        <div className="category-card jeans">
          <span>JEANS</span>
          <small>COLLECTION</small>
        </div>
      </div>

      <div className="row" style={{ justifyContent: "flex-start", alignItems: "center" }}>
        <form className="category-search" onSubmit={submitSearch}>
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Tìm sản phẩm..."
          />
          <button type="submit" aria-label="Tìm kiếm">🔍</button>
        </form>
        <select
          className="category-filter"
          value={type}
          onChange={(e) => {
            const next = new URLSearchParams(searchParams);
            const value = e.target.value;
            if (value) {
              next.set("type", value);
            } else {
              next.delete("type");
            }
            setSearchParams(next);
          }}
        >
          <option value="">Tất cả loại</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      <h2 className="section-title">BEST SELLING PRODUCTS</h2>

      <div className="grid product-grid">
        {filteredProducts.map((p) => {
          const sizeText = Array.isArray(p.sizes) && p.sizes.length
            ? p.sizes.map((s) => s.size).join(", ")
            : p.size ?? p.sizeLabel ?? "—";
          const typeText =
            p.type ?? p.categoryName ?? p.category ?? p.category?.name ?? "—";
          return (
            <div className="card product-card" key={p.id} onClick={() => openDetail(p.id)}>
              <div className="image" style={{ backgroundImage: `url(${img(p.imageUrl)})` }} />
              <div className="card-body">
                <div className="meta">
                  <div className="meta-item">Tên: {p.name}</div>
                  <div className="meta-item">Loại: {typeText}</div>
                  <div className="meta-item">Giá: <span className="price">{formatVnd(p.price)} VND</span></div>
                  <div className="meta-item">Size: {sizeText}</div>
                </div>
                <p>{p.description}</p>
              </div>
              <button
                type="button"
                className="add-mini"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCartFromList(p);
                }}
                aria-label="Thêm vào giỏ"
                title="Thêm vào giỏ"
              >
                +
              </button>
            </div>
          );
        })}
      </div>

      {detailProduct && (
        <div className="modal">
          <div className="modal-card">
            <h2>Chi tiết sản phẩm</h2>
            {detailLoading ? (
              <p>Đang tải...</p>
            ) : (
              <>
                <div className="image" style={{ backgroundImage: `url(${img(detailImage || detailProduct.imageUrl)})` }} />
                {Array.isArray(detailProduct.images) && detailProduct.images.length > 0 && (
                  <div className="image-gallery">
                    {detailProduct.images.map((image) => (
                      <button
                        type="button"
                        key={image.id || image.url}
                        className={`thumb-btn${detailImage === image.url ? " active" : ""}`}
                        onClick={() => setDetailImage(image.url)}
                        aria-label="Chọn ảnh"
                      >
                        <img src={img(image.url)} alt={detailProduct.name} />
                      </button>
                    ))}
                  </div>
                )}
                <div className="kv">
                  <span>Tên</span>
                  <span>{detailProduct.name}</span>
                </div>
                <div className="kv">
                  <span>Loại</span>
                  <span>{detailProduct.type || "-"}</span>
                </div>
                <div className="kv">
                  <span>Giá</span>
                  <span>{formatVnd(detailProduct.price)} VND</span>
                </div>
                <div className="kv">
                  <span>Size</span>
                  <span>
                    {Array.isArray(detailProduct.sizes) && detailProduct.sizes.length
                      ? detailProduct.sizes.map((s) => `${s.size} (${s.quantity})`).join(", ")
                      : detailProduct.size || "-"}
                  </span>
                </div>
                <p>{detailProduct.description}</p>
                {detailError && <p className="error">{detailError}</p>}
                {detailSuccess && <p className="success">{detailSuccess}</p>}
                <div className="row">
                  <label className="field">
                    <span>Số lượng mua</span>
                    <input
                      type="number"
                      min="1"
                      value={detailQty}
                      onChange={(e) => setDetailQty(e.target.value)}
                    />
                  </label>
                </div>
                <div className="row">
                  <button onClick={addToCart}>Thêm vào giỏ</button>
                  <button type="button" onClick={closeDetail}>Đóng</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}



