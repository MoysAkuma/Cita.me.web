import {useState} from 'react';
import {getCataloguesEstados} from "../../services/CataloguesService"
import { useAsyncStatus } from '../common/useAsyncStatus';

export const useCatEstados = () => {
    const { loading, error, success, start, succeed, fail, finish } = useAsyncStatus();
    const [estados, setEstados] = useState<any>(null);

    const getEstados = async() => {
        start();
        setEstados(null);
        try {
            const response = await getCataloguesEstados();
            setEstados(response);
            succeed();
            return response; // Retornar los datos directamente
        } catch (err: unknown) {
            fail(err, 'Error fetching catalogues');
            throw err; // Re-lanzar el error para que se pueda manejar externamente
        } finally {
            finish();
        }
    };
    return { loading, error, success, estados, getEstados };
};