import { BaseTransactionalEntity } from "./entities";
import { RedDePago, TipoMedioDePagoEnum } from "./mediosDePago";

export interface Caja extends BaseTransactionalEntity{
  fechaMovimiento: Date;
  detalle?: string;
  importe: number;
  formaPago: TipoMedioDePagoEnum;
  redDePago: RedDePago;
}

export interface SaldoCaja {
    cajaFinal: Caja[],
    cajaEfectivo: number,
    cajaTransferencia: number,
    cajaCheque: number,
    cajaCuentaCorriente: number,
    cajaOtro: number,
    cajaVisa: number,
    cajaMastercard: number,
    cajaAmericanExpress: number,
    cajaNaranja: number,
    cajaPagofacil: number,
    total: number
}