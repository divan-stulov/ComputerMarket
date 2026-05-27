import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";

interface Props {
  onLogin: () => void;
}

function LoginPage({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await loginUser(email, password);
      onLogin();
      navigate("/profile");
    } catch {
      setError("Неверный email или пароль");
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-title">Вход</h2>

        {error && <p className="auth-error">{error}</p>}

        <div className="form-field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary">
          Войти
        </button>

        <p className="auth-switch">
          Нет аккаунта?{" "}
          <Link to="/register/buyer">Покупатель</Link>
          {" / "}
          <Link to="/register/seller">Продавец</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;