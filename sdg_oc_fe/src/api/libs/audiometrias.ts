import { AxiosError } from 'axios';
import {http} from '../http';
import { http_files } from '../http.files';
import { Audiometria, EditAudiometriaValidator, ClienteAudiometriasFecha, NewAudiometriaDTO } from '../entities/audiometrias';

const getAll = async ()=>{
    try{
        const resp = await http.get('/audiometria');
        return resp.data.data as Audiometria[];
    }catch(error){
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
}

const getAllGroupByCliente = async ()=>{
    try{
        const resp = await http.get('/cliente/audiometrias/fecha');
        return resp.data.data as ClienteAudiometriasFecha[];
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

const create = async (_audiometria: NewAudiometriaDTO, _pdf: File | undefined)=>{
    try{
        const formData = new FormData();
        formData.append('audiometriaDTO', JSON.stringify(_audiometria));
        if (_pdf) {
            formData.append('pdf', _pdf);
        }
        const resp = await http_files.post('/audiometria', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return resp.data.data as Audiometria;
    }catch(error){
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
}

const edit = async (_id: number, _audiometria: EditAudiometriaValidator, _pdf: File|undefined)=>{
    try{
        const formData = new FormData();
        formData.append('audiometriaDTO', JSON.stringify(_audiometria));
        if (_pdf) {
            formData.append('pdf', _pdf);
        }
        const resp = await http_files.patch(`/audiometria/${_id}`, formData)
        return resp.data.data as Audiometria;
    }catch(error){
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
}

export const audiometriasApi = {
    getAll: ()=> getAll(),
    getAllGroupByCliente: ()=> getAllGroupByCliente(),
    getOne: (_id: number)=> getOne(_id),
    create: (_audiometria: NewAudiometriaDTO, _pdf: File)=> create(_audiometria, _pdf),
    edit: (_id: number, _audiometria: EditAudiometriaValidator, _pdf?: File)=> edit(_id, _audiometria, _pdf)
}