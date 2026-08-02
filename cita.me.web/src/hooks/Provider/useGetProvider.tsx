import { useState, useEffect } from 'react';
import { getProvider } from '../../services/ProviderService';
import { ProviderProfile } from '../../data/providers';
import { useAsyncStatus } from '../common/useAsyncStatus';

export const useGetProvider = (providerId: string) => {
    const { loading, error, success, start, succeed, fail, finish, reset } = useAsyncStatus();
    const [provider, setProvider] = useState<ProviderProfile | null>(null);

    useEffect(() => {
        if (!providerId) {
            setProvider(null);
            reset();
            fail('Provider id is required', 'Provider id is required');
            return;
        }

        const fetchProvider = async () => {
            start();
            try {
                const response = await getProvider(providerId);
                setProvider(response);
                succeed();
            } catch (err: unknown) {
                fail(err, 'Error fetching provider');
            } finally {
                finish();
            }
        };

        void fetchProvider();
    }, [providerId, start, succeed, fail, finish, reset]);

    return { loading, error, success, provider };
};