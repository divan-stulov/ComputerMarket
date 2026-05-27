import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

function UnauthorizedPage() {
  const navigate = useNavigate();

  function handleLogin() {
    logout();
    navigate("/login");
  }

  return (
    <div className="error-page">
      <h1 className="error-code">401</h1>
      <p className="error-message">Сессия истекла</p>
      <p className="error-hint">Пожалуйста, войдите снова</p>
      <button className="btn-primary" onClick={handleLogin}>
        Войти
      </button>
    </div>
  );
}

export default UnauthorizedPage;