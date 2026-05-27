import { useEffect, useState } from "react";
import { updateOrderStatus, cancelOrder, getMyOrders } from "../services/orderService";
import { getBuyerProfile } from "../services/authService";

interface Props {
  email: string;
}

function BuyerProfile({ email }: Props) {
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    loadMyOrders();
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const data = await getBuyerProfile();
      setProfile(data);
    } catch {
      console.error("Ошибка загрузки профиля");
    }
  }

  async function loadMyOrders() {
    try {
      const data = await getMyOrders();
      setMyOrders(data);
    } catch {
      console.error("Ошибка загрузки заказов");
    }
  }

  async function handleCancel(id: number) {
    try {
      await cancelOrder(id);
      setMyOrders(myOrders.filter((o) => o.id !== id));
    } catch {
      console.error("Ошибка отмены заказа");
    }
  }

  async function handleNextStatus(id: number) {
  try {
    await updateOrderStatus(id);
    const data = await getMyOrders();
    setMyOrders(data);
  } catch {
    console.error("Ошибка обновления статуса");
  }
}

  return (
    <div>
      <div className="profile-info-card">
        <p className="profile-info-label">Email</p>
        <p className="profile-info-value">{email}</p>
        <p className="profile-info-label">Роль</p>
        <p className="profile-info-value">Покупатель</p>
        <p className="profile-info-label">Полное имя</p>
        <p className="profile-info-value">{profile?.fullName ?? "—"}</p>
        <p className="profile-info-label">Телефон</p>
        <p className="profile-info-value">{profile?.phone ?? "—"}</p>
      </div>

      <div className="profile-section">
        <h3 className="section-title">Мои заказы</h3>
        <div className="order-list">
          {myOrders.length === 0 && (
            <p className="empty-text">У вас пока нет заказов</p>
          )}
          {myOrders.map((order) => (
            <div className="order-card animated-card" key={order.id}>
              {order.productImageUrl && (
                <img
                  className="product-card-image"
                  src={order.productImageUrl}
                  alt={order.productName}
                />
              )}
              <div className="product-card-info">
                <p className="product-card-name">{order.productName}</p>
                <p className="product-card-detail">
                  Количество: {order.quantity} шт.
                </p>
                <p className="product-card-detail">
                  Сумма: {order.totalPrice} ₽
                </p>
                <p className="product-card-detail">
                  Статус: {order.status}
                </p>
              </div>
              {order.status !== "completed" && order.status !== "cancelled" && (
                <div className="product-card-actions">
                    {order.status === "pending" && (
                    <button
                        className="btn-danger"
                        onClick={() => handleCancel(order.id)}
                    >
                        Отменить
                    </button>
                    )}
                    <button
                    className="btn-secondary"
                    onClick={() => handleNextStatus(order.id)}
                    >
                    {order.status === "pending" && "Подтвердить"}
                    {order.status === "confirmed" && "Отправить"}
                    {order.status === "shipped" && "Завершить"}
                    </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BuyerProfile;