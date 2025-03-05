import { AxiosError } from 'axios';
import {http} from '../http';
import { Producto } from '../entities/producto';

interface ProductoFilters {
    id?: string | null;
    proveedorId?: string | null;
    marcaId?: string | null;
    categoria?: string | null;
    descripcion?: string | null;
    limit?: number;
    offset?: number;
}


const getAll = async (filters: ProductoFilters = {}) => {
    try {
        const params = new URLSearchParams();

        if (filters.proveedorId) params.append("proveedorId", filters.proveedorId);
        if (filters.marcaId) params.append("marcaId", filters.marcaId);
        if (filters.categoria) params.append("categoria", filters.categoria);
        if (filters.descripcion) params.append("descripcion", filters.descripcion);
        
        params.append("limit", filters.limit?.toString() || "10");
        params.append("offset", filters.offset?.toString() || "0");

        const url = `/producto?${params.toString()}`;
        const resp = await http.get(url);
        return resp.data.data.items as Producto[];
    } catch (error) {
        throw error instanceof AxiosError ?  
            new Error(error?.response?.data?.message) : 
            new Error('Algo salió mal');
    }
};


export const productosApi ={
    getAll: (_filters: ProductoFilters)=> getAll(_filters)
}