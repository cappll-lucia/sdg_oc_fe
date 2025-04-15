import { AxiosError } from 'axios';
import {http} from '../http';
import { Cliente, EditedClienteType, NewClienteType } from '../entities/clientes';
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
        return resp.data.data as {items: Cliente[], nextPage: number|null, previousPage: number|null};
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
};

const getOne = async (_id: number) => {
    try {
        const resp = await http.get(`/cliente/${_id}`);
        const foundCliente = resp.data.data as Cliente
        foundCliente.fechaNac = new Date(foundCliente.fechaNac);
        return foundCliente
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

const getRecetasSummaryByCliente = async(_idCLiente:number)=>{
        try {
        const resp = await getRecetasByCliente(_idCLiente);
        const recetasAereos = resp.recetasLentesAereos.map(r=> ({id: r.id, clase: 'Recetados', tipo: r.tipoReceta , fecha: new Date(r.fecha) }));
        const recetasContacto = resp.recetasLentesContacto.map(r=> ({id: r.id, clase: 'Lentes Contacto', fecha: new Date(r.fecha) }));
        const recetas = [...recetasAereos, ...recetasContacto].sort(
            (a, b) => b.fecha.getTime() - a.fecha.getTime()
        );
        return recetas;
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


const create = async (_cliente: NewClienteType, _obrasSociales: {obraSocial:{id: number | undefined}, numeroSocio: string}[]) => {
    try {
        const newCliente = {
            ..._cliente,
            clienteObrasSociales: _obrasSociales
        };
        console.log('new cliente --> ', newCliente)

        const resp = await http.post(`/cliente`, newCliente);
        console.log(resp)
        return resp.data.data as Cliente;
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
};

const edit = async (_id: number, _cliente: EditedClienteType, _obrasSociales: {obraSocial:{id: number|undefined}, numeroSocio: string}[]) => {
    try {
        const updatedCliente = {
            ..._cliente,
            clienteObrasSociales: _obrasSociales
        }
        console.log('----', updatedCliente)
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
    getRecetasSummaryByCliente: (_idCliente: number)=> getRecetasSummaryByCliente(_idCliente),
    getAudiometriasByCliente: (_idCliente: number)=> getAudiometriasByCliente(_idCliente),
    create: (_cliente: NewClienteType, _obrasSociales: {obraSocial:{id: number | undefined}, numeroSocio: string}[])=> create(_cliente, _obrasSociales),
    edit: (_id: number, _cliente: EditedClienteType,  _obrasSociales: {obraSocial:{id: number | undefined}, numeroSocio: string}[])=> edit(_id, _cliente, _obrasSociales),
    remove: (_id: number)=> remove(_id),
}