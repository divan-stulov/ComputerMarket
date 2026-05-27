import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../services/authService";

interface Props {
  cart: any[];
  setCart: (cart: any[]) => void;
  onClose: () => void;
}

function CartDrawer({ cart, setCart, onClose }: Props) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [closing, setClosing] = useState(false);

  function handleClose() {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 240);
  }

  function removeFromCart(id: number) {
    const newCart = cart.filter((item) => item.id !== id);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  }

  function changeQuantity(id: number, delta: number) {
    const newCart = cart
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + delta } : item
      )
      .filter((item) => item.quantity > 0);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  }

  function handleCheckout() {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    if (getUserRole() !== "buyer") {
      setError("Оформить заказ может только покупатель");
      return;
    }
    handleClose();
    setTimeout(() => navigate("/checkout"), 240);
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div
      className={`drawer-overlay${closing ? " closing" : ""}`}
      onClick={handleClose}
    >
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3 className="drawer-title">Корзина</h3>
          <button className="modal-close" onClick={handleClose}>✕</button>
        </div>

        {cart.length === 0 && (
          <p className="empty-text">Корзина пуста</p>
        )}

        <div className="drawer-items">
          {cart.map((item) => (
            <div className="drawer-item" key={item.id}>
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="drawer-item-image"
                />
              )}
              <div className="product-card-info">
                <p className="product-card-name">{item.name}</p>
                <p className="product-card-detail">
                  {item.price} ₽ × {item.quantity}
                </p>
              </div>
              <div className="drawer-item-controls">
                <button className="qty-btn" onClick={() => changeQuantity(item.id, -1)}>−</button>
                <span>{item.quantity}</span>
                <button className="qty-btn" onClick={() => changeQuantity(item.id, 1)}>+</button>
                <button className="btn-danger" onClick={() => removeFromCart(item.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="drawer-footer">
            {error && <p className="auth-error">{error}</p>}
            <p className="drawer-total">Итого: {total.toFixed(2)} ₽</p>
            <button className="btn-primary" onClick={handleCheckout}>
              Оформить заказ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;