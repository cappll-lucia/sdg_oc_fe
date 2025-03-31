import { AxiosError } from 'axios';
import {http} from '../http';
import { Comprobante } from '../entities/comprobante';

interface ComprobanteFilters{
    nombreCliente?: string;
    nroDocumento?: string;
    fechaDesde?: string;
    fechaHasta?: string;
    tipoFactura?: string;
    tipoComprobante?: string;
    limit?: number | string;
    offset?: number | string;
}

const getAll = async (filters: ComprobanteFilters) => {
    try {
        const params = new URLSearchParams();

        if (filters.nombreCliente) params.append("nombreCliente", filters.nombreCliente)
        if (filters.nroDocumento) params.append("nroDocumento", filters.nroDocumento)
        if (filters.fechaDesde) params.append("fechaDesde", filters.fechaDesde)
        if (filters.fechaHasta) params.append("fechaHasta", filters.fechaHasta)
        if (filters.tipoComprobante) params.append("tipoComprobante", filters.tipoComprobante)

        params.append("limit", filters.limit?.toString() || "10");
        params.append("offset", filters.offset?.toString() || "0");
        
        const url = `/comprobante?${params.toString()}`;
        const resp = await http.get(url);
        return resp.data.data.items as Comprobante[];
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
};

const getAllByCliente = async (_nroDoc: number) => {
    try {
        const resp = await http.get(`/comprobante?nroDocumento=${_nroDoc}`);
        return resp.data.data.items as Comprobante[];
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
};

const getFacturasByCliente = async (_nroDoc: number) => {
    try {
        const resp = await http.get(`/comprobante/facturas?nroDocumento=${_nroDoc}`);
        return resp.data.data.items as Comprobante[];
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
};

const getComprobantesByVenta = async(_ventaId: string)=>{
    try {
        console.log('---', _ventaId)
        const resp = await http.get(`/comprobante/venta/${_ventaId}`);
        return resp.data.data.items as Comprobante[];
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
}

const getOne = async(_id: string)=>{
    try {
        const resp = await http.get(`/comprobante/${_id}`); 
        return resp.data.data as Comprobante;
    } catch (error) {
        console.log(error)
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
}

    const print = async(_id: string)=>{
        try {
            console.log(_id)
            const resp = await http.post(`/comprobante/imprimir`, {
                id: _id
            }); 
            console.log(resp)
            return resp;
        } catch (error) {
            console.log(error)
            throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
        }
    }

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
    getAll: (filters: ComprobanteFilters)=> getAll(filters),
    getAllByCliente: (_nroDoc: number)=> getAllByCliente(_nroDoc),
    getOne: (_id: string)=> getOne(_id),
    print: (_id: string)=> print(_id),
    getFacturasByCliente: (_nroDoc: number)=> getFacturasByCliente(_nroDoc),
    getComprobantesByVenta: (_ventaId: string)=> getComprobantesByVenta(_ventaId),
    create: (_comprobante: any)=> create(_comprobante),
}