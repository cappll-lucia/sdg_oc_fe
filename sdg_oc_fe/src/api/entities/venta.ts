import { Cliente } from "./clientes";
import { BaseEntity, BaseEntitySt } from "./entities";
import { createLineaVentaValidator, LineaVenta } from "./lineaVenta";
import {number, z} from 'zod'
import { createMedioDePagoValidator, MedioDePago } from "./mediosDePago";


export interface Venta extends BaseEntitySt{
    fecha: Date;
    descuentoPorcentaje: number;
    importe: number;
    cliente: Cliente;
    lineasDeVenta: LineaVenta[];
    mediosDePago: MedioDePago[];
}


export const createVentaValidator = z.object({
    fecha: z.string().datetime().default(() => new Date().toISOString()),
    descuentoPorcentaje: number().min(0).max(100),
    cliente: z.object({
        id: z.number({message: 'Seleccionar el cliente'}).int().positive()
    }, {message: 'Seleccionar cliente'}),
    lineasDeVenta: z.array(createLineaVentaValidator).min(1, {message: 'Ningun producto ha sido seleccionado'}),
    mediosDePago: z.array(createMedioDePagoValidator).min(1, {message: 'Indique al menos un medio de pago'})
}).superRefine((data, ctx) => {
    const totalVentaBruto = data.lineasDeVenta.reduce((total, linea) => {
        return total + (linea.precioIndividual * linea.cantidad);
    }, 0);

    const montoDto = data.descuentoPorcentaje
        ? (totalVentaBruto * data.descuentoPorcentaje) / 100
        : 0;


    const totalVentaNeto = totalVentaBruto - montoDto;

    const totalMediosPago = data.mediosDePago.reduce((total, medio) => {
    const importeValido = medio.importe ?? 0;  
    console.log("Importe de medio de pago:", importeValido);
    return total + importeValido;
}, 0);

    if (totalMediosPago !== totalVentaNeto) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `El total de los medios de pago debe ser igual al total neto (${totalVentaNeto.toFixed(2)}).`,
            path: ["mediosDePago"] 
        });
    }
});
export type CreateVentaValidator = z.infer<typeof createVentaValidator>