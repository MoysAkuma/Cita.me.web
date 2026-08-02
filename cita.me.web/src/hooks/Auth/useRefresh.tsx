import { refreshToken } from '../../services/AuthService';
import { useAsyncStatus } from '../common/useAsyncStatus';

export const useRefresh = () => {
    const { loading, error, success, start, succeed, fail, finish } = useAsyncStatus();

    const refresh = async (tokenData: any) => {
        start();
        try {
            await refreshToken(tokenData);
            succeed();
        } catch (err: unknown) {
            fail(err, 'Error refreshing token');
        } finally {
            finish();
        }
    }
    return { loading, error, success, refresh };
};