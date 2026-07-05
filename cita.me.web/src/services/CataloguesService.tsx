import { api } from '../api/backendConfig';
import endpoints from '../config/endpoints.json';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    
const getCataloguesProveedores = async (): Promise<any> => {
  try {
    const response = await api.get(`${BASE_URL}${endpoints.categorias.proveedores}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Error fetching catalogues proveedores');
  }
};

const createCategoriaProveedor = async (categoriaData: any): Promise<any> => {
  try {
    const response = await api.post(`${BASE_URL}${endpoints.categorias.proveedores}`, categoriaData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Error creating categoria proveedor');
  }
};

const updateCategoriaProveedor = async (id: string, categoriaData: any): Promise<any> => {
  try {
    const response = await api.put(`${BASE_URL}${endpoints.categorias.proveedores}/${id}`, categoriaData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Error updating categoria proveedor');
  }
};

const deleteCategoriaProveedor = async (id: string): Promise<any> => {
  try {
    const response = await api.delete(`${BASE_URL}${endpoints.categorias.proveedores}/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Error deleting categoria proveedor');
  }
};

export const CataloguesService = {
  getCataloguesProveedores,
  createCategoriaProveedor,
  updateCategoriaProveedor,
  deleteCategoriaProveedor,
};