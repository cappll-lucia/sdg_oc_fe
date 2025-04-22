import { AxiosError } from 'axios';
import { http_files } from '../http.files';


const processRecetaImg1 = async( _image1: File)=>{
    try{
        const formData = new FormData();
        formData.append('image', _image1);
        const resp = await http_files.post('/ocr/process', formData)
       return resp.data.data as { oftalmometria: {OD: string[], OI: string[]}, observaciones: string}
    }catch(error){
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
}

export const ocrApi = {
    processRecetaImg1: (_image1: File)=> processRecetaImg1(_image1)
}