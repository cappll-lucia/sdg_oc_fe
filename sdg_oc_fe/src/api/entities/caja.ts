import { BaseTransactionalEntity } from "./entities";
import { RedDePago, TipoMedioDePagoEnum } from "./mediosDePago";

export interface Caja extends BaseTransactionalEntity{
  fechaMovimiento: Date;
  detalle?: string;
  importe: number;
  formaPago: TipoMedioDePagoEnum;
  redDePago: RedDePago;
}

export type MovimientoConDetalle = {
  id: string;
  fechaMovimiento: string;
  detalle: {
    importe: number;
    formaPago: TipoMedioDePagoEnum;
    redDePago: RedDePago | null;
  }[];
};

export type MovimientoSimple = {
  fechaMovimiento: string;
  detalle: string;
  importe: number;
  formaPago: string;
  redDePago: string | null;
};

export type SaldoCaja = {
  cajaDetallada: (MovimientoConDetalle | MovimientoSimple)[];
  cajaEfectivo: number;
  cajaTransferencia: number;
  cajaCheque: number;
  cajaCuentaCorriente: number;
  cajaOtro: number;
  cajaVisa: number;
  cajaMastercard: number;
  cajaAmericanExpress: number;
  cajaNaranja: number;
  cajaPagofacil: number;
  total: number;
};
