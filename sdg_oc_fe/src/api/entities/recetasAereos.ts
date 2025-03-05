import { Cliente } from './clientes';
import { DetalleRecetaAereos } from './detalleRecetaAereos';
import type {BaseEntity} from  './entities'

export enum TipoReceta {
  Cerca = 'Cerca',
  Lejos = 'Lejos',
  Multifocal = 'Multifocal',
}


export interface RecetasAereos extends BaseEntity{
    fecha: Date;
    tipoReceta: TipoReceta;
    oftalmologo:string;
    cristal:string;
    color:string;
    armazon:string;
    tratamiento:string;
    cliente: Cliente;
    detallesRecetaLentesAereos: DetalleRecetaAereos[]
}