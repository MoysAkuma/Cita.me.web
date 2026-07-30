import { useState, useEffect } from 'react';
import { getProvider } from '../../services/ProviderService';
import { ProviderProfile } from '../../data/providers';

export const useGetProvider = (providerId: string) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [provider, setProvider] = useState<ProviderProfile | null>(null);

    useEffect(() => {
        if (!providerId) {
            setProvider(null);
            setSuccess(false);
            setError('Provider id is required');
            return;
        }

        const fetchProvider = async () => {
            setLoading(true);
            setError(null);
            setSuccess(false);
            try {
                const response = await getProvider(providerId);
                setProvider(response);
                setSuccess(true);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Error fetching provider';
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        void fetchProvider();
    }, [providerId]);

    return { loading, error, success, provider };
};