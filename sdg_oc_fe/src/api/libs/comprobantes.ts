import { AxiosError } from 'axios';
import {http} from '../http';
import { Comprobante } from '../entities/comprobante';

const getAllByCliente = async (_idCliente: number) => {
    try {
        const resp = await http.get(`/comprobantes/${_idCliente}`);
        return resp.data.data as Comprobante[];
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
};

const getFacturasByCliente = async (_idCliente: number) => {
    try {
        const resp = await http.get(`/comprobante/cliente/${_idCliente}`);
        const facturas = resp.data.data as Comprobante[];
        return facturas.filter(c=> [1, 6, 11, 51].includes(c.tipoComprobante))
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
};

const create = async(_comprobante: any ) =>{
    try {
        console.log(_comprobante)
        const resp = await http.post('/comprobante', _comprobante);
        console.log(resp)
        return resp.data.data as Comprobante;
    } catch (error: any) {
        console.log(error)
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal al crear la obra social')
    }
}


export const comprobantesApi = {
    // getAll: ()=> getAll(),
    getAllByCliente: (_idCliente: number)=> getAllByCliente(_idCliente),
    getFacturasByCliente: (_idCliente: number)=> getFacturasByCliente(_idCliente),
    create: (_comprobante: any)=> create(_comprobante),
}