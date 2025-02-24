import { AxiosError } from 'axios';
import {http} from '../http';
import { http_files } from '../http.files';
import { CreateAudiometriaValidator } from '../entities/audiometrias';
import type { Audiometria, EditAudiometriaValidator } from '../entities/audiometrias';

const getAll = async ()=>{
    try{
        const resp = await http.get('/audiometria');
        return resp.data.data as Audiometria[];
    }catch(error){
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
}

const getOne = async (_id: number)=>{
    try{
        const resp = await http.get(`/audiometria/${_id}`);
        return resp.data.data as Audiometria;
    }catch(error){
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
}

const create = async (_audiometria: CreateAudiometriaValidator, _pdf: FormData|undefined)=>{
    try{
        // TODO Formdata 
        const resp = await http.post('/audiometria');
        return resp.data.data as Audiometria;
    }catch(error){
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
}

const edit = async (_id: number, _audiometria: EditAudiometriaValidator, _pdf: FormData|undefined)=>{
    try{
        // TODO Formdata 
        const resp = await http.patch(`/audiometria/${_id}`, _audiometria);
        return resp.data.data as Audiometria;
    }catch(error){
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
}

export const audiometriasApi = {
    getAll: ()=> getAll(),
    getOne: (_id: number)=> getOne(_id),
    create: (_audiometria: CreateAudiometriaValidator, _pdf: FormData)=> create(_audiometria, _pdf),
    edit: (_id: number, _audiometria: EditAudiometriaValidator, _pdf?: FormData)=> edit(_id, _audiometria, _pdf)
}