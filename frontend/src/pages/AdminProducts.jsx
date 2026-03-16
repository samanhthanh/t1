import { useEffect, useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import api from "../api.js";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 8;

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    type: "",
    active: true
  });
  const [sizes, setSizes] = useState([{ size: "", quantity: 0 }]);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);

  const [detailProduct, setDetailProduct] = useState(null);

  const [editProduct, setEditProduct] = useState(null);
  const [editSizes, setEditSizes] = useState([]);
  const [editImage, setEditImage] = useState(null);
  const [editGalleryFiles, setEditGalleryFiles] = useState([]);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [nameQuery, setNameQuery] = useState("");
  const [qtyValue, setQtyValue] = useState("");
  const [qtyOp, setQtyOp] = useState("gte");
  const [priceSort, setPriceSort] = useState("");

  const load = async (pageIndex = page) => {
    const res = await api.get(`/admin/products?page=${pageIndex - 1}&size=${pageSize}`);
    setProducts(res.data.content || []);
    setTotalPages(res.data.totalPages || 1);
  };

  const loadCategories = async () => {
    const res = await api.get("/admin/categories");
    setCategories(res.data || []);
  };

  useEffect(() => {
    load(1);
    loadCategories();
  }, []);

  const openCreate = () => setCreateOpen(true);
  const closeCreate = () => {
    setCreateOpen(false);
    setCreateError("");
    setSizes([{ size: "", quantity: 0 }]);
    setThumbnailFile(null);
    setGalleryFiles([]);
  };

  const addSizeRow = () => setSizes((prev) => [...prev, { size: "", quantity: 0 }]);
  const updateSizeRow = (index, field, value) => {
    setSizes((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };
  const removeSizeRow = (index) => {
    setSizes((prev) => prev.filter((_, i) => i !== index));
  };

  const addEditSizeRow = () => setEditSizes((prev) => [...prev, { size: "", quantity: 0 }]);
  const updateEditSizeRow = (index, field, value) => {
    setEditSizes((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };
  const removeEditSizeRow = (index) => {
    setEditSizes((prev) => prev.filter((_, i) => i !== index));
  };

  const createProduct = async (e) => {
    e.preventDefault();
    if (creating) return;
    setCreateError("");

    const name = newProduct.name.trim();
    const price = Number(newProduct.price);
    const type = newProduct.type.trim();
    const normalizedSizes = sizes
      .map((row) => ({ size: row.size.trim(), quantity: Number(row.quantity) }))
      .filter((row) => row.size);

    if (!name) {
      setCreateError("Vui lòng nhập tên sản phẩm.");
      return;
    }
    if (!price || price <= 0) {
      setCreateError("Giá phải lớn hơn 0.");
      return;
    }
    if (!type) {
      setCreateError("Vui lòng chọn loại hàng.");
      return;
    }
    if (!normalizedSizes.length) {
      setCreateError("Vui lòng nhập ít nhất 1 size.");
      return;
    }
    if (normalizedSizes.some((row) => !Number.isFinite(row.quantity) || row.quantity < 0)) {
      setCreateError("Số lượng size phải >= 0.");
      return;
    }
    if (!thumbnailFile) {
      setCreateError("Vui lòng chọn ảnh đại diện.");
      return;
    }

    let createdId = null;
    setCreating(true);
    try {
      const created = await api.post("/admin/products", {
        ...newProduct,
        sizes: normalizedSizes
      });
      createdId = created.data.id;

      const form = new FormData();
      form.append("file", thumbnailFile);
      await api.post(`/admin/products/${createdId}/image`, form, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (galleryFiles.length) {
        const galleryForm = new FormData();
        galleryFiles.forEach((file) => galleryForm.append("files", file));
        await api.post(`/admin/products/${createdId}/images`, galleryForm, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      setNewProduct({ name: "", description: "", price: 0, type: "", active: true });
      setSizes([{ size: "", quantity: 0 }]);
      setThumbnailFile(null);
      setGalleryFiles([]);
      closeCreate();
      load(1);
    } catch (err) {
      if (createdId) {
        try {
          await api.delete(`/admin/products/${createdId}`);
        } catch {
          // best-effort rollback
        }
      }
      const message = err?.response?.data?.message || err?.message || "Tạo sản phẩm thất bại.";
      setCreateError(message);
    } finally {
      setCreating(false);
    }
  };

  const openDetail = (p) => setDetailProduct(p);
  const closeDetail = () => setDetailProduct(null);

  const openEdit = (p) => {
    setEditProduct({ ...p });
    const nextSizes = Array.isArray(p.sizes)
      ? p.sizes.map((s) => ({ size: s.size, quantity: s.quantity }))
      : [];
    setEditSizes(nextSizes.length ? nextSizes : [{ size: "", quantity: 0 }]);
    setEditImage(null);
    setEditGalleryFiles([]);
  };

  const closeEdit = () => {
    setEditProduct(null);
    setEditSizes([]);
    setEditImage(null);
    setEditGalleryFiles([]);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    const normalizedEditSizes = editSizes
      .map((row) => ({ size: row.size.trim(), quantity: Number(row.quantity) }))
      .filter((row) => row.size);

    await api.put(`/admin/products/${editProduct.id}`, {
      name: editProduct.name,
      description: editProduct.description,
      price: Number(editProduct.price),
      type: editProduct.type,
      imageUrl: editProduct.imageUrl,
      active: editProduct.active,
      sizes: normalizedEditSizes
    });

    if (editImage) {
      const form = new FormData();
      form.append("file", editImage);
      await api.post(`/admin/products/${editProduct.id}/image`, form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    }

    if (editGalleryFiles.length) {
      const galleryForm = new FormData();
      editGalleryFiles.forEach((file) => galleryForm.append("files", file));
      await api.post(`/admin/products/${editProduct.id}/images`, galleryForm, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    }

    closeEdit();
    load(page);
  };

  const openDelete = (p) => setDeleteTarget(p);
  const closeDelete = () => setDeleteTarget(null);
  const removeProduct = async () => {
    if (!deleteTarget) return;
    await api.delete(`/admin/products/${deleteTarget.id}`);
    closeDelete();
    load(page);
  };

  const img = (url) => {
    if (!url) return "https://via.placeholder.com/80";
    if (url.startsWith("/uploads/")) return `http://localhost:8080${url}`;
    return url;
  };

  const formatVnd = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return value;
    return new Intl.NumberFormat("vi-VN").format(Number(value));
  };

  const formatSizes = (product) => {
    if (Array.isArray(product.sizes) && product.sizes.length) {
      return product.sizes.map((s) => s.size).join(", ");
    }
    return product.size || "-";
  };

  const filteredItems = products
    .filter((p) => {
      const q = nameQuery.trim().toLowerCase();
      if (!q) return true;
      return (p.name || "").toLowerCase().includes(q);
    })
    .filter((p) => {
      if (qtyValue === "" || qtyValue === null) return true;
      const qty = Number(p.quantity);
      const value = Number(qtyValue);
      if (!Number.isFinite(qty) || !Number.isFinite(value)) return false;
      if (qtyOp === "lte") return qty <= value;
      return qty >= value;
    })
    .sort((a, b) => {
      if (priceSort === "asc") return Number(a.price) - Number(b.price);
      if (priceSort === "desc") return Number(b.price) - Number(a.price);
      return 0;
    });

  return (
    <section>
      <h1>Sản phẩm</h1>

      <div className="panel">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h2>Danh sách sản phẩm</h2>
          <div className="row table-filters">
            <label className="field">
              <span>Tìm theo tên</span>
              <input
                className="table-search"
                value={nameQuery}
                onChange={(e) => setNameQuery(e.target.value)}
              />
            </label>
            <label className="field">
              <span>Lọc số lượng</span>
              <div className="row">
                <select
                  className="table-search"
                  value={qtyOp}
                  onChange={(e) => setQtyOp(e.target.value)}
                >
                  <option value="gte">≥</option>
                  <option value="lte">≤</option>
                </select>
                <input
                  className="table-search"
                  type="number"
                  min="0"
                  value={qtyValue}
                  onChange={(e) => setQtyValue(e.target.value)}
                />
              </div>
            </label>
            <label className="field">
              <span>Sắp xếp giá</span>
              <select
                className="table-search"
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value)}
              >
                <option value="">Mặc định</option>
                <option value="asc">Thấp đến cao</option>
                <option value="desc">Cao đến thấp</option>
              </select>
            </label>
            <button onClick={openCreate}>Thêm sản phẩm</button>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ảnh</th>
              <th>Tên</th>
              <th>Size</th>
              <th>Loại</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Trạng thái</th>
              <th className="col-actions">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td><img className="thumb" src={img(p.imageUrl)} alt={p.name} /></td>
                <td>{p.name}</td>
                <td>{formatSizes(p)}</td>
                <td>{p.type || "-"}</td>
                <td>{formatVnd(p.price)} VND</td>
                <td>{typeof p.quantity === "number" ? p.quantity : "-"}</td>
                <td>{p.active ? "Hiển thị" : "Ẩn"}</td>
                <td className="col-actions">
                  <div className="row row-actions">
                    <button className="icon-btn" onClick={() => openDetail(p)} aria-label="Chi tiết" title="Chi tiết">
                      <FaEye />
                    </button>
                    <button className="icon-btn" onClick={() => openEdit(p)} aria-label="Sửa" title="Sửa">
                      <FaEdit />
                    </button>
                    <button className="icon-btn danger" onClick={() => openDelete(p)} aria-label="Xóa" title="Xóa">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="row pager">
          <button
            disabled={page === 1}
            onClick={() => {
              const next = page - 1;
              setPage(next);
              load(next);
            }}
          >
            Trước
          </button>
          <span>Trang {page} / {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => {
              const next = page + 1;
              setPage(next);
              load(next);
            }}
          >
            Sau
          </button>
        </div>
      </div>

      {createOpen && (
        <div className="modal">
          <div className="modal-card">
            <h2>Thêm sản phẩm</h2>
            <form className="stack" onSubmit={createProduct}>
              {createError && <p className="error">{createError}</p>}
              <label className="field">
                <span>Tên</span>
                <input value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
              </label>
              <label className="field">
                <span>Mô tả</span>
                <input value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
              </label>
              <label className="field">
                <span>Giá</span>
                <input type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })} />
              </label>
              <div className="field">
                <span>Size &amp; số lượng</span>
                <div className="stack">
                  {sizes.map((row, index) => (
                    <div className="row" key={`size-${index}`}>
                      <input
                        placeholder="Size"
                        value={row.size}
                        onChange={(e) => updateSizeRow(index, "size", e.target.value)}
                      />
                      <input
                        type="number"
                        min="0"
                        placeholder="Số lượng"
                        value={row.quantity}
                        onChange={(e) => updateSizeRow(index, "quantity", Number(e.target.value))}
                      />
                      <button
                        type="button"
                        className="danger"
                        onClick={() => removeSizeRow(index)}
                        disabled={sizes.length === 1}
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={addSizeRow}>Thêm size</button>
                </div>
              </div>
              <label className="field">
                <span>Loại</span>
                <select value={newProduct.type} onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}>
                  <option value="">Chọn loại hàng</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Ảnh đại diện</span>
                <input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
              </label>
              <label className="field">
                <span>Ảnh chi tiết (nhiều ảnh)</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setGalleryFiles(Array.from(e.target.files || []))}
                />
              </label>
              <div className="row">
                <button type="submit" disabled={creating}>
                  {creating ? "Đang tạo..." : "Tạo"}
                </button>
                <button type="button" onClick={closeCreate} disabled={creating}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {detailProduct && (
        <div className="modal">
          <div className="modal-card">
            <h2>Chi tiết sản phẩm</h2>
            <div className="kv">
              <span>Tên</span>
              <span>{detailProduct.name}</span>
            </div>
            <div className="kv">
              <span>Size</span>
              <span>{formatSizes(detailProduct)}</span>
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
              <span>Số lượng</span>
              <span>{typeof detailProduct.quantity === "number" ? detailProduct.quantity : "-"}</span>
            </div>
            <div className="kv">
              <span>Trạng thái</span>
              <span>{detailProduct.active ? "Hiển thị" : "Ẩn"}</span>
            </div>
            {Array.isArray(detailProduct.sizes) && detailProduct.sizes.length > 0 && (
              <div className="kv">
                <span>Chi tiết size</span>
                <span>
                  {detailProduct.sizes.map((s) => `${s.size} (${s.quantity})`).join(", ")}
                </span>
              </div>
            )}
            <p>{detailProduct.description}</p>
            <div className="row">
              <button onClick={closeDetail}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {editProduct && (
        <div className="modal">
          <div className="modal-card">
            <h2>Sửa sản phẩm</h2>
            <form className="stack" onSubmit={saveEdit}>
              <label className="field">
                <span>Tên</span>
                <small>Tên hiển thị trên sản phẩm.</small>
                <input value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} />
              </label>
              <label className="field">
                <span>Mô tả</span>
                <small>Mô tả ngắn giúp khách hiểu về sản phẩm.</small>
                <input value={editProduct.description || ""} onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} />
              </label>
              <label className="field">
                <span>Giá</span>
                <small>Giá bán cho khách hàng.</small>
                <input type="number" value={editProduct.price} onChange={(e) => setEditProduct({ ...editProduct, price: Number(e.target.value) })} />
              </label>
              <div className="field">
                <span>Size &amp; số lượng</span>
                <small>Chỉnh sửa size và số lượng theo từng size.</small>
                <div className="stack">
                  {editSizes.map((row, index) => (
                    <div className="row" key={`edit-size-${index}`}>
                      <input
                        placeholder="Size"
                        value={row.size}
                        onChange={(e) => updateEditSizeRow(index, "size", e.target.value)}
                      />
                      <input
                        type="number"
                        min="0"
                        placeholder="Số lượng"
                        value={row.quantity}
                        onChange={(e) => updateEditSizeRow(index, "quantity", Number(e.target.value))}
                      />
                      <button
                        type="button"
                        className="danger"
                        onClick={() => removeEditSizeRow(index)}
                        disabled={editSizes.length === 1}
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={addEditSizeRow}>Thêm size</button>
                </div>
              </div>
              <label className="field">
                <span>Loại</span>
                <small>Chọn loại hàng đã tạo.</small>
                <select value={editProduct.type || ""} onChange={(e) => setEditProduct({ ...editProduct, type: e.target.value })}>
                  <option value="">Chọn loại hàng</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Ảnh đại diện</span>
                <small>Chọn ảnh mới nếu muốn thay đổi ảnh đại diện.</small>
                <input type="file" accept="image/*" onChange={(e) => setEditImage(e.target.files?.[0] || null)} />
              </label>
              <label className="field">
                <span>Ảnh chi tiết (thêm mới)</span>
                <small>Có thể chọn nhiều ảnh để bổ sung gallery.</small>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setEditGalleryFiles(Array.from(e.target.files || []))}
                />
              </label>
              <label className="field">
                <span>Hiển thị</span>
                <small>Bật/tắt hiển thị trên gian hàng.</small>
                <label className="row">
                  <input type="checkbox" checked={editProduct.active} onChange={(e) => setEditProduct({ ...editProduct, active: e.target.checked })} />
                  Hiển thị
                </label>
              </label>
              <div className="row">
                <button type="submit">Lưu</button>
                <button type="button" onClick={closeEdit}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="modal">
          <div className="modal-card modal-danger">
            <h2>Xác nhận xóa</h2>
            <p>Bạn có muốn xoá sản phẩm <strong>{deleteTarget.name}</strong> không?</p>
            <div className="row">
              <button className="danger" onClick={removeProduct}>Xóa</button>
              <button type="button" onClick={closeDelete}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
