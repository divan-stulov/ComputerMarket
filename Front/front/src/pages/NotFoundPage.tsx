import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <h1 className="error-code">404</h1>
      <p className="error-message">Страница не найдена</p>
      <button className="btn-primary" onClick={() => navigate("/catalog")}>
        Вернуться в каталог
      </button>
    </div>
  );
}

export default NotFoundPage;