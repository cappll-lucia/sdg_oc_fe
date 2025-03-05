import {z} from 'zod'

export enum TipoMedioDePagoEnum {
  EFECTIVO = 'EFECTIVO',
  TARJETA_CREDITO = 'TARJETA_CREDITO',
  TARJETA_DEBITO = 'TARJETA_DEBITO',
  TRANSFERENCIA_BANCARIA = 'TRANSFERENCIA_BANCARIA',
  CHEQUE = 'CHEQUE',
  CUENTA_CORRIENTE = 'CUENTA_CORRIENTE',
  OTRO = 'OTRO',
}
export enum RedDePago {
  VISA = 'VISA',
  MASTERCARD = 'MASTERCARD',
  AMERICAN_EXPRESS = 'AMERICAN_EXPRESS',
  NARANJA = 'NARANJA',
  PAGOFACIL = 'PAGOFACIL',
  RAPIPAGO = 'RAPIPAGO',
}


export interface MedioDePago{
    ventaId: number;
    numeroPago: number;
    tipoMedioDePago: TipoMedioDePagoEnum,
    entidadBancaria: string;
    redDePago: string;
    importe: number;
}


export const createMedioDePagoValidator = z.object({
    tipoMedioDePago: z.enum(Object.values(TipoMedioDePagoEnum) as [string, ...string[]], {message: 'Seleccione tipo de medio de pago'}),
    entidadBancaria: z.string().optional(),
    redDePago: z.enum(Object.values(RedDePago) as [string, ...string[]]).optional(),
    importe: z.number().min(1, {message: 'Indique el importe'})
})
export type CreateMedioDePagoValidator = z.infer<typeof createMedioDePagoValidator>