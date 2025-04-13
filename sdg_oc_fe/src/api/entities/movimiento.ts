import { BaseEntity } from "./entities";
import { RedDePago, TipoMedioDePagoEnum } from "./mediosDePago";

export enum TipoMovimiento {
  DEVOLUCION = 'DEVOLUCION',
  VENTA = 'VENTA',
  PAGO = 'PAGO',
}

export interface Movimiento extends BaseEntity   {
  fechaMovimiento: Date;
  tipoMovimiento: TipoMovimiento;
  importe: number;
}

export const createMovimientoCtaCte = (_movimiento: {
  tipoMovimiento: TipoMovimiento| undefined,
  importe: number, 
  formaPago: TipoMedioDePagoEnum| undefined,
  entidadBancaria: string | undefined,
  redDePago: string | undefined,
})=>{
  const tiposNoRedValidation = ['EFECTIVO', 'CUENTA_CORRIENTE'];
  
  const tiposValidos = Object.keys(TipoMedioDePagoEnum);
  const redesValidas = Object.keys(RedDePago);
  
  const formaPagoValida = _movimiento.formaPago 
      ? tiposValidos.includes(_movimiento.formaPago)
      : false;

    const entidadValida = !formaPagoValida || tiposNoRedValidation.includes(_movimiento.formaPago!)
      ? true
      : !!_movimiento.entidadBancaria?.trim();

    const redValida = !formaPagoValida || tiposNoRedValidation.includes(_movimiento.formaPago!)
      ? true
      : !!_movimiento.redDePago && redesValidas.includes(_movimiento.redDePago);

    const importeValido = _movimiento.importe > 0;


  const isValid = {
      tipoMovimiento: _movimiento.tipoMovimiento ? Object.keys(TipoMovimiento).includes(_movimiento.tipoMovimiento): false,
      formaPago: formaPagoValida,
      entidadBancaria: entidadValida,
      redDePago: redValida,
      importe: importeValido
  }
  const success = Object.values(isValid).every(Boolean);
  return {success, isValid};
}


export type NewMovimientoType = {
  tipoMovimiento: TipoMovimiento | undefined,
  importe: number, 
  formaPago: TipoMedioDePagoEnum | undefined,
  entidadBancaria: string | undefined,
  redDePago: string|undefined
}