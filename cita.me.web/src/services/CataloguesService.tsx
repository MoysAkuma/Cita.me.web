import { api } from '../api/backendConfig';
import endpoints from '../config/endpoints.json';
    
const getCataloguesProveedores = async (): Promise<any> => {
  try {
    const response = await api.get(endpoints.categorias.proveedores);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Error fetching catalogues proveedores');
  }
};

const createCategoriaProveedor = async (categoriaData: any): Promise<any> => {
  try {
    const response = await api.post(endpoints.categorias.proveedores, categoriaData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Error creating categoria proveedor');
  }
};

const updateCategoriaProveedor = async (id: string, categoriaData: any): Promise<any> => {
  try {
    const response = await api.put(`${endpoints.categorias.proveedores}/${id}`, categoriaData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Error updating categoria proveedor');
  }
};

const deleteCategoriaProveedor = async (id: string): Promise<any> => {
  try {
    const response = await api.delete(`${endpoints.categorias.proveedores}/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Error deleting categoria proveedor');
  }
};

const getCataloguesEstados = async (): Promise<any> => {
  try {
    const response = await api.get(endpoints.categorias.estados);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Error fetching catalogues estados');
  }
};

const createCategoriaEstado = async (estadoData: any): Promise<any> => {
  try {
    const response = await api.post(endpoints.categorias.estados, estadoData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Error creating categoria estado');
  }
};

const updateCategoriaEstado = async (id: string, estadoData: any): Promise<any> => {
  try {
    const response = await api.put(`${endpoints.categorias.estados}/${id}`, estadoData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Error updating categoria estado');
  }
};

const getCataloguesCiudades = async (): Promise<any> => {
  try {
    const response = await api.get(endpoints.categorias.ciudades);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Error fetching catalogues ciudades');
  }
};

const createCategoriaCiudad = async (ciudadData: any): Promise<any> => {
  try {
    const response = await api.post(endpoints.categorias.ciudades, ciudadData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Error creating categoria ciudad');
  }
};

const updateCategoriaCiudad = async (id: string, ciudadData: any): Promise<any> => {
  try {
    const response = await api.put(`${endpoints.categorias.ciudades}/${id}`, ciudadData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Error updating categoria ciudad');
  }
};

export {
  getCataloguesProveedores,
  createCategoriaProveedor,
  updateCategoriaProveedor,
  deleteCategoriaProveedor,
  getCataloguesEstados,
  createCategoriaEstado,
  updateCategoriaEstado,
  getCataloguesCiudades,
  createCategoriaCiudad,
  updateCategoriaCiudad,
};