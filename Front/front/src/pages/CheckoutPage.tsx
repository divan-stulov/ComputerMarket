import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/orderService";

function CheckoutPage() {
  const navigate = useNavigate();
  const cart = JSON.parse(localStorage.getItem("cart") ?? "[]");

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const total = cart.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  function formatCardNumber(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }

  function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      return digits.slice(0, 2) + "/" + digits.slice(2);
    }
    return digits;
  }

  async function handlePay() {
    setError("");

    if (cardNumber.replace(/\s/g, "").length !== 16) {
      setError("Введите корректный номер карты");
      return;
    }
    if (expiry.length !== 5) {
      setError("Введите корректную дату");
      return;
    }
    if (cvc.length !== 3) {
      setError("Введите корректный CVC");
      return;
    }

    setLoading(true);
    try {
      const items = cart.map((item: any) => ({
        productId: item.id,
        quantity: item.quantity,
      }));
      await createOrder(items);
      localStorage.setItem("cart", JSON.stringify([]));
      navigate("/checkout/success");
    } catch {
      setError("Ошибка при оформлении заказа. Проверьте наличие товаров.");
    } finally {
      setLoading(false);
    }
  }

  if (cart.length === 0) {
    return (
      <div className="error-page">
        <p className="error-message">Корзина пуста</p>
        <button className="btn-primary" onClick={() => navigate("/catalog")}>
          В каталог
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-card">
        <h2 className="auth-title">Оплата заказа</h2>

        <div className="checkout-items">
          {cart.map((item: any) => (
            <div className="checkout-item" key={item.id}>
              <span className="checkout-item-name">{item.name}</span>
              <span className="checkout-item-qty">{item.quantity} шт.</span>
              <span className="checkout-item-price">
                {(item.price * item.quantity).toFixed(2)} ₽
              </span>
            </div>
          ))}
          <div className="checkout-total">
            <span>Итого</span>
            <span>{total.toFixed(2)} ₽</span>
          </div>
        </div>

        <div className="checkout-divider" />

        <h3 className="checkout-section-title">Данные карты</h3>

        {error && <p className="auth-error">{error}</p>}

        <div className="form-field">
          <label>Номер карты</label>
          <input
            type="text"
            placeholder="0000 0000 0000 0000"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          />
        </div>

        <div className="checkout-row">
          <div className="form-field">
            <label>Срок действия</label>
            <input
              type="text"
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            />
          </div>

          <div className="form-field">
            <label>CVC</label>
            <input
              type="text"
              placeholder="000"
              maxLength={3}
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, ""))}
            />
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={handlePay}
          disabled={loading}
        >
          {loading ? "Обработка..." : `Оплатить ${total.toFixed(2)} ₽`}
        </button>

        <button
          className="btn-secondary"
          onClick={() => navigate("/catalog")}
          disabled={loading}
        >
          Вернуться в каталог
        </button>
      </div>
    </div>
  );
}

export default CheckoutPage;