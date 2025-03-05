import axios from 'axios';
import token from './token';

const baseURL = `${import.meta.env.VITE_API_URL}`;
export const http_files = axios.create({
	baseURL,
	headers: {
		'Content-type': 'multipart/form-data',
		Authorization: `Bearer ${token.get()}`,
	},
});