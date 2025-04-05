import { AxiosError } from 'axios';
import {http} from '../http';
import { CuentaCorriente } from '../entities/cuentaCorriente';
import { NewMovimientoType } from '../entities/movimiento';



const getOneByCliente = async (_idCliente: number) => {
    try {
        const resp = await http.get(`/cuenta-corriente/cliente/${_idCliente}`);
        return resp.data.data as CuentaCorriente;
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
};


const updateSaldo = async(_idCliente: number, _newMovimeinto: NewMovimientoType ) =>{
        try {
        const resp = await http.patch(`/cuenta-corriente/cliente/${_idCliente}`, _newMovimeinto);
        return resp.data.data as CuentaCorriente;
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
}



export const cuentaCorrienteApi = {
    getOneByCliente: (_id: number)=> getOneByCliente(_id),
    updateSaldo: (_id: number, _newMovimeinto: NewMovimientoType )=> updateSaldo(_id, _newMovimeinto),
}