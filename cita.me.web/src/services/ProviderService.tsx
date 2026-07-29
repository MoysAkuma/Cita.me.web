import {api} from '../api/backendConfig';
import endpoints from '../config/endpoints.json';
import { ProviderProfile } from '../data/providers';

const getProviders = async (): Promise<ProviderProfile[]> => {
    const response = await api.get(endpoints.proveedor.base);
    return response.data;
};

const getProvider = async (providerId: string): Promise<ProviderProfile> => {
    const response = await api.get(`${endpoints.proveedor.base}/${providerId}`);
    return response.data;
};

export { getProviders, getProvider };