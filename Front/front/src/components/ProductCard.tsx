interface Props {
  product: any;
  onOpen: () => void;
  onAddToCart: () => void;
}

function ProductCard({ product, onOpen, onAddToCart }: Props) {
  return (
    <div className="product-grid-card" onClick={onOpen}>
      <div className="product-grid-image-wrap">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="product-grid-image" />
        ) : (
          <div className="product-grid-no-image">Нет фото</div>
        )}
      </div>
      <div className="product-grid-info">
        <p className="product-grid-name">{product.name}</p>
        <p className="product-grid-price">{product.price} ₽</p>
        <p className="product-grid-stock">
          {product.stockQuantity > 0 ? `В наличии: ${product.stockQuantity} шт.` : "Нет в наличии"}
        </p>
      </div>
      <button
        className="btn-primary product-grid-btn"
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart();
        }}
      >
        В корзину
      </button>
    </div>
  );
}

export default ProductCard;