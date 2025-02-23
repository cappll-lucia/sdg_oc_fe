import { AxiosError } from 'axios';
import {http} from '../http';
import { ClienteObraSocial } from '../entities/clienteObraSocial';



const getObrasSocialesCliente = async (_idCliente: number) => {
    try {
        const resp = await http.get(`/cliente-obra-social/${_idCliente}`);
        console.log(resp)
        return resp.data.data as ClienteObraSocial[];
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
};


export const clienteObraSocialApi = {
    getObrasSocialesCliente: (_idCliente: number)=> getObrasSocialesCliente(_idCliente)

}