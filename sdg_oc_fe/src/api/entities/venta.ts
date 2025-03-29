import { Cliente } from "./clientes";
import { createLineaVentaValidator, LineaVenta, NewLineaVentaType } from "./lineaVenta";
import {number, z} from 'zod'
import { createMedioDePagoValidator, MedioDePago, NewMedioPagoType } from "./mediosDePago";
import { isValidNumber } from "@/lib/utils";
import { BaseTransactionalEntity } from "./entities";
import { ObraSocial } from "./obraSocial";
import { Comprobante } from "./comprobante";

export interface Venta extends BaseTransactionalEntity{
    fecha: Date;
    descuentoPorcentaje: number;
    importe: number;
    cliente: Cliente;
    lineasDeVenta: LineaVenta[];
    mediosDePago: MedioDePago[];
    comprobante: Comprobante,
    observaciones: string;
    ventaObraSocial: VentaObraSocial[];
}

export interface VentaObraSocial extends BaseTransactionalEntity{
    venta: Venta;
    obraSocial: ObraSocial;
    importe: number;
    condicionIva: CondicionIva;
}


export enum CondicionIva {
  RESPONSABLE_INSCRIPTO = 1,
  EXENTO = 4,
  CONSUMIDOR_FINAL = 5,
  MONOTRIBUTISTA = 6,
  GRAVADO = 7,
  NO_GRAVADO = 8,
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


export const createVentaCustomValidator = (_newVenta: {
    cliente: {id: undefined | number},
    fecha: Date,
    descuentoPorcentaje: number | undefined,
    condicionIvaVenta: CondicionIva | undefined,
})=>{
    const isValid = {
        cliente: _newVenta.cliente.id===0 || Boolean(_newVenta.cliente.id),
        fecha: _newVenta.fecha instanceof Date,
        descuentoPorcentaje: isValidNumber(_newVenta.descuentoPorcentaje) && 0 <= _newVenta.descuentoPorcentaje && _newVenta.descuentoPorcentaje<=100 ,
        condicionIvaVenta: _newVenta.condicionIvaVenta ? Object.values(CondicionIva).includes(_newVenta.condicionIvaVenta) :false,
    }
    const success = Object.values(isValid).every(Boolean);
    return {success, isValid};
}


export const ventaObrasSocialesCustomValidator = (_ventasOS: {
        obraSocial:{id:  undefined | number},
        importe: number,
        condicionIva:  CondicionIva | undefined
    }[])=>{
        const isValidArray = _ventasOS.map(_os=> ({
            obraSocial: Boolean(_os.obraSocial.id),
            importe: isValidNumber(_os.importe) && _os.importe >0,
            condicionIva: _os.condicionIva ? Object.values(CondicionIva).includes(Number(_os.condicionIva)) :false,
        }))
        const success = isValidArray.every(isValid => 
            Object.values(isValid).every(Boolean)
        );
        return { success, isValid: isValidArray };
}

export type NewVentaOsType = {
    obraSocial: {id: undefined | number},
    importe: number,
    condicionIva: CondicionIva | undefined
}

export type NewVentaType ={
    cliente: { id: undefined | number },
    descuentoPorcentaje: number,
    fecha: Date,
    condicionIva: CondicionIva
    lineasDeVenta : Array<NewLineaVentaType>,
    mediosDePago: Array<NewMedioPagoType>,
    ventaObraSocial: Array<NewVentaOsType>,
    observaciones: string | undefined
}