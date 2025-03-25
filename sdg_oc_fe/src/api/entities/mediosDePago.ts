import {z} from 'zod'

export enum TipoMedioDePagoEnum {
  EFECTIVO = 'EFECTIVO',
  TARJETA_CREDITO = 'TARJETA CREDITO',
  TARJETA_DEBITO = 'TARJETA DEBITO',
  TRANSFERENCIA_BANCARIA = 'TRANSFERENCIA BANCARIA',
  CHEQUE = 'CHEQUE',
  CUENTA_CORRIENTE = 'CUENTA CORRIENTE',
  OTRO = 'OTRO',
}
export enum RedDePago {
  VISA = 'VISA',
  MASTERCARD = 'MASTERCARD',
  AMERICAN_EXPRESS = 'AMERICAN EXPRESS',
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

export const createMedioPagoCustomValidator= (_mediosPago: {
  tipoMedioDePago: TipoMedioDePagoEnum | undefined,
  entidadBancaria: string | undefined,
  redDePago: RedDePago|undefined,
  importe: number
}[])=>{
  const validateRedPago = (value:  RedDePago | undefined, tipo: TipoMedioDePagoEnum | undefined)=>  
    tipo==undefined || tipo==TipoMedioDePagoEnum.EFECTIVO || tipo==TipoMedioDePagoEnum.CUENTA_CORRIENTE ? true : Object.keys(RedDePago).includes(value as RedDePago)
  const validateEntidad = (value: unknown, tipo: TipoMedioDePagoEnum | undefined) => 
    tipo === undefined || tipo === TipoMedioDePagoEnum.EFECTIVO || tipo === TipoMedioDePagoEnum.CUENTA_CORRIENTE ? true : Boolean(value);
  const isValidArray = _mediosPago.map(_medio=> ({
    tipoMedioDePago: _medio.tipoMedioDePago ? Object.keys(TipoMedioDePagoEnum).includes(_medio.tipoMedioDePago as TipoMedioDePagoEnum): false,
    entidadBancaria: validateEntidad(_medio.entidadBancaria, _medio.tipoMedioDePago),
    redDePago: validateRedPago(_medio.redDePago, _medio.tipoMedioDePago),
    importe: _medio.importe > 0
  }))
  const success = isValidArray.every(isValid => 
      Object.values(isValid).every(Boolean)
  );
  console.log(success)
  return { success, isValid: isValidArray };
}

export type NewMedioPagoType = {
  tipoMedioDePago: TipoMedioDePagoEnum | undefined,
  entidadBancaria: string | undefined,
  redDePago: RedDePago | undefined,
  importe: number
}