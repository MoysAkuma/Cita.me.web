import {useState} from 'react';
import {getCataloguesCiudades} from "../../services/CataloguesService"
import { useAsyncStatus } from '../common/useAsyncStatus';

export const useCatCiudad = () => {
	const { loading, error, success, start, succeed, fail, finish } = useAsyncStatus();
	const [ciudades, setCiudades] = useState<any>(null);

	const getCiudades = async() => {
		start();
		setCiudades(null);
		try {
			const response = await getCataloguesCiudades();
			setCiudades(response);
			succeed();
			return response;
		} catch (err: unknown) {
			fail(err, 'Error fetching catalogues');
			throw err;
		} finally {
			finish();
		}
	};
	return { loading, error, success, ciudades, getCiudades };
};