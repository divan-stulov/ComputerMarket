import { useNavigate } from "react-router-dom";

function CheckoutSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <h1 className="error-code">✓</h1>
      <p className="error-message">Заказ оформлен!</p>
      <p className="error-hint">Спасибо за покупку</p>
      <div style={{ display: "flex", gap: "8px" }}>
        <button className="btn-primary" onClick={() => navigate("/profile")}>
          Мои заказы
        </button>
        <button className="btn-secondary" onClick={() => navigate("/catalog")}>
          В каталог
        </button>
      </div>
    </div>
  );
}

export default CheckoutSuccessPage;