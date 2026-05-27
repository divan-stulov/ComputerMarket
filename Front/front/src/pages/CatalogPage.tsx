import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, getProductTypes, getManufacturers } from "../services/productService";
import { isAuthenticated } from "../services/authService";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import CartDrawer from "../components/CartDrawer";

function CatalogPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [productTypes, setProductTypes] = useState<any[]>([]);
  const [manufacturers, setManufacturers] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<any[]>(() => {
    return JSON.parse(localStorage.getItem("cart") ?? "[]");
  });

  const [filterTypeId, setFilterTypeId] = useState(0);
  const [filterManufacturerId, setFilterManufacturerId] = useState(0);
  const [filterMinPrice, setFilterMinPrice] = useState("");
  const [filterMaxPrice, setFilterMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const navigate = useNavigate();

  useEffect(() => {
    getProductTypes().then(setProductTypes);
    getManufacturers().then(setManufacturers);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [filterTypeId, filterManufacturerId, filterMinPrice, filterMaxPrice, sortBy, sortOrder]);

  async function loadProducts() {
    try {
      const data = await getProducts({
        typeId: filterTypeId || undefined,
        manufacturerId: filterManufacturerId || undefined,
        minPrice: filterMinPrice ? Number(filterMinPrice) : undefined,
        maxPrice: filterMaxPrice ? Number(filterMaxPrice) : undefined,
        sortBy: sortBy || undefined,
        sortOrder: sortBy ? sortOrder : undefined,
      });
      setProducts(data);
    } catch {
      console.error("Ошибка загрузки товаров");
    }
  }

  function addToCart(product: any) {
    const existing = cart.find((item: any) => item.id === product.id);
    let newCart;
    if (existing) {
      newCart = cart.map((item: any) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  }

  function cartCount() {
    return cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
  }

  return (
    <div className="catalog-page">
      <div className="catalog-header">
        <h2 className="catalog-title">Каталог</h2>

        <div className="catalog-filters">
          <select
            value={filterTypeId}
            onChange={(e) => setFilterTypeId(Number(e.target.value))}
          >
            <option value={0}>Все типы</option>
            {productTypes.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <select
            value={filterManufacturerId}
            onChange={(e) => setFilterManufacturerId(Number(e.target.value))}
          >
            <option value={0}>Все производители</option>
            {manufacturers.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Цена от"
            value={filterMinPrice}
            onChange={(e) => setFilterMinPrice(e.target.value)}
          />

          <input
            type="number"
            placeholder="Цена до"
            value={filterMaxPrice}
            onChange={(e) => setFilterMaxPrice(e.target.value)}
          />

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Без сортировки</option>
            <option value="price">По цене</option>
            <option value="name">По названию</option>
            <option value="warranty">По гарантии</option>
          </select>

          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">По возрастанию</option>
            <option value="desc">По убыванию</option>
          </select>
        </div>

        <div className="catalog-header-actions">
          {isAuthenticated() && (
            <button className="btn-secondary" onClick={() => navigate("/profile")}>
              Профиль
            </button>
          )}
          {!isAuthenticated() && (
            <button className="btn-secondary" onClick={() => navigate("/login")}>
              Войти
            </button>
          )}
          <button className="btn-primary cart-btn" onClick={() => setCartOpen(true)}>
            Корзина {cartCount() > 0 && <span className="cart-count">{cartCount()}</span>}
          </button>
        </div>
      </div>

      <div className="product-grid">
        {products.length === 0 && (
          <p className="empty-text">Товары не найдены</p>
        )}
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onOpen={() => setSelectedProduct(product)}
            onAddToCart={() => addToCart(product)}
          />
        ))}
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={() => addToCart(selectedProduct)}
        />
      )}

      {cartOpen && (
        <CartDrawer
          cart={cart}
          setCart={setCart}
          onClose={() => setCartOpen(false)}
        />
      )}
    </div>
  );
}

export default CatalogPage;