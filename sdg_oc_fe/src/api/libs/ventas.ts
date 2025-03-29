import { AxiosError } from 'axios';
import {http} from '../http';
import { NewVentaType, Venta } from '../entities/venta';

const getAll = async () => {
    try {
        const resp = await http.get('/venta');
        console.log(resp)
        return resp.data.data.items as Venta[];
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
};

const getAllByCliente = async (_idCliente: number) => {
    try {
        const resp = await http.get(`/venta/${_idCliente}`);
        return resp.data.data as Venta[];
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
};

const getOne = async (_id: string) => {
    try {
        const resp = await http.get(`/venta/${_id}`);
        return resp.data.data as Venta;
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
};


const create = async(_venta: NewVentaType ) =>{
    try {
        console.log(_venta)
        const resp = await http.post('/venta', _venta);
        console.log(resp)
        return resp.data.data as Venta[];
    } catch (error: any) {
        console.log(error)
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal al crear la obra social')
    }
}


export const ventasApi = {
    getAll: ()=> getAll(),
    getAllByCliente: (_idCliente: number)=> getAllByCliente(_idCliente),
    getOne: (_id: string)=> getOne(_id),
    create: (_venta: NewVentaType)=> create(_venta),
}