import { AxiosError } from 'axios';
import {http} from '../http';
import { NewVentaType, Venta } from '../entities/venta';
import { Comprobante } from '../entities/comprobante';

interface VentaFilters{
    nombreCliente?: string | undefined;
    nroDocumento?: string | undefined;
    fechaDesde?: string | undefined;
    fechaHasta?: string | undefined;
    tipoComprobante?: string | undefined;
    limit?: number | string;
    offset?: number | string;
}



const getAll = async (filter: VentaFilters) => {
    try {
        const params = new URLSearchParams();

        if(filter.nombreCliente) params.append("nombreCliente", filter.nombreCliente);
        if(filter.nroDocumento) params.append("nroDocumento", filter.nroDocumento);
        if(filter.fechaDesde) params.append("fechaDesde", filter.fechaDesde);
        if(filter.fechaHasta) params.append("fechaHasta", filter.fechaHasta);
        if(filter.tipoComprobante) params.append("tipoComprobante", filter.tipoComprobante);

        params.append("limit", filter.limit?.toString() || "10");
        params.append("offset", filter.offset?.toString() || "0");

        const url = `/venta?${params.toString()}`;
        const resp = await http.get(url);

        return resp.data.data as {items: Venta[],  nextPage: number|null, previousPage: number|null};
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
        return resp.data.data as {venta: Venta, comprobantesRelacionados: Comprobante[]};
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
};


const create = async(_venta: NewVentaType ) =>{
    try {
        const resp = await http.post('/venta', _venta);
        return resp.data.data as {venta: Venta, factura: Comprobante};
    } catch (error: any) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal al crear la obra social')
    }
}


export const ventasApi = {
    getAll: (filter: VentaFilters)=> getAll(filter),
    getAllByCliente: (_idCliente: number)=> getAllByCliente(_idCliente),
    getOne: (_id: string)=> getOne(_id),
    create: (_venta: NewVentaType)=> create(_venta),
}