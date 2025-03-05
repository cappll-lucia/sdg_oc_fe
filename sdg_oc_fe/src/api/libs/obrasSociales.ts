import { AxiosError } from 'axios';
import { CreateObraSocialValidator, EditObraSocialValidator } from '../entities/obraSocial';
import { ObraSocial } from '../entities/obraSocial';
import {http} from '../http';

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

const create = async(_obraSocial: CreateObraSocialValidator ) =>{
    try {
        const resp = await http.post('/obra-social', _obraSocial);
        return resp.data.data as ObraSocial[];
    } catch (error: any) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal al crear la obra social')
    }
}

const edit = async(_id: number, _obraSocial: EditObraSocialValidator ) =>{
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

export const obrasSocialesApi = {
    getAll: ()=> getAll(),
    getOne: (_id: number)=> getOne(_id),
    create: (_obraSocial: CreateObraSocialValidator)=> create(_obraSocial),
    edit: (_id: number, _obraSocial: EditObraSocialValidator)=> edit(_id, _obraSocial),
    remove: (_id: number)=> remove(_id),
}