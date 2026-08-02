import {useState, useEffect, useCallback, useRef} from 'react';
import {getProviders} from '../../services/ProviderService';
import {FiltersFetch, ProviderProfile} from '../../data/providers';
import { useAsyncStatus } from '../common/useAsyncStatus';

export const useGetProviders = (page: number, limit: number, filters: FiltersFetch) => {
    const { loading, error, success, start, succeed, fail, finish } = useAsyncStatus();
    const [providers, setProviders] = useState<ProviderProfile[]>([]);

    const initialFiltersRef = useRef<FiltersFetch>(filters);

    const refetchProviders = useCallback(async (nextFilters?: FiltersFetch) => {
        start();
        try {
            const appliedFilters = nextFilters ?? initialFiltersRef.current;
            const data = await getProviders(page, limit, appliedFilters);
            setProviders(data);
            succeed();
        } catch (err: unknown) {
            fail(err, 'Error fetching providers');
        } finally {
            finish();
        }
    }, [page, limit, start, succeed, fail, finish]);

    useEffect(() => {
        void refetchProviders();
    }, [refetchProviders]);

    return { loading, error, success, providers, refetchProviders };
};