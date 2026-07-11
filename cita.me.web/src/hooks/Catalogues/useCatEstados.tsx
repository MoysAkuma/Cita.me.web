import {useState} from 'react';
import {getCataloguesEstados} from "../../services/CataloguesService"

export const useCatEstados = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [estados, setEstados] = useState<any>(null);

    const getEstados = async() => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        setEstados(null);
        try {
            const response = await getCataloguesEstados();
            setEstados(response);
            setSuccess(true);
            setLoading(false);
            return response; // Retornar los datos directamente
        } catch (err: any) {
            setError(err.message || 'Error fetching catalogues');
            setLoading(false);
            throw err; // Re-lanzar el error para que se pueda manejar externamente
        }
    };
    return { loading, error, success, estados, getEstados };
};