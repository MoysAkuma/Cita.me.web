import { useState } from 'react';
import { getCataloguesProveedores } from "../../services/CataloguesService"

export const useCatProveedores = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [proveedores, setProveedores] = useState<any>(null);

    const getProveedores = async() => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        setProveedores(null);
        try {
            const response = await getCataloguesProveedores();
            setProveedores(response);
            setSuccess(true);
            setLoading(false);
            return response; // Retornar los datos directamente
        } catch (err: any) {
            setError(err.message || 'Error fetching catalogues');
            setLoading(false);
            throw err; // Re-lanzar el error para que se pueda manejar externamente
        }
    };
    return { loading, error, success, proveedores, getProveedores };
};