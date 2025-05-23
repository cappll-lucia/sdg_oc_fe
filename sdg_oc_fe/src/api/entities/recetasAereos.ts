import { Cliente } from './clientes';
import type {BaseEntity} from  './entities';
import { DetalleRecetaAereos, NewDetalleType } from './detalleRecetaAereos';
import { fechaValidator } from '@/lib/utils';

export enum TipoReceta {
  Cerca = 'Cerca',
  Lejos = 'Lejos',
  Multifocal = 'Multifocal',
}


export enum TipoCristal{
  Organico = 'Orgánico',
  Mineral = 'Mineral',
  Futurex = 'Futurex',
  Policarbonato = 'Policarbonato',
  Trivex = 'Trivex'
}

export enum ColorCristal{
  Blanco = 'Blanco',
  Gris = 'Gris',
  Organico_Fotogromatico = 'Organico Fotogromatico',
  Photobrown = 'Photobrown',
  Photogray = 'Photogray',
  Sepia50 = 'Sepia50',
  Tenido_Degrade = 'Tenido Degrade',
}

export enum TratamientoCristal{
  Sin_Tratamiento='Sin Tratamiento',
  Antireflejo = 'Antireflejo',
  Filtro_Azul='Filtro Azul'
}


export interface RecetasAereos extends BaseEntity{
    fecha: Date;
    tipoReceta: TipoReceta;
    oftalmologo:string;
    cristal:TipoCristal;
    color:ColorCristal;
    tratamiento:TratamientoCristal;
    armazon:string;
    cliente: Cliente;
    observaciones: string,
    detallesRecetaLentesAereos: DetalleRecetaAereos[],
}


export const createRecetaAereosCustomValidator = (_newReceta: {
    tipoReceta: TipoReceta, 
    oftalmologo:undefined | string,
    cristal:undefined | TipoCristal,
    color:undefined | ColorCristal,
    tratamiento:undefined | TratamientoCristal,
    armazon:undefined | string,
    observaciones:undefined | string,
    cliente: { id: undefined | number }
  }, 
  _fecha : {
    day: string,
    month: string,
    year: string,
  }) =>{
    const isValid = {
      tipoReceta: Object.keys(TipoReceta).includes(_newReceta.tipoReceta),
      oftalmologo: Boolean(_newReceta.oftalmologo),
      cristal: _newReceta.cristal ? Object.keys(TipoCristal).includes(_newReceta.cristal) : false,
      color: _newReceta.color ? Object.keys(ColorCristal).includes(_newReceta.color) : false,
      tratamiento: _newReceta.tratamiento ? Object.keys(TratamientoCristal).includes(_newReceta.tratamiento) : false,
      fecha: fechaValidator.safeParse(_fecha).success,
      cliente: Boolean(_newReceta.cliente.id)
    };
    const success = Object.values(isValid).every(Boolean);
    return {success, isValid};
  }

  export const editRecetaAereosCustomValidator = (_newReceta:RecetasAereos | undefined, _fecha : {  day: string,  month: string,  year: string,}) =>{
    const isValid = {
      tipoReceta: _newReceta ?  Object.keys(TipoReceta).includes(_newReceta.tipoReceta) : false,
      oftalmologo: _newReceta ?  Boolean(_newReceta.oftalmologo) : false,
      cristal: _newReceta ?  _newReceta.cristal ? Object.keys(TipoCristal).includes(_newReceta.cristal) : false : false,
      color: _newReceta ?  _newReceta.color ? Object.keys(ColorCristal).includes(_newReceta.color) : false : false,
      tratamiento: _newReceta ?  _newReceta.tratamiento ? Object.keys(TratamientoCristal).includes(_newReceta.tratamiento) : false : false,
      fecha: fechaValidator.safeParse(_fecha).success,
      cliente: _newReceta ?  Boolean(_newReceta.cliente.id) : false,
    };
    const success = Object.values(isValid).every(Boolean);
    return {success, isValid};
  }

export type NewRecetaType = {
   tipoReceta: TipoReceta, 
    oftalmologo:undefined | string,
    cristal:undefined | TipoCristal,
    color:undefined | ColorCristal,
    tratamiento:undefined | TratamientoCristal,
    armazon:undefined | string,
    observaciones:undefined | string,
    fecha: Date | undefined,
    cliente: { id: undefined | number }
    detallesRecetaLentesAereos: Array<NewDetalleType>
}
export type EditedRecetaType = {
  id: number,
  tipoReceta: TipoReceta, 
  oftalmologo:undefined | string,
  cristal:undefined | TipoCristal,
  color:undefined | ColorCristal,
  tratamiento:undefined | TratamientoCristal,
  armazon:undefined | string,
  observaciones:undefined | string,
  fecha: Date | undefined,
  cliente: { id: undefined | number }
  detallesRecetaLentesAereos: Array<NewDetalleType>
}
