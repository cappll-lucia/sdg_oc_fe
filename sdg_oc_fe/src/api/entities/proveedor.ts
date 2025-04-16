import { BaseEntity } from "./entities";
import { emailValidator, isValidNumber } from "@/lib/utils";


export interface Proveedor extends BaseEntity {
    cuit: string;
    razonSocial: string;
    email: string;
    telefono: string;
}

export const createProveedorCustomValidator  = (_newProveedor: {
    razonSocial: string|undefined,
    cuit: string|undefined,
    telefono: string|undefined,
    email: string|undefined
})=>{
    const isValid = {
        razonSocial: _newProveedor.razonSocial ? _newProveedor.razonSocial.trim().length>0 : false,
        cuit: _newProveedor.cuit ? ( _newProveedor.cuit.trim().length >=10 &&  _newProveedor.cuit.trim().length<=11 && isValidNumber(_newProveedor.cuit)  ) : false,
        email: emailValidator.safeParse(_newProveedor.email).success,
        telefono: _newProveedor.telefono? isValidNumber(_newProveedor.telefono) : false,
    }
    const success = Object.values(isValid).every(Boolean);
    return { success, isValid}
}


export type NewProveedorType = {
  cuit: string| undefined,
  razonSocial: string | undefined, 
  email: string | undefined, 
  telefono: string | undefined, 
}

export const editProveedorCustomValidator  = (_proveedor: Proveedor)=>{
    const isValid = {
        razonSocial: _proveedor.razonSocial ? _proveedor.razonSocial.trim().length>0 : false,
        cuit: _proveedor.cuit ? ( _proveedor.cuit.trim().length >=10 &&  _proveedor.cuit.trim().length<=11 && isValidNumber(_proveedor.cuit)  ) : false,
        email: emailValidator.safeParse(_proveedor.email).success,
        telefono: _proveedor.telefono? isValidNumber(_proveedor.telefono) : false,
    }
    const success = Object.values(isValid).every(Boolean);
    return { success, isValid}
}

