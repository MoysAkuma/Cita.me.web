import {api} from '../api/backendConfig';
import endpoints from '../config/endpoints.json';
import { ProviderProfile, FiltersFetch, OnboardingForm } from '../data/providers';

const getProviders = async ( page:number, limit : number, filters: FiltersFetch ): Promise<ProviderProfile[]> => {
    const response = await api.get(endpoints.proveedor.base, { params: { page, limit, ...filters } });
    return response.data.data;
};

const getProvider = async (providerId: string): Promise<ProviderProfile> => {
    const response = await api.get(`${endpoints.proveedor.base}/${providerId}`);
    return response.data.data;
};

const createProvider = async (userId: string, input: OnboardingForm): Promise<{ id: string }> => {
    const response = await api.post(`${endpoints.proveedor.onboarding}`, { userId, ...input });
    return response.data.data;
};

export { getProviders, getProvider, createProvider };