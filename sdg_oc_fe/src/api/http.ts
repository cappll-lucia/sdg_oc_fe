import axios from 'axios';
import token from './token';

const baseURL = `${import.meta.env.VITE_API_URL}`;

export const http = axios.create({
	baseURL,
	headers: {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token.get()}`
	},
});