
import { AxiosError } from 'axios';
import {http} from '../http';
import { ClienteRecetasCount } from '../entities/clientes';
import { EditedRecetaType, NewRecetaType, RecetasAereos } from '../entities/recetasAereos';

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

const getOneRecetados = async (_id: number)=>{
     try {
        const resp = await http.get(`/receta-lentes-aereos/${_id}`);
        const receta = resp.data.data as RecetasAereos;
        receta.fecha = new Date(receta.fecha)
        return receta
    } catch (error) {
        throw error instanceof AxiosError ?  
            new Error(error?.response?.data?.message) : 
            new Error('Algo salió mal');
    }
}


const createRecetaAereos = async (_newReceta: NewRecetaType) => {
    try {
        const resp = await http.post('/receta-lentes-aereos', _newReceta);
        return resp.data.data as RecetasAereos[];
    } catch (error) {
        throw error instanceof AxiosError ?  
            new Error(error?.response?.data?.message) : 
            new Error('Algo salió mal');
    }
};

const editRecetaAereos = async (_editedReceta: EditedRecetaType) => {
    try {
        const resp = await http.put(`/receta-lentes-aereos/${_editedReceta.id}`, _editedReceta );
        return resp.data.data as RecetasAereos[];
    } catch (error) {
        throw error instanceof AxiosError ?  
            new Error(error?.response?.data?.message) : 
            new Error('Algo salió mal');
    }
};


export const recetasApi ={
    getAllGroupByCliente: ()=> getAllGroupByCliente(),
    getOneRecetados: (_id: number)=> getOneRecetados(_id),
    createRecetaAereos: (_newReceta: NewRecetaType)=> createRecetaAereos(_newReceta),
    editRecetaAereosRecetaAereos: (_newReceta: EditedRecetaType)=> editRecetaAereos(_newReceta),
}