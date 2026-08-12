import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AccessDenied() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const goBack = () => {
    if (user?.role === "ADMIN") {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="access-denied">

      <div className="access-denied-card">

        <span className="eyebrow">
          403 — ACCESS DENIED
        </span>

        <h1>
          You don't have permission.
        </h1>

        <p>
          Your account doesn't have access to this
          section of SmartStock.
        </p>

        <button
          className="dark-button"
          onClick={goBack}
        >
          Back to Dashboard
        </button>

      </div>

    </div>
  );
}