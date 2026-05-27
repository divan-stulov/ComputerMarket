import axios from "axios";
import { getToken } from "./authService";

const API_URL = "http://localhost:5170/api";

function authHeader() {
  return { Authorization: `Bearer ${getToken()}` };
}

export async function getProducts(filters?: {
  typeId?: number;
  manufacturerId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: string;
}) {
  const response = await axios.get(`${API_URL}/products`, { params: filters });
  return response.data;
}

export async function getMyProducts() {
  const response = await axios.get(`${API_URL}/products/my`, {
    headers: authHeader(),
  });
  return response.data;
}

export async function getProductById(id: number) {
  const response = await axios.get(`${API_URL}/products/${id}`);
  return response.data;
}

export async function createProduct(data: {
  inventoryNumber: string;
  name: string;
  description?: string;
  imageUrl?: string;
  typeId: number;
  manufacturerId: number;
  warrantyMonths: number;
  price: number;
  stockQuantity: number;
}) {
  const response = await axios.post(`${API_URL}/products`, data, {
    headers: authHeader(),
  });
  return response.data;
}

export async function updateProduct(
  id: number,
  data: {
    inventoryNumber?: string;
    name?: string;
    description?: string;
    imageUrl?: string;
    typeId?: number;
    manufacturerId?: number;
    warrantyMonths?: number;
    price?: number;
    stockQuantity?: number;
  }
) {
  const response = await axios.put(`${API_URL}/products/${id}`, data, {
    headers: authHeader(),
  });
  return response.data;
}

export async function deleteProduct(id: number) {
  await axios.delete(`${API_URL}/products/${id}`, {
    headers: authHeader(),
  });
}

export async function getProductTypes() {
  const response = await axios.get(`${API_URL}/product-types`);
  return response.data;
}

export async function getManufacturers() {
  const response = await axios.get(`${API_URL}/manufacturers`);
  return response.data;
}