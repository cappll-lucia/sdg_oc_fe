import { Cliente } from "./clientes";
import { BaseEntity } from "./entities";
import { Movimiento } from "./movimiento";

export enum Estado {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}

export interface CuentaCorriente extends BaseEntity{
    saldo: number;
    movimientos: Movimiento[];
    estado: Estado;
    cliente: Cliente;
}