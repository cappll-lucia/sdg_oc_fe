import {z} from 'zod';
import type {BaseEntity} from  './entities'

export interface ObraSocial extends BaseEntity {
    nombre: string;
}

export const createObraSocialValidator = z.object({
    nombre: z
        .string({message: 'Requerido'})
        .min(2, {message: 'El nombre de la obra social debe contener entre 2 y 50 caracteres'})
        .max(50, {message: 'El nombre de la obra social debe contener entre 2 y 50 caracteres'}),		
})
export type CreateObraSocialValidator = z.infer<typeof createObraSocialValidator>;

export const editObraSocialValidator = z.object({
    nombre: z
        .string({message: 'Requerido'})
        .min(2, {message: 'El nombre de la obra social debe contener entre 2 y 50 caracteres'})
        .max(50, {message: 'El nombre de la obra social debe contener entre 2 y 50 caracteres'}),		
})
export type EditObraSocialValidator = z.infer<typeof editObraSocialValidator>;



