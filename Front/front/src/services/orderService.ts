import axios from "axios";
import { getToken } from "./authService";

const API_URL = "http://localhost:5170/api";

function authHeader() {
  return { Authorization: `Bearer ${getToken()}` };
}

export async function getMyOrders() {
  const response = await axios.get(`${API_URL}/orders/my`, {
    headers: authHeader(),
  });
  return response.data;
}

export async function createOrder(
  items: { productId: number; quantity: number }[]
) {
  const response = await axios.post(`${API_URL}/orders`, items, {
    headers: authHeader(),
  });
  return response.data;
}

export async function cancelOrder(id: number) {
  await axios.delete(`${API_URL}/orders/${id}`, {
    headers: authHeader(),
  });
}

export async function updateOrderStatus(id: number) {
  const response = await axios.patch(`${API_URL}/orders/${id}/status`, null, {
    headers: authHeader(),
  });
  return response.data;
}