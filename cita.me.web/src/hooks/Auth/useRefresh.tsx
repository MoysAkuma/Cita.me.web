import { useState } from 'react';
import { refreshToken } from '../../services/AuthService';

export const useRefresh = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const refresh = async (tokenData: any) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await refreshToken(tokenData);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Error refreshing token');
        }
        setLoading(false);
    }
    return { loading, error, success, refresh };
};