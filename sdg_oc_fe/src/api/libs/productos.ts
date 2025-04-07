import { AxiosError } from 'axios';
import {http} from '../http';
import { Producto } from '../entities/producto';
import { http_files } from '../http.files';

interface ProductoFilters {
    id?: string | null;
    proveedorId?: string | null;
    marcaId?: string | null;
    categoria?: string | null;
    filtro?: string | null;
    limit?: number | string;
    offset?: number | string;
}


const getAll = async (filters: ProductoFilters = {}) => {
    try {
        const params = new URLSearchParams();

        if (filters.proveedorId) params.append("proveedorId", filters.proveedorId);
        if (filters.marcaId) params.append("marcaId", filters.marcaId);
        if (filters.categoria) params.append("categoria", filters.categoria);
        if (filters.filtro) params.append("descripcion", filters.filtro);
        
        params.append("limit", filters.limit?.toString() || "10");
        params.append("offset", filters.offset?.toString() || "0");

        const url = `/producto?${params.toString()}`;
        const resp = await http.get(url);
        return resp.data.data as {items: Producto[],  nextPage: number|null, previousPage: number|null};
    } catch (error) {
        throw error instanceof AxiosError ?  
            new Error(error?.response?.data?.message) : 
            new Error('Algo salió mal');
    }
};

const createLote = async(_marcaId: string, _provId: string, _file: File)=>{
    try{
        const formData = new FormData();
        formData.append('marcaId', _marcaId.toString())
        formData.append('proveedorId', _provId.toString())
        formData.append('file', _file);
        const resp = await http_files.post('/producto/upload', formData)
        return resp.data.data as Producto[];
    }catch(error){
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
}

const updateLote = async(_marcaId: string, _provId: string, _porcentaje: number)=>{
    try{
        const resp = await http.patch('/producto/precio', {
            proveedor:{
                id: _provId
            },
            marca:{
                id: _marcaId
            },
            porcentaje: _porcentaje
        })
        return resp.data.data as Producto[];
    }catch(error){
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
}


export const productosApi ={
    getAll: (_filters: ProductoFilters)=> getAll(_filters),
    createLote: (_marcaId: string, _provId: string, _file: File)=> createLote (_marcaId, _provId, _file),
    updateLote: (_marcaId: string, _provId: string, _porcentaje: number)=> updateLote (_marcaId, _provId, _porcentaje)
}