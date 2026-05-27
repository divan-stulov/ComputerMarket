import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerSeller, loginUser } from "../services/authService";

interface Props {
  onLogin: () => void;
}

function RegisterSellerPage({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("individual");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await registerSeller(
        email,
        password,
        type,
        type === "individual" ? fullName : null,
        type === "organization" ? companyName : null,
        phone,
        address
      );
      await loginUser(email, password);
      onLogin();
      navigate("/profile");
    } catch {
      setError("Ошибка регистрации. Возможно, этот email уже занят");
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-title">Регистрация продавца</h2>

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

        <div className="form-field">
          <label>Тип продавца</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="individual">Физическое лицо</option>
            <option value="organization">Организация</option>
          </select>
        </div>

        {type === "individual" && (
          <div className="form-field">
            <label>Полное имя</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
        )}

        {type === "organization" && (
          <div className="form-field">
            <label>Название компании</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
        )}

        <div className="form-field">
          <label>Телефон</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Адрес</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary">
          Зарегистрироваться
        </button>

        <p className="auth-switch">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterSellerPage;