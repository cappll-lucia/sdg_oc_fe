import axios from 'axios';
import token from './token';
import { useUserStore } from '@/stores/UsersStore';

const baseURL = `${import.meta.env.VITE_API_URL}`;

export const http = axios.create({
	baseURL,
	headers: {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token.get()}`
	},
});

http.interceptors.response.use(
	response => response,
	async (error) => {
		if(error.response && error.response.status===401){
			try{

				const userStore = useUserStore();
				await userStore.signOut();
			}catch (logoutError) {
        		console.error(logoutError);
      		}
    	}
    	return Promise.reject(error);
	}
)