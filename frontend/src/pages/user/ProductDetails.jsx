import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../../services/productService";
import api from "../../services/api";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const increaseQuantity = () => {
    if (product && quantity < product.availableStock) {
      setQuantity((current) => current + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((current) => current - 1);
    }
  };

  const handleReserve = async () => {
    if (!product) return;

    setError("");
    setSuccess("");

    if (!product.active) {
      setError("Product is inactive and cannot be reserved.");
      return;
    }

    if (product.availableStock <= 0) {
      setError("This product is currently out of stock.");
      return;
    }

    if (quantity > product.availableStock) {
      setError(
        `Only ${product.availableStock} units are available.`
      );
      return;
    }

    try {
      setReserving(true);

      const response = await api.post("/reservations", {
        productId: product.id,
        quantity,
      });

      setSuccess(
        `Stock reserved successfully. Reservation ${response.data.reservationCode}`
      );

      // Backend has already reduced the available stock.
      setProduct((current) => ({
        ...current,
        availableStock:
          response.data.availableStockAfterReservation,
      }));

      setQuantity(1);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reserve stock."
      );
    } finally {
      setReserving(false);
    }
  };

  if (loading) {
    return (
      <div className="details-loading">
        Loading product...
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="details-error">
        <h2>Unable to load product</h2>
        <p>{error}</p>

        <Link to="/products" className="dark-button">
          ← Back to products
        </Link>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const stockClass =
    product.availableStock === 0
      ? "stock-danger"
      : product.availableStock <= 5
      ? "stock-warning"
      : "stock-good";

  return (
    <div className="product-details-page">

      <Link
        to="/products"
        className="back-link"
      >
        ← Back to products
      </Link>

      <div className="product-details">

        {/* LEFT */}

        <div className="product-details-main">

          <div className="details-top">

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

          <h1>{product.name}</h1>

          <p className="details-description">
            {product.description}
          </p>

          <div className="details-price">
            ₹{product.price.toLocaleString("en-IN")}
          </div>

          <div className="details-stock">

            <span>Available stock</span>

            <strong className={stockClass}>
              {product.availableStock}
            </strong>

          </div>

          <div className="details-meta">

            <div>
              <span>SKU</span>
              <strong>{product.sku}</strong>
            </div>

            <div>
              <span>Status</span>
              <strong>
                {product.active
                  ? "Available"
                  : "Unavailable"}
              </strong>
            </div>

          </div>

        </div>


        {/* RIGHT - RESERVATION */}

        <div className="reservation-card">

          <span className="eyebrow">
            RESERVE STOCK
          </span>

          <h2>
            Reserve this product
          </h2>

          <p>
            Select the quantity you need.
            Stock will be held according to the
            reservation policy.
          </p>

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

          <div className="quantity-section">

            <label>Quantity</label>

            <div className="quantity-control">

              <button
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                −
              </button>

              <strong>{quantity}</strong>

              <button
                onClick={increaseQuantity}
                disabled={
                  quantity >= product.availableStock
                }
              >
                +
              </button>

            </div>

          </div>

          <div className="reservation-summary">

            <span>Total quantity</span>

            <strong>
              {quantity} unit
              {quantity !== 1 ? "s" : ""}
            </strong>

          </div>

          <button
            className="primary-button reserve-button"
            onClick={handleReserve}
            disabled={
              reserving ||
              !product.active ||
              product.availableStock === 0
            }
          >
            {reserving
              ? "Reserving..."
              : product.availableStock === 0
              ? "Out of stock"
              : !product.active
              ? "Product unavailable"
              : "Reserve stock"}
          </button>

        </div>

      </div>
    </div>
  );
}