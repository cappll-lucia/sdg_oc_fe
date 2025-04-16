import { AxiosError } from 'axios';
import { Marca } from '../entities/marca';
import {http} from '../http';

const getAll = async () => {
	try {
		const resp = await http.get('/marca');
		return resp.data.data as Marca[];
	} catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
	}
};

const getOne = async (_id: number) => {
	try {
		const resp = await http.get(`/marca/${_id}`);
		return resp.data.data as Marca;
	} catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
	}
};

const create = async(_marca: {nombre: string} ) =>{
    try {
		const resp = await http.post('/marca', _marca);
		return resp.data.data as Marca;
	} catch (error: any) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal al crear la marca')
	}
}

const edit = async(_id: number, _marca: {nombre: string} ) =>{
    try {
		const resp = await http.patch(`/marca/${_id}`, _marca);
		return resp.data.data as Marca;
	} catch (error: any) {
        console.log(error)
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal al crear la marca')
	}
}

const remove = async(_id: number ) =>{
    try {
		await http.delete(`/marca/${_id}`);
	} catch (error: any) {
        console.log(error)
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal al crear la marca')
	}
}

export const marcasApi = {
    getAll: ()=> getAll(),
    getOne: (_id: number)=> getOne(_id),
    create: (_marca: {nombre: string})=> create(_marca),
    edit: (_id: number, _marca: {nombre: string} )=> edit(_id, _marca),
    remove: (_id: number)=> remove(_id),
}