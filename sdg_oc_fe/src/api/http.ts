import axios from 'axios';
import token from './token';

const baseURL = `${import.meta.env.VITE_API_URL}`;

export const http = axios.create({
	baseURL,
	headers: {
		'Content-Type': 'application/json',
	},
});

http.interceptors.request.use((config) => {
	const t = token.get();
	if (t) {
		config.headers.Authorization = `Bearer ${t}`;
	}
	return config;
});

http.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response?.status === 401) {
			token.delete();
			window.location.href = '/login';
		}
		return Promise.reject(error);
	}
);