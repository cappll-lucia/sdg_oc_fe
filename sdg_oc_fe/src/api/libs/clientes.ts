import { AxiosError } from 'axios';
import {http} from '../http';
import { Cliente, CreateClienteValidator } from '../entities/clientes';

const getAll = async () => {
    try {
        const resp = await http.get('/cliente');
        return resp.data.data as Cliente[];
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
};

const getOne = async (_id: number) => {
    try {
        const resp = await http.get(`/cliente/${_id}`);
        return resp.data.data as Cliente;
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
};

const create = async (_cliente: CreateClienteValidator, _obrasSociales: {obraSocial:{id: number}, numeroSocio: string}[]) => {
    try {
        const newCliente = {
            ..._cliente,
            clienteObrasSociales: _obrasSociales
        };
        console.log(newCliente)

        const resp = await http.post(`/cliente`, newCliente);
        return resp.data.data as Cliente;
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
};

const edit = async (_id: number, _cliente: any) => {
    try {
        const resp = await http.patch(`/marca/${_id}`, _cliente);
        return resp.data.data as Cliente;
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
};

const remove = async(_id: number ) =>{
    try {
		await http.delete(`/cliente/${_id}`);
	} catch (error: any) {
        console.log(error)
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal al crear la marca')
	}
}

export const clientesApi = {
    getAll: ()=> getAll(),
    getOne: (_id: number)=> getOne(_id),
    create: (_cliente: CreateClienteValidator, _obrasSociales: {obraSocial:{id: number}, numeroSocio: string}[])=> create(_cliente, _obrasSociales),
    edit: (_id: number, _cliente: any)=> edit(_id, _cliente),
    remove: (_id: number)=> remove(_id),
}