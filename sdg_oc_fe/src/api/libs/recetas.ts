
import { AxiosError } from 'axios';
import {http} from '../http';
import { ClienteRecetasCount } from '../entities/clientes';
import { EditedRecetaType, NewRecetaType, RecetasAereos } from '../entities/recetasAereos';
import { EditedRecetaContactoType, NewRecetaContactoType, RecetaContacto } from '../entities/recetasContacto';

const getAllGroupByCliente = async () => {
    try {
        const resp = await http.get('/cliente/recetas/count');
        const list = resp.data.data as ClienteRecetasCount[];
        return list.filter(c=> Number(c.clienteId)!==0)
    } catch (error) {
        throw error instanceof AxiosError ?  
            new Error(error?.response?.data?.message) : 
            new Error('Algo salió mal');
    }
};

const getOneAereos = async (_id: number)=>{
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
        return resp.data.data as RecetasAereos;
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

const createRecetaContacto = async (_newReceta: NewRecetaContactoType) => {
    try {
        const resp = await http.post('/receta-lentes-contacto', _newReceta);
        return resp.data.data as RecetaContacto;
    } catch (error) {
        console.log(error)
        throw error instanceof AxiosError ?  
            new Error(error?.response?.data?.message) : 
            new Error('Algo salió mal');
    }
};

const editRecetaContacto = async (_editedReceta: EditedRecetaContactoType) => {
    try {
        const resp = await http.put(`/receta-lentes-contacto/${_editedReceta.id}`, _editedReceta );
        return resp.data.data as RecetaContacto [];
    } catch (error) {
        throw error instanceof AxiosError ?  
            new Error(error?.response?.data?.message) : 
            new Error('Algo salió mal');
    }
};


const getOneContacto = async (_id: number)=>{
     try {
        const resp = await http.get(`/receta-lentes-contacto/${_id}`);
        const receta = resp.data.data as RecetaContacto;
        receta.fecha = new Date(receta.fecha)
        return receta
    } catch (error) {
        throw error instanceof AxiosError ?  
            new Error(error?.response?.data?.message) : 
            new Error('Algo salió mal');
    }
}


export const recetasApi ={
    getAllGroupByCliente: ()=> getAllGroupByCliente(),
    getOneAereos: (_id: number)=> getOneAereos(_id),
    getOneContacto: (_id: number)=> getOneContacto(_id),
    createRecetaAereos: (_newReceta: NewRecetaType)=> createRecetaAereos(_newReceta),
    createRecetaContacto: (_newReceta: NewRecetaContactoType)=> createRecetaContacto(_newReceta),
    editRecetaAereos: (_editedReceta: EditedRecetaType)=> editRecetaAereos(_editedReceta),
    editRecetaContacto: (_editedReceta: EditedRecetaContactoType)=> editRecetaContacto(_editedReceta),
}

