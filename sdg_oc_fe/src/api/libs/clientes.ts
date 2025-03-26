import { AxiosError } from 'axios';
import {http} from '../http';
import { Cliente, CreateClienteValidator, EditClienteValidator } from '../entities/clientes';
import { RecetasAereos } from '../entities/recetasAereos';
import { RecetaContacto } from '../entities/recetasContacto';
import { HistoriaClinica } from '../entities/historiaClinica';
import { Audiometria } from '../entities/audiometrias';

interface ClienteFilers{
    filtro?: string | null;
    sexo?: string | null;
    localidadId?: string | null;
    limit?: number | string;
    offset?: number | string;
}


const getAll = async (filters: ClienteFilers={}) => {
    try {
        const params = new URLSearchParams();

        if (filters.filtro) params.append("filtro", filters.filtro)
        if (filters.sexo) params.append("sexo", filters.sexo)
        if (filters.localidadId) params.append("localidadId", filters.localidadId)

        params.append("limit", filters.limit?.toString() || "10");
        params.append("offset", filters.offset?.toString() || "0");
        
        const url = `/cliente?${params.toString()}`;
        const resp = await http.get(url);
        return resp.data.data.items as Cliente[];
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

const getRecetasByCliente= async(_idCliente: number)=>{
    try {
        const resp = await http.get(`/cliente/recetas/${_idCliente}`);
         return {
            recetasLentesAereos: resp.data.data.recetasLentesAereos as RecetasAereos[],
            recetasLentesContacto: resp.data.data.recetasLentesContacto as RecetaContacto[],
            historiaClinicaContacto: resp.data.data.historiaClinicaLentesContacto as HistoriaClinica
        };
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
}

const getAudiometriasByCliente = async(_idCliente: number)=>{
    try {
        const resp = await http.get(`/cliente/audiometrias/${_idCliente}`);
        return resp.data.data.audiometrias as Audiometria[];
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
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal al eliminar el cliente')
	}
}

export const clientesApi = {
    getAll: (_filters: ClienteFilers)=> getAll(_filters),
    getOne: (_id: number)=> getOne(_id),
    getRecetasByCliente: (_idCliente: number)=> getRecetasByCliente(_idCliente),
    getAudiometriasByCliente: (_idCliente: number)=> getAudiometriasByCliente(_idCliente),
    create: (_cliente: CreateClienteValidator, _obrasSociales: {obraSocial:{id: number}, numeroSocio: string}[])=> create(_cliente, _obrasSociales),
    edit: (_id: number, _cliente: EditClienteValidator,  _obrasSociales: {obraSocial:{id: number}, numeroSocio: string}[])=> edit(_id, _cliente, _obrasSociales),
    remove: (_id: number)=> remove(_id),
}