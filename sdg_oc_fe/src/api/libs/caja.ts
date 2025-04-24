import { AxiosError } from 'axios';
import {http} from '../http';
import { Caja, SaldoCaja } from '../entities/caja';


const getMovimientos = async(_fecha: string)=>{
    try {
        const resp = await http.get(`/caja/saldo?fecha=${_fecha}`);
        return resp.data.data as SaldoCaja;
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
}

const getApertura = async(_fecha: string)=>{
    try {
        const resp = await http.get(`/caja/apertura?fecha=${_fecha}`);
        return resp.data.data as Caja;
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
}

const getCierre = async(_fecha: string)=>{
    try {
        const resp = await http.get(`/caja/cierre?fecha=${_fecha}`);
        return resp.data.data as Caja;
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
}

const apertura = async(_importe: number)=>{
    try {
        const resp = await http.post('/caja/apertura', {
            detalle: 'Apertura de caja',
            importe: _importe
        });
        return resp.data.data as Caja;
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
}

const cierre = async()=>{
    try {
        const resp = await http.post('/caja/cierre');
        return resp.data.data as Caja;
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
}

const afectar = async(_movimientoCaja: {detalle:string, importe: number})=>{
    try {
        const resp = await http.post('/caja', _movimientoCaja);
        return resp.data.data as Caja;
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
}

export const cajaApi = {
    getMovimientos: (_fecha: string)=> getMovimientos(_fecha),
    getApertura: (_fecha: string)=> getApertura(_fecha),
    getCierre: (_fecha: string)=> getCierre(_fecha),
    apertura: (_importe: number)=> apertura(_importe),
    cierre: ()=> cierre(),
    afectar: (_movimientoCaja: {detalle: string, importe: number})=> afectar(_movimientoCaja)
}