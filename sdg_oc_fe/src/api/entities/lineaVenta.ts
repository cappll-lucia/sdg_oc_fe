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

export const createLineaVentaCustomValidator = (_lineasVenta: {
    producto: {id: number | undefined},
    cantidad: number,
    precioIndividual: number,
}[])=>{
    const isValidArray = _lineasVenta.map(_linea => ({
        producto: Boolean(_linea.producto.id),
        cantidad: Number.isInteger(_linea.cantidad) && _linea.cantidad>0,
        precioIndividual:  _linea.precioIndividual>0,
    }))
    const success = _lineasVenta.length > 0 && isValidArray.every(isValid => 
        Object.values(isValid).every(Boolean)
    );
    return { success, isValid: isValidArray };
}

export type NewLineaVentaType = {
    producto: { id: undefined | number },
    cantidad: number,
    precioIndividual: number
}