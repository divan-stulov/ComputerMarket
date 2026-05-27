import { useNavigate } from "react-router-dom";
import { getUserRole, getUserEmail, logout } from "../services/authService";
import SellerProfile from "../components/SellerProfile";
import BuyerProfile from "../components/BuyerProfile";

function ProfilePage() {
  const role = getUserRole();
  const email = getUserEmail();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="profile-page">
      <div className="profile-topbar">
        <h2 className="profile-title">Профиль</h2>
        <div style={{ display: "flex", gap: "8px" }}>
            <button className="btn-secondary" onClick={() => navigate("/catalog")}>
            Каталог
            </button>
            <button className="btn-logout" onClick={handleLogout}>
            Выйти
            </button>
        </div>
      </div>

      {role === "seller" && <SellerProfile email={email ?? ""} />}
      {role === "buyer" && <BuyerProfile email={email ?? ""} />}
    </div>
  );
}

export default ProfilePage;