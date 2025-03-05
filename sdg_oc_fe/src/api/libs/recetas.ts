
import { AxiosError } from 'axios';
import {http} from '../http';
import { ClienteRecetasCount } from '../entities/clientes';

const getAllGroupByCliente = async () => {
    try {
        const resp = await http.get('/cliente/recetas/count');
        return resp.data.data as ClienteRecetasCount[];
    } catch (error) {
        throw error instanceof AxiosError ?  
            new Error(error?.response?.data?.message) : 
            new Error('Algo salió mal');
    }
};


export const recetasApi ={
    getAllGroupByCliente: ()=> getAllGroupByCliente()
}