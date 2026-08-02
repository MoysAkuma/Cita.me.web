import { useState } from 'react';
import { getCataloguesProveedores } from "../../services/CataloguesService"
import { useAsyncStatus } from '../common/useAsyncStatus';

export const useCatProveedores = () => {
    const { loading, error, success, start, succeed, fail, finish } = useAsyncStatus();
    const [proveedores, setProveedores] = useState<any>(null);

    const getProveedores = async() => {
        start();
        setProveedores(null);
        try {
            const response = await getCataloguesProveedores();
            setProveedores(response);
            succeed();
            return response; // Retornar los datos directamente
        } catch (err: unknown) {
            fail(err, 'Error fetching catalogues');
            throw err; // Re-lanzar el error para que se pueda manejar externamente
        } finally {
            finish();
        }
    };
    return { loading, error, success, proveedores, getProveedores };
};