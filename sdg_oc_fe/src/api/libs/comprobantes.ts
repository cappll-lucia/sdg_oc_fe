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

        return resp.data.data as {items: Comprobante[],  nextPage: number|null, previousPage: number|null};
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
};

const getAllByCliente = async (_nroDoc: number) => {
    try {
        const resp = await http.get(`/comprobante/cliente/${_nroDoc}`);
        return resp.data.data as Comprobante[];
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
};

const getFacturasByCliente = async (_id: number) => {
    try {
        const resp = await http.get(`/comprobante/facturas?nroDocumento=${_id}`);
        return resp.data.data.items as Comprobante[];
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
};

const getComprobantesByVenta = async(_ventaId: string)=>{
    try {
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
        const resp = await http.post(
            `/comprobante/imprimir`, 
            { id: _id},
            {responseType: 'arraybuffer'}
        ); 
        return resp;
    } catch (error) {
        console.log(error)
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
}

const email = async(_id: string)=>{
    try {
        const resp = await http.post(`/comprobante/email`, {
            comprobante: {
                id: _id
            }
        }); 
        return resp;
    } catch (error) {
        console.log(error)
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
}

const create = async(_comprobante: any ) =>{
    try {
        const resp = await http.post('/comprobante', _comprobante);
        const comprobante = resp.data.data as Comprobante;
        comprobante.fechaEmision = new Date(comprobante.fechaEmision)
        return comprobante
    } catch (error: any) {
        console.log(error)
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal al crear la obra social')
    }
}

const facturarPendientes = async() =>{
    try {
        const resp = await http.post('/comprobante/facturarPendientes');
        console.log(resp)
        // const comprobante = resp.data.data as Comprobante;
        // comprobante.fechaEmision = new Date(comprobante.fechaEmision)
        //return comprobante
    } catch (error: any) {
        console.log(error)
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal al crear la obra social')
    }
}


export const comprobantesApi = {
    getAll: (filters: ComprobanteFilters)=> getAll(filters),
    getAllByCliente: (_id: number)=> getAllByCliente(_id),
    getOne: (_id: string)=> getOne(_id),
    print: (_id: string)=> print(_id),
    email: (_id: string)=> email(_id),
    getFacturasByCliente: (_nroDoc: number)=> getFacturasByCliente(_nroDoc),
    getComprobantesByVenta: (_ventaId: string)=> getComprobantesByVenta(_ventaId),
    create: (_comprobante: any)=> create(_comprobante),
    facturarPendientes: ()=> facturarPendientes()
}