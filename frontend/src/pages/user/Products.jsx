import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../services/productService";

export default function Products() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [active, setActive] = useState(true);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts({
        page,
        size: 9,
        search,
        active,
      });

      setProducts(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error(err);

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

  return (
    <div className="products-page">

      {/* HEADER */}

      <div className="products-header">

        <div>
          <span className="eyebrow">INVENTORY</span>

          <h1>Products</h1>

          <p>
            Browse available products and reserve the stock you need.
          </p>
        </div>

        <div className="product-count">
          {products.length} products
        </div>

      </div>


      {/* FILTER BAR */}

      <div className="product-toolbar">

        <form
          className="search-box"
          onSubmit={handleSearch}
        >
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search products or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button type="submit">
            Search
          </button>
        </form>


        <select
          className="filter-select"
          value={active}
          onChange={(e) => {
            setActive(e.target.value === "true");
            setPage(0);
          }}
        >
          <option value="true">
            Active products
          </option>

          <option value="false">
            Inactive products
          </option>

          <option value="all">
            All products
          </option>
        </select>

      </div>


      {/* ERROR */}

      {error && (
        <div className="page-error">
          {error}
        </div>
      )}


      {/* LOADING */}

      {loading ? (
        <div className="products-grid">

          {Array.from({ length: 6 }).map((_, index) => (
            <div
              className="product-skeleton"
              key={index}
            >
              <div />
              <div />
              <div />
              <div />
            </div>
          ))}

        </div>
      ) : products.length === 0 ? (

        <div className="products-empty">

          <div className="empty-icon">
            □
          </div>

          <h2>No products found</h2>

          <p>
            Try changing your search or filter.
          </p>

        </div>

      ) : (

        <div className="products-grid">

          {products.map((product) => (

            <div
              className="product-card"
              key={product.id}
            >

              <div className="product-card-top">

                <span className="product-sku">
                  {product.sku}
                </span>

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

              </div>


              <div className="product-info">

                <h2>
                  {product.name}
                </h2>

                <p>
                  {product.description}
                </p>

              </div>


              <div className="product-price">

                <strong>
                  ₹{product.price.toLocaleString("en-IN")}
                </strong>

              </div>


              <div className="product-stock">

                <span>
                  Available stock
                </span>

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

              </div>


              <div className="product-actions">

                <Link
                  to={`/products/${product.id}`}
                  className="outline-button"
                >
                  View details
                </Link>

                {product.active &&
                product.availableStock > 0 ? (

                  <Link
                    to={`/products/${product.id}`}
                    className="dark-button small-button"
                  >
                    Reserve
                  </Link>

                ) : (

                  <button
                    className="disabled-button"
                    disabled
                  >
                    Unavailable
                  </button>

                )}

              </div>

            </div>

          ))}

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

    </div>
  );
}