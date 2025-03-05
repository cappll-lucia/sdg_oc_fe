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
        id: z.number({message: 'Indique el producto'}).int().positive()
    }, {message: 'Indique el producto'}),
    cantidad: z.number().int().positive({message: 'Indique la cantidad'}),
    precioIndividual: z.number()
})
export type CreateLineaVentaValidator = z.infer<typeof createLineaVentaValidator>