import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productService";

const emptyForm = {
  sku: "",
  name: "",
  description: "",
  price: "",
  availableStock: "",
  active: true,
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [active, setActive] = useState(null);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts({
        page,
        size: 10,
        search,
        active,
      });

      setProducts(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page, active]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    loadProducts();
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);

    setForm({
      sku: product.sku || "",
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      availableStock: product.availableStock || "",
      active: product.active,
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingProduct(null);
    setForm(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.sku || !form.name || !form.price) {
      setError(
        "SKU, product name and price are required."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        sku: form.sku,
        name: form.name,
        description: form.description,
        price: Number(form.price),
        availableStock: Number(form.availableStock),
        active: form.active,
      };

      if (editingProduct) {
        await updateProduct(
          editingProduct.id,
          payload
        );

        setSuccess("Product updated successfully.");
      } else {
        await createProduct(payload);

        setSuccess("Product created successfully.");
      }

      await loadProducts();

      setTimeout(() => {
        closeModal();
      }, 700);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Delete "${product.name}"?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteProduct(product.id);

      setSuccess("Product deleted successfully.");

      await loadProducts();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete product."
      );
    }
  };

  return (
    <div className="admin-products">

      {/* HEADER */}

      <div className="admin-products-header">

        <div>
          <span className="eyebrow">
            INVENTORY MANAGEMENT
          </span>

          <h1>Products</h1>

          <p>
            Create, update and manage your inventory.
          </p>
        </div>

        <button
          className="dark-button"
          onClick={openCreateModal}
        >
          + Add Product
        </button>

      </div>

      {/* MESSAGES */}

      {error && (
        <div className="page-error">
          {error}
        </div>
      )}

      {success && (
        <div className="auth-success">
          {success}
        </div>
      )}

      {/* TOOLBAR */}

      <div className="admin-product-toolbar">

        <form
          className="search-box"
          onSubmit={handleSearch}
        >
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search name or SKU..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <button type="submit">
            Search
          </button>
        </form>

        <select
          className="filter-select"
          value={
            active === null
              ? "all"
              : String(active)
          }
          onChange={(e) => {
            const value = e.target.value;

            setActive(
              value === "all"
                ? null
                : value === "true"
            );

            setPage(0);
          }}
        >
          <option value="all">
            All products
          </option>

          <option value="true">
            Active
          </option>

          <option value="false">
            Inactive
          </option>
        </select>

      </div>

      {/* TABLE */}

      {loading ? (
        <div className="admin-loading">
          Loading products...
        </div>
      ) : (

        <div className="admin-products-table-wrapper">

          <table className="admin-products-table">

            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {products.map((product) => (

                <tr key={product.id}>

                  <td>
                    <div className="admin-product-name">
                      <strong>
                        {product.name}
                      </strong>

                      <small>
                        ID #{product.id}
                      </small>
                    </div>
                  </td>

                  <td>
                    <span className="sku-text">
                      {product.sku}
                    </span>
                  </td>

                  <td>
                    ₹
                    {Number(
                      product.price
                    ).toLocaleString("en-IN")}
                  </td>

                  <td>
                    <strong
                      className={
                        product.availableStock === 0
                          ? "stock-danger"
                          : product.availableStock <= 5
                          ? "stock-warning"
                          : "stock-good"
                      }
                    >
                      {product.availableStock}
                    </strong>
                  </td>

                  <td>
                    <span
                      className={`status-badge ${
                        product.active
                          ? "confirmed"
                          : "cancelled"
                      }`}
                    >
                      {product.active
                        ? "ACTIVE"
                        : "INACTIVE"}
                    </span>
                  </td>

                  <td>

                    <div className="admin-product-actions">

                      <button
                        className="edit-button"
                        onClick={() =>
                          openEditModal(product)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDelete(product)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {products.length === 0 && (
            <div className="admin-empty">
              No products found.
            </div>
          )}

        </div>

      )}

      {/* PAGINATION */}

      {!loading && totalPages > 1 && (

        <div className="pagination">

          <button
            disabled={page === 0}
            onClick={() =>
              setPage((current) => current - 1)
            }
          >
            ← Previous
          </button>

          <span>
            Page {page + 1} of {totalPages}
          </span>

          <button
            disabled={page >= totalPages - 1}
            onClick={() =>
              setPage((current) => current + 1)
            }
          >
            Next →
          </button>

        </div>

      )}

      {/* MODAL */}

      {showModal && (

        <div className="modal-overlay">

          <div className="product-modal">

            <div className="modal-header">

              <div>
                <span className="eyebrow">
                  {editingProduct
                    ? "EDIT PRODUCT"
                    : "NEW PRODUCT"}
                </span>

                <h2>
                  {editingProduct
                    ? "Update product"
                    : "Add product"}
                </h2>
              </div>

              <button
                className="modal-close"
                onClick={closeModal}
              >
                ×
              </button>

            </div>

            {error && (
              <div className="page-error">
                {error}
              </div>
            )}

            {success && (
              <div className="auth-success">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="modal-form-grid">

                <div className="form-group">
                  <label>SKU</label>

                  <input
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    placeholder="LAP-001"
                  />
                </div>

                <div className="form-group">
                  <label>Product name</label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Business Laptop Pro"
                  />
                </div>

              </div>

              <div className="form-group">
                <label>Description</label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Product description..."
                  rows="3"
                />
              </div>

              <div className="modal-form-grid">

                <div className="form-group">
                  <label>Price</label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="74999"
                  />
                </div>

                <div className="form-group">
                  <label>Available stock</label>

                  <input
                    type="number"
                    min="0"
                    name="availableStock"
                    value={form.availableStock}
                    onChange={handleChange}
                    placeholder="10"
                  />
                </div>

              </div>

              <label className="active-checkbox">

                <input
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={handleChange}
                />

                <span>
                  Product is active
                </span>

              </label>

              <div className="modal-actions">

                <button
                  type="button"
                  className="outline-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingProduct
                    ? "Update product"
                    : "Create product"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}