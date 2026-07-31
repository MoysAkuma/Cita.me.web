import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProvider } from '../../services/ProviderService';

const weekDayIds = [0, 1, 2, 3, 4, 5, 6];

export const useOnboarding = (userId: string) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [providerId, setProviderId] = useState<string | null>(null);
    const navigate = useNavigate();

    const onboard = async (input: any) => {
        setLoading(true);
        setError(null);
        try {
            const restDays = Array.isArray(input?.dias_descanso) ? input.dias_descanso : [];
            const normalizedRestDays = restDays.map((day: number) => (day === 7 ? 0 : day));
            const horarios = weekDayIds
                .filter((day) => !normalizedRestDays.includes(day))
                .map((day) => ({
                    hora_apertura: input.hora_apertura,
                    hora_cierre: input.hora_cierre,
                    dia_semana: day,
                }));

            const payload = {
                ...input,
                horarios,
            };

            const response = await createProvider(userId, payload);
            const id = response?.id;

            setProviderId(id ?? null);
            setSuccess(true);

            if (id) {
                navigate(`/provider/${id}`);
                return;
            }

            navigate('/search');
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, success, providerId, onboard };
};
