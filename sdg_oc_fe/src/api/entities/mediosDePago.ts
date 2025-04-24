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
  MERCADOPAGO = 'MERCADOPAGO',
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

export const createMedioPagoCustomValidator = (_mediosPago: {
  tipoMedioDePago: string | undefined,
  entidadBancaria: string | undefined,
  redDePago: string | undefined,
  importe: number
}[]) => {
  const tiposNoRedValidation = ['EFECTIVO', 'CUENTA_CORRIENTE'];

  const tiposValidos = Object.keys(TipoMedioDePagoEnum);
  const redesValidas = Object.keys(RedDePago);

  const isValidArray = _mediosPago.map(_medio => {

    const tipoValido = _medio.tipoMedioDePago 
      ? tiposValidos.includes(_medio.tipoMedioDePago)
      : false;

    const entidadValida = !tipoValido || tiposNoRedValidation.includes(_medio.tipoMedioDePago!)
      ? true
      : !!_medio.entidadBancaria?.trim();

    const redValida = !tipoValido || tiposNoRedValidation.includes(_medio.tipoMedioDePago!)
      ? true
      : !!_medio.redDePago && redesValidas.includes(_medio.redDePago);

    const importeValido = _medio.importe > 0;

    return {
      tipoMedioDePago: tipoValido,
      entidadBancaria: entidadValida,
      redDePago: redValida,
      importe: importeValido
    };
  });

  const success = isValidArray.every(isValid => 
    Object.values(isValid).every(Boolean)
  );

  return { success, isValid: isValidArray };
};

export type NewMedioPagoType = {
  tipoMedioDePago: TipoMedioDePagoEnum | undefined,
  entidadBancaria: string | undefined,
  redDePago: RedDePago | undefined,
  importe: number
}