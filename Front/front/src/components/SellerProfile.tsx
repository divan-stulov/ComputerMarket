import { useEffect, useState } from "react";
import { getMyProducts, deleteProduct } from "../services/productService";
import { getSellerProfile } from "../services/authService";
import ProductForm from "./ProductForm";

interface Props {
  email: string;
}

function SellerProfile({ email }: Props) {
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    loadMyProducts();
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const data = await getSellerProfile();
      setProfile(data);
    } catch {
      console.error("Ошибка загрузки профиля");
    }
  }

  async function loadMyProducts() {
    try {
      const data = await getMyProducts();
      setMyProducts(data);
    } catch {
      console.error("Ошибка загрузки товаров");
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteProduct(id);
      setMyProducts(myProducts.filter((p) => p.id !== id));
    } catch {
      console.error("Ошибка удаления товара");
    }
  }

  return (
    <div>
      <div className="profile-info-card">
        <p className="profile-info-label">Email</p>
        <p className="profile-info-value">{email}</p>
        <p className="profile-info-label">Роль</p>
        <p className="profile-info-value">Продавец</p>
        <p className="profile-info-label">Тип</p>
        <p className="profile-info-value">
          {profile?.type === "individual" ? "Индивидуальный предприниматель" : "Организация"}
        </p>
        <p className="profile-info-label">
          {profile?.type === "individual" ? "Полное имя" : "Название организации"}
        </p>
        <p className="profile-info-value">
          {profile?.type === "individual" ? profile?.fullName ?? "—" : profile?.companyName ?? "—"}
        </p>
        <p className="profile-info-label">Телефон</p>
        <p className="profile-info-value">{profile?.phone ?? "—"}</p>
        <p className="profile-info-label">Адрес</p>
        <p className="profile-info-value">{profile?.address ?? "—"}</p>
      </div>

      <div className="profile-section">
        <div className="section-header">
          <h3 className="section-title">Мои товары</h3>
          <button
            className="btn-primary"
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingProduct(null);
            }}
          >
            {showAddForm ? "Отмена" : "Добавить товар"}
          </button>
        </div>

        {showAddForm && (
          <ProductForm
            onSuccess={() => {
              setShowAddForm(false);
              loadMyProducts();
            }}
          />
        )}

        <div className="product-list">
          {myProducts.length === 0 && (
            <p className="empty-text">У вас пока нет товаров</p>
          )}
          {myProducts.map((product) => (
            <div key={product.id} className="animated-card">
              <div className="product-card">
                {product.imageUrl && (
                  <img
                    className="product-card-image"
                    src={product.imageUrl}
                    alt={product.name}
                  />
                )}
                <div className="product-card-info">
                  <p className="product-card-name">{product.name}</p>
                  <p className="product-card-detail">Арт: {product.inventoryNumber}</p>
                  <p className="product-card-detail">Тип: {product.productType}</p>
                  <p className="product-card-detail">Производитель: {product.manufacturer}</p>
                  <p className="product-card-detail">Цена: {product.price} ₽</p>
                  <p className="product-card-detail">Гарантия: {product.warrantyMonths} мес.</p>
                  <p className="product-card-detail">На складе: {product.stockQuantity} шт.</p>
                </div>
                <div className="product-card-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setEditingProduct(editingProduct?.id === product.id ? null : product);
                      setShowAddForm(false);
                    }}
                  >
                    {editingProduct?.id === product.id ? "Отмена" : "Изменить"}
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(product.id)}
                  >
                    Удалить
                  </button>
                </div>
              </div>

              {editingProduct?.id === product.id && (
                <ProductForm
                  initial={{
                    id: product.id,
                    inventoryNumber: product.inventoryNumber,
                    name: product.name,
                    description: product.description ?? "",
                    imageUrl: product.imageUrl ?? "",
                    typeId: product.typeId,
                    manufacturerId: product.manufacturerId,
                    warrantyMonths: product.warrantyMonths,
                    price: product.price,
                    stockQuantity: product.stockQuantity,
                  }}
                  onSuccess={() => {
                    setEditingProduct(null);
                    loadMyProducts();
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SellerProfile;