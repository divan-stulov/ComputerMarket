interface Props {
  product: any;
  onClose: () => void;
  onAddToCart: () => void;
}

function ProductModal({ product, onClose, onAddToCart }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-body">
          <div className="modal-image-wrap">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="modal-image" />
            ) : (
              <div className="product-grid-no-image">Нет фото</div>
            )}
          </div>

          <div className="modal-info">
            <h3 className="modal-name">{product.name}</h3>
            <p className="modal-price">{product.price} ₽</p>
            <p className="product-card-detail">Тип: {product.productType}</p>
            <p className="product-card-detail">Производитель: {product.manufacturer}</p>
            <p className="product-card-detail">Гарантия: {product.warrantyMonths} мес.</p>
            <p className="product-card-detail">
              {product.stockQuantity > 0
                ? `В наличии: ${product.stockQuantity} шт.`
                : "Нет в наличии"}
            </p>
            {product.description && (
              <p className="modal-description">{product.description}</p>
            )}
            <button className="btn-primary" onClick={onAddToCart}>
              В корзину
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;