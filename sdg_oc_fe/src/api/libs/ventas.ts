import { AxiosError } from 'axios';
import {http} from '../http';
import { CreateVentaValidator, Venta } from '../entities/venta';

const getAll = async () => {
    try {
        const resp = await http.get('/venta');
        return resp.data.data as Venta[];
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
};


const create = async(_venta: CreateVentaValidator ) =>{
    try {
        const resp = await http.post('/venta', _venta);
        return resp.data.data as Venta[];
    } catch (error: any) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal al crear la obra social')
    }
}


export const ventasApi = {
    getAll: ()=> getAll(),
    create: (_venta: CreateVentaValidator)=> create(_venta),
}