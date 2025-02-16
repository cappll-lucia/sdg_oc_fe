import { BaseEntity } from "./entities";
import { z } from 'zod';
import { isCuit } from "@/utils/utils";


export interface Proveedor extends BaseEntity {
    cuit: string;
    razonSocial: string;
    email: string;
    telefono: string;
}

export const createProveedorValidator = z.object({
    cuit: z
        .string()
        .refine(isCuit, { message: "El CUIT debe tener el formato XX-XXXXXXXX-X" }),
    razonSocial: z
        .string({message: 'Requerido'})
        .min(2, {message: 'La razón social debe contener entre 2 y 50 caracteres'})
        .max(50, {message: 'La razón social debe contener entre 2 y 50 caracteres'}),
    email: z
        .string({message: 'Requerido'})
        .email({ message: "El email no es válido" }),
    telefono: z
        .string({message: 'Requerido'})
        .min(6, { message: "El teléfono debe tener al menos 6 caracteres" })
});
export type CreateProveedorValidator = z.infer<typeof createProveedorValidator>;


export const editProveedorValidator = z.object({
    cuit: z
        .string()
        .refine(isCuit, { message: "El CUIT debe tener el formato XX-XXXXXXXX-X" }),
    razonSocial: z
        .string({message: 'Requerido'})
        .min(2, {message: 'La razón social debe contener entre 2 y 50 caracteres'})
        .max(50, {message: 'La razón social debe contener entre 2 y 50 caracteres'}),
    email: z
        .string({message: 'Requerido'})
        .email({ message: "El email no es válido" }),
    telefono: z
        .string({message: 'Requerido'})
        .min(6, { message: "El teléfono debe tener al menos 6 caracteres" })
});
export type EditProveedorValidator = z.infer<typeof editProveedorValidator>;

