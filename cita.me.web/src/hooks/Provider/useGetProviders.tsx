import {useState, useEffect, useCallback, useRef} from 'react';
import {getProviders} from '../../services/ProviderService';
import {FiltersFetch, ProviderProfile} from '../../data/providers';

export const useGetProviders = (page: number, limit: number, filters: FiltersFetch) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [providers, setProviders] = useState<ProviderProfile[]>([]);

    const initialFiltersRef = useRef<FiltersFetch>(filters);

    const refetchProviders = useCallback(async (nextFilters?: FiltersFetch) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const appliedFilters = nextFilters ?? initialFiltersRef.current;
            const data = await getProviders(page, limit, appliedFilters);
            setProviders(data);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Error fetching providers');
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    useEffect(() => {
        void refetchProviders();
    }, [refetchProviders]);

    return { loading, error, success, providers, refetchProviders };
};