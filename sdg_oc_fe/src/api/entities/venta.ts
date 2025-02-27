import { Cliente } from "./clientes";
import { BaseEntity } from "./entities";
import { createLineaVentaValidator, LineaVenta } from "./lineaVenta";
import {number, z} from 'zod'
import { createMedioDePagoValidator, MedioDePago } from "./mediosDePago";


export interface Venta extends BaseEntity{
    fecha: Date;
    descuentoPorcentaje: number;
    importe: number;
    cliente: Cliente;
    lineasDeVenta: LineaVenta[];
    mediosDePago: MedioDePago[];
}


export const createVentaValidator = z.object({
    fecha: z.string().datetime().default(() => new Date().toISOString()),
    descuentoPorcentaje: number().optional(),
    cliente: z.object({
        id: z.number().int().positive()
    }),
    lineasDeVenta: z.array(createLineaVentaValidator),
    mediosDePago: z.array(createMedioDePagoValidator)
})
export type CreateVentaValidator = z.infer<typeof createVentaValidator>