import {useState} from 'react';
import {getCataloguesCiudades} from "../../services/CataloguesService"

export const useCatCiudad = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [ciudades, setCiudades] = useState<any>(null);

	const getCiudades = async() => {
		setLoading(true);
		setError(null);
		setSuccess(false);
		setCiudades(null);
		try {
			const response = await getCataloguesCiudades();
			setCiudades(response);
			setSuccess(true);
			setLoading(false);
			return response;
		} catch (err: any) {
			setError(err.message || 'Error fetching catalogues');
			setLoading(false);
			throw err;
		}
	};
	return { loading, error, success, ciudades, getCiudades };
};