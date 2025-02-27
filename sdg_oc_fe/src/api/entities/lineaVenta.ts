import { BaseEntity } from "./entities";
import { Producto } from "./producto";
import {z} from 'zod'

export interface LineaVenta extends BaseEntity{
    producto: Producto;
    cantidad: number;
    precioIndividual: number;
}

export const createLineaVentaValidator = z.object({
    producto: z.object({
        id: z.number().int().positive()
    }),
    cantidad: z.number().int().positive(),
    precioIndividual: z.number()
})
export type CreateLineaVentaValidator = z.infer<typeof createLineaVentaValidator>