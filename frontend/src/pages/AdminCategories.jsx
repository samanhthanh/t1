import { useEffect, useMemo, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import api from "../api.js";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [editCategory, setEditCategory] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [query, setQuery] = useState("");
  const [sortDir, setSortDir] = useState("asc");

  const load = async () => {
    const res = await api.get("/admin/categories");
    setCategories(res.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = !q
      ? categories
      : categories.filter((c) => c.name.toLowerCase().includes(q));
    const sorted = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return sortDir === "desc" ? sorted.reverse() : sorted;
  }, [categories, query, sortDir]);

  const createCategory = async (e) => {
    e.preventDefault();
    setError("");
    const name = newName.trim();
    if (!name) {
      setError("Vui lòng nhập tên loại hàng.");
      return;
    }
    await api.post("/admin/categories", { name });
    setNewName("");
    load();
  };

  const openEdit = (c) => setEditCategory({ ...c });
  const closeEdit = () => setEditCategory(null);

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editCategory) return;
    const name = editCategory.name.trim();
    if (!name) return;
    await api.put(`/admin/categories/${editCategory.id}`, { name });
    closeEdit();
    load();
  };

  const openDelete = (c) => {
    setActionError("");
    setDeleteTarget(c);
  };
  const closeDelete = () => {
    setActionError("");
    setDeleteTarget(null);
  };

  const removeCategory = async () => {
    if (!deleteTarget) return;
    setActionError("");
    try {
      await api.delete(`/admin/categories/${deleteTarget.id}`);
      closeDelete();
      load();
    } catch (err) {
      const status = err?.response?.status;
      if (status === 409) {
        setActionError("Không thể xóa vì loại hàng đang được sử dụng.");
      } else {
        setActionError("Xóa thất bại. Vui lòng thử lại.");
      }
    }
  };

  return (
    <section>
      <h1>Loại hàng</h1>

      <div className="panel">
        <h2>Thêm loại hàng</h2>
        <form className="stack" onSubmit={createCategory}>
          {error && <p className="error">{error}</p>}
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Tên loại hàng"
          />
          <button type="submit">Tạo</button>
        </form>
      </div>

      <div className="panel">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h2>Danh sách loại hàng</h2>
          <div className="row">
            <input
              className="table-search"
              placeholder="Tìm loại hàng..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="button" onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}>
              Sắp xếp {sortDir === "asc" ? "A-Z" : "Z-A"}
            </button>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th className="col-actions">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td className="col-actions">
                  <div className="row row-actions">
                    <button className="icon-btn" onClick={() => openEdit(c)} aria-label="Sửa" title="Sửa">
                      <FaEdit />
                    </button>
                    <button className="icon-btn danger" onClick={() => openDelete(c)} aria-label="Xóa" title="Xóa">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editCategory && (
        <div className="modal">
          <div className="modal-card">
            <h2>Sửa loại hàng</h2>
            <form className="stack" onSubmit={saveEdit}>
              <input
                value={editCategory.name}
                onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                placeholder="Tên loại hàng"
              />
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
            <p>Bạn có muốn xoá loại hàng <strong>{deleteTarget.name}</strong> không?</p>
            {actionError && <p className="error">{actionError}</p>}
            <div className="row">
              <button className="danger" onClick={removeCategory}>Xóa</button>
              <button type="button" onClick={closeDelete}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
