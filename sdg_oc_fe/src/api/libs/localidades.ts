import { AxiosError } from 'axios';
import {http} from '../http';
import { Localidad } from '../entities/localidad';

const getAll = async () => {
    try {
        const resp = await http.get('/localidades');
        return resp.data.data as Localidad[];
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
};

const getOne = async (_id: number) => {
    try {
        const resp = await http.get(`/localidades/${_id}`);
        return resp.data.data as Localidad;
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
};

export const localidadesApi = {
    getAll: ()=> getAll(),
    getOne: (_id: number)=> getOne(_id),
}