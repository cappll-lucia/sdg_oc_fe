import { Cliente } from './clientes';
import type {BaseEntity} from  './entities'
import { ObraSocial } from './obraSocial';

export interface ClienteObraSocial extends BaseEntity{
    numeroSocio: string, 
    cliente: Cliente,
    obraSocial: ObraSocial
}