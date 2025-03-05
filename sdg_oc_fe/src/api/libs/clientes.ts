import { AxiosError } from 'axios';
import {http} from '../http';
import { Cliente, CreateClienteValidator, EditClienteValidator } from '../entities/clientes';
import { RecetasAereos } from '../entities/recetasAereos';
import { RecetaContacto } from '../entities/recetasContacto';
import { HistoriaClinica } from '../entities/historiaClinica';

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

// TODO update endpoint
const getPaginated = async (_txt:string) => {
    try {
        const clientes = await getAll();
        return clientes.filter(c=> c.nombre.includes(_txt)) as Cliente[];
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
};

const getRecetasByCliente= async(_idCliente: number)=>{
    try {
        const resp = await http.get(`/cliente/recetas/${_idCliente}`);
        console.log(resp.data)
         return {
            recetasLentesAereos: resp.data.data.recetasLentesAereos as RecetasAereos[],
            recetasLentesContacto: resp.data.data.recetasLentesContacto as RecetaContacto[],
            historiaClinicaContacto: resp.data.data.historiaClinicaLentesContacto as HistoriaClinica
        };
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
}


const create = async (_cliente: CreateClienteValidator, _obrasSociales: {obraSocial:{id: number}, numeroSocio: string}[]) => {
    try {
        const newCliente = {
            ..._cliente,
            clienteObrasSociales: _obrasSociales
        };

        const resp = await http.post(`/cliente`, newCliente);
        return resp.data.data as Cliente;
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
};

const edit = async (_id: number, _cliente: EditClienteValidator, _obrasSociales: {obraSocial:{id: number}, numeroSocio: string}[]) => {
    try {
        const updatedCliente = {
            ..._cliente,
            clienteObrasSociales: _obrasSociales
        }
        const resp = await http.patch(`/cliente/${_id}`, updatedCliente);
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
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal al eliminar el cliente')
	}
}

export const clientesApi = {
    getAll: ()=> getAll(),
    getPaginated : (txt: string)=> getPaginated(txt),
    getOne: (_id: number)=> getOne(_id),
    getRecetasByCliente: (_idCliente: number)=> getRecetasByCliente(_idCliente),
    create: (_cliente: CreateClienteValidator, _obrasSociales: {obraSocial:{id: number}, numeroSocio: string}[])=> create(_cliente, _obrasSociales),
    edit: (_id: number, _cliente: EditClienteValidator,  _obrasSociales: {obraSocial:{id: number}, numeroSocio: string}[])=> edit(_id, _cliente, _obrasSociales),
    remove: (_id: number)=> remove(_id),
}