import { useState, useEffect } from 'react';
import { getProvider } from "../../services/ProviderService"

export const useGetProvider = (providerId: string) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [provider, setProvider] = useState<any>(null);
    useEffect(() => {
        const fetchProvider = async () => {
            setLoading(true);
            setError(null);
            setSuccess(false);
            try {
                const response = await getProvider(providerId);
                setProvider(response);
                setSuccess(true);
            } catch (err : any) {
                setError(err.message || 'Error fetching provider');
            } finally {
                setLoading(false);
            }
        };

        fetchProvider();
    }, [providerId]);

    return { loading, error, success, provider };
};