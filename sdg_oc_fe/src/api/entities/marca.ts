import {z} from 'zod';
import type {BaseEntity} from  './entities'

export interface Marca extends BaseEntity {
    nombre: string;
}

export const createMarcaValidator = z.object({
    nombre: z
        .string({message: 'Requerido'})
        .min(2, {message: 'El nombre de la marca debe contener entre 2 y 50 caracteres'})
        .max(50, {message: 'El nombre de la marca debe contener entre 2 y 50 caracteres'}),		
})
export type CreateMarcaValidator = z.infer<typeof createMarcaValidator>;

export const editMarcaValidator = z.object({
    nombre: z
        .string({message: 'Requerido'})
        .min(2, {message: 'El nombre de la marca debe contener entre 2 y 50 caracteres'})
        .max(50, {message: 'El nombre de la marca debe contener entre 2 y 50 caracteres'}),		
})
export type EditMarcaValidator = z.infer<typeof editMarcaValidator>;



