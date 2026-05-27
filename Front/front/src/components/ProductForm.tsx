import { useEffect, useState } from "react";
import { createProduct, updateProduct, getProductTypes, getManufacturers } from "../services/productService";

interface Props {
  onSuccess: () => void;
  initial?: {
    id: number;
    inventoryNumber: string;
    name: string;
    description: string;
    imageUrl: string;
    typeId: number;
    manufacturerId: number;
    warrantyMonths: number;
    price: number;
    stockQuantity: number;
  };
}

function ProductForm({ onSuccess, initial }: Props) {
  const [inventoryNumber, setInventoryNumber] = useState(initial?.inventoryNumber ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [typeId, setTypeId] = useState(initial?.typeId ?? 0);
  const [manufacturerId, setManufacturerId] = useState(initial?.manufacturerId ?? 0);
  const [warrantyMonths, setWarrantyMonths] = useState(initial?.warrantyMonths ?? 0);
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [stockQuantity, setStockQuantity] = useState(initial?.stockQuantity ?? 0);
  const [productTypes, setProductTypes] = useState<any[]>([]);
  const [manufacturers, setManufacturers] = useState<any[]>([]);
  const [error, setError] = useState("");

  const isEditing = initial !== undefined;

  useEffect(() => {
    getProductTypes().then(setProductTypes);
    getManufacturers().then(setManufacturers);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      if (isEditing) {
        await updateProduct(initial.id, {
          inventoryNumber,
          name,
          description,
          imageUrl,
          typeId,
          manufacturerId,
          warrantyMonths,
          price,
          stockQuantity,
        });
      } else {
        await createProduct({
          inventoryNumber,
          name,
          description,
          imageUrl,
          typeId,
          manufacturerId,
          warrantyMonths,
          price,
          stockQuantity,
        });
      }
      onSuccess();
    } catch {
      setError(isEditing ? "Ошибка при обновлении товара" : "Ошибка при добавлении товара");
    }
  }

  return (
    <form className="add-product-form" onSubmit={handleSubmit}>
      {error && <p className="auth-error">{error}</p>}

      <div className="form-field">
        <label>Инвентарный номер</label>
        <input
          type="text"
          value={inventoryNumber}
          onChange={(e) => setInventoryNumber(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label>Название</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label>Описание</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label>Ссылка на изображение</label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label>Тип товара</label>
        <select value={typeId} onChange={(e) => setTypeId(Number(e.target.value))}>
          <option value={0}>Выберите тип</option>
          {productTypes.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label>Производитель</label>
        <select value={manufacturerId} onChange={(e) => setManufacturerId(Number(e.target.value))}>
          <option value={0}>Выберите производителя</option>
          {manufacturers.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label>Гарантия (месяцев)</label>
        <input
          type="number"
          value={warrantyMonths}
          onChange={(e) => setWarrantyMonths(Number(e.target.value))}
        />
      </div>

      <div className="form-field">
        <label>Цена (₽)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>

      <div className="form-field">
        <label>Количество на складе</label>
        <input
          type="number"
          value={stockQuantity}
          onChange={(e) => setStockQuantity(Number(e.target.value))}
        />
      </div>

      <button type="submit" className="btn-primary">
        {isEditing ? "Сохранить изменения" : "Добавить товар"}
      </button>
    </form>
  );
}

export default ProductForm;