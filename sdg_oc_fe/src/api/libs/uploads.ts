import { AxiosError } from 'axios';
import { http_files } from '../http.files'; 


const getFile = async (_filePath: string) => {
    try {
        const resp = await http_files.get(`/uploads/${_filePath}`, {
            responseType: 'blob'
        });
        const file = URL.createObjectURL(resp.data);
        return file;
    } catch (error) {
        throw error instanceof AxiosError ? new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
};

export const uploadsApi = {
    getFile: (__filename:string)=> getFile(__filename)
}