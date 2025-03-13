
import { AxiosError } from 'axios';
import {http} from '../http';
import { ClienteRecetasCount } from '../entities/clientes';
import { NewRecetaType, RecetasAereos } from '../entities/recetasAereos';

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

const createRecetaAereos = async (_newReceta: NewRecetaType) => {
    try {
        console.log('okkkk')
        const resp = await http.post('/receta-lentes-aereos', _newReceta);
        return resp.data.data as RecetasAereos[];
    } catch (error) {
        throw error instanceof AxiosError ?  
            new Error(error?.response?.data?.message) : 
            new Error('Algo salió mal');
    }
};


export const recetasApi ={
    getAllGroupByCliente: ()=> getAllGroupByCliente(),
    createRecetaAereos: (_newReceta: NewRecetaType)=> createRecetaAereos(_newReceta),
}