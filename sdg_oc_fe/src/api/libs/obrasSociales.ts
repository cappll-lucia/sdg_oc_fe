import { AxiosError } from 'axios';
import { ObraSocial } from '../entities/obraSocial';
import {http} from '../http';
import { CondicionIva } from '../entities/venta';
import { UUID } from 'crypto';

const getAll = async () => {
    try {
        const resp = await http.get('/obra-social');
        return resp.data.data as ObraSocial[];
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
};

const getOne = async (_id: number) => {
    try {
        const resp = await http.get(`/obra-social/${_id}`);
        return resp.data.data as ObraSocial;
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
};

const create = async(_obraSocial: {nombre: string} ) =>{
    try {
        const resp = await http.post('/obra-social', _obraSocial);
        return resp.data.data as ObraSocial[];
    } catch (error: any) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal al crear la obra social')
    }
}

const edit = async(_id: number, _obraSocial: {nombre: string} ) =>{
    try {
        const resp = await http.patch(`/obra-social/${_id}`, _obraSocial);
        return resp.data.data as ObraSocial[];
    } catch (error: any) {
        console.log(error)
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal al crear la obra social')
    }
}

const remove = async(_id: number ) =>{
    try {
        await http.delete(`/obra-social/${_id}`);
    } catch (error: any) {
        console.log(error)
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal al crear la obra social')
    }
}

const getReporteMontos = async (_fechaDesde: string | undefined, _fechaHasta: string | undefined) => {
    try {
        const params = new URLSearchParams();

        if (_fechaDesde) params.append("fechaDesde", _fechaDesde);
        if (_fechaHasta) params.append("fechaHasta", _fechaHasta);

        const url = `/os/reporte?${params.toString()}`
        console.log(url)
        const resp = await http.get(url);
        console.log(resp)
        return resp.data.data as {obraSocial: {id: number, nombre: string, condicionesIVA: {condicionIVA: CondicionIva, suma_importe: number, movimientos:{ventaId: UUID, fecha: Date, nombreCliente: string, apellidoCliente: string, importe: number, condicionIVA: CondicionIva}[]}[] } }[];
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
};


export const obrasSocialesApi = {
    getAll: ()=> getAll(),
    getOne: (_id: number)=> getOne(_id),
    create: (_obraSocial: {nombre: string})=> create(_obraSocial),
    edit: (_id: number, _obraSocial: {nombre: string})=> edit(_id, _obraSocial),
    remove: (_id: number)=> remove(_id),
    getReporteMontos: (_fechaDesde: string | undefined, _fechaHasta:string | undefined) => getReporteMontos(_fechaDesde, _fechaHasta)
}