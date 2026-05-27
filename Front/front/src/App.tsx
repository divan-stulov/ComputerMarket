import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterBuyerPage from "./pages/RegisterBuyerPage";
import RegisterSellerPage from "./pages/RegisterSellerPage";
import ProfilePage from "./pages/ProfilePage";
import CatalogPage from "./pages/CatalogPage";
import NotFoundPage from "./pages/NotFoundPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import CheckoutPage from "./pages/CheckoutPage";
import CheckoutSuccessPage from "./pages/CheckoutSuccessPage";
import { isAuthenticated } from "./services/authService";

function App() {
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={() => setLoggedIn(true)} />} />
        <Route path="/register/buyer" element={<RegisterBuyerPage onLogin={() => setLoggedIn(true)} />} />
        <Route path="/register/seller" element={<RegisterSellerPage onLogin={() => setLoggedIn(true)} />} />
        <Route
          path="/profile"
          element={loggedIn ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;