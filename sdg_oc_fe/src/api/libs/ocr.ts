import { AxiosError } from 'axios';
import { http_files } from '../http.files';


const processRecetaImg1 = async( _image1: File)=>{
    try{
        const formData = new FormData();
        formData.append('image', _image1);
        const resp = await http_files.post('/ocr/processImage1', formData)
       return resp.data.data as { queterometria: {OD: string[], OI: string[]}, observaciones: string}
    }catch(error){
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
}
const processRecetaImg2 = async( _image2: File)=>{
    try{
        const formData = new FormData();
        formData.append('image', _image2);
        const resp = await http_files.post('/ocr/processImage2', formData);
        console.log(resp)
       return resp.data.data as { lentes_definitivas: {
            OD: { CB:  number | string, Esf:  number | string, Cil:  number | string, Eje:  number | string, Diam: number | string },
            OI: { CB:  number | string, Esf:  number | string, Cil:  number | string, Eje:  number | string, Diam: number | string }
        } }
    }catch(error){
        throw error instanceof (AxiosError) ?  new Error(error?.response?.data?.message) : new Error('Algo salió mal');
    }
}

export const ocrApi = {
    processRecetaImg1: (_image1: File)=> processRecetaImg1(_image1),
    processRecetaImg2: (_image2: File)=> processRecetaImg2(_image2)
}

