
import { AxiosError } from 'axios';
import { CreateProveedorValidator, EditProveedorValidator, Proveedor } from '../entities/proveedor';
import {http} from '../http';

const getAll = async () => {
    try {
        const resp = await http.get('/proveedores');
        console.log(resp)
        return resp.data.data as Proveedor[];
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
};

const getOne = async (_id: number) => {
    try {
        const resp = await http.get(`/proveedores/${_id}`);
        return resp.data.data as Proveedor;
    } catch (error) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
};

const create = async(_proveedor: CreateProveedorValidator ) =>{
    try {
        const resp = await http.post('/proveedores', _proveedor);
        return resp.data.data as Proveedor[];
    } catch (error: any) {
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal al crear el proveedor')
    }
}

const edit = async(_id: number, _proveedor: EditProveedorValidator ) =>{
    try {
        const resp = await http.patch(`/proveedores/${_id}`, _proveedor);
        return resp.data.data as Proveedor[];
    } catch (error: any) {
        console.log(error)
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal al crear el proveedor')
    }
}

const remove = async(_id: number ) =>{
    try {
        await http.delete(`/proveedores/${_id}`);
    } catch (error: any) {
        console.log(error)
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal al crear el proveedor')
    }
}

export const proveedoresApi = {
    getAll: ()=> getAll(),
    getOne: (_id: number)=> getOne(_id),
    create: (_proveedor: CreateProveedorValidator)=> create(_proveedor),
    edit: (_id: number, _proveedor: EditProveedorValidator)=> edit(_id, _proveedor),
    remove: (_id: number)=> remove(_id),
}
