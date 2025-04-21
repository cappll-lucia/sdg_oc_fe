import { BaseTransactionalEntity } from "./entities";
import { Venta } from "./venta";

export interface Comprobante extends BaseTransactionalEntity{
    numeroComprobante: string;
    CAE: number;
    fechaEmision: Date;
    tipoComprobante: TipoComprobante;
    venta: Venta;
    facturaRelacionada: Comprobante;
    importeTotal: number;
    motivo: string | undefined;
}

export enum TipoComprobante {
  FACTURA_A = 1,
  NOTA_DEBITO_A = 2,
  NOTA_CREDITO_A = 3,

  FACTURA_B = 6,
  NOTA_DEBITO_B = 7,
  NOTA_CREDITO_B = 8,

  FACTURA_C = 11,
  NOTA_DEBITO_C = 12,
  NOTA_CREDITO_C = 13,

  FACTURA_M = 51,
  NOTA_DEBITO_M = 52,
  NOTA_CREDITO_M = 53,
}
