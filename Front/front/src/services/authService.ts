import axios from "axios";

const API_URL = "http://localhost:5170/api";

export async function loginUser(email: string, password: string) {
  const response = await axios.post(`${API_URL}/authentication/login`, {
    email,
    password,
  });
  const token = response.data.token;
  localStorage.setItem("token", token);
  localStorage.setItem("cart", JSON.stringify([]));
}

export async function registerBuyer(
  email: string,
  password: string,
  fullName: string,
  phone: string
) {
  await axios.post(`${API_URL}/authentication/register/buyer`, {
    email,
    password,
    fullName,
    phone,
  });
}

export async function registerSeller(
  email: string,
  password: string,
  type: string,
  fullName: string | null,
  companyName: string | null,
  phone: string,
  address: string
) {
  await axios.post(`${API_URL}/authentication/register/seller`, {
    email,
    password,
    type,
    fullName,
    companyName,
    phone,
    address,
  });
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.setItem("cart", JSON.stringify([]));
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

export function getUserRole(): string | null {
  const token = getToken();
  if (!token) return null;
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ?? null;
}

export function getUserEmail(): string | null {
  const token = getToken();
  if (!token) return null;
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ?? null;
}

export async function getBuyerProfile() {
  const response = await axios.get(`${API_URL}/authentication/profile/buyer`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
}

export async function getSellerProfile() {
  const response = await axios.get(`${API_URL}/authentication/profile/seller`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
}

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/unauthorized";
    }
    return Promise.reject(error);
  }
);