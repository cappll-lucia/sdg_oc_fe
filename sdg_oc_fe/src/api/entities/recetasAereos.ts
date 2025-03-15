import { Cliente } from './clientes';
import { z} from 'zod';
import type {BaseEntity} from  './entities';
import { DetalleRecetaAereos, NewDetalleType } from './detalleRecetaAereos';

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
    cristal:string;
    color:string;
    armazon:string;
    tratamiento:string;
    cliente: Cliente;
    observaciones: string,
    detallesRecetaLentesAereos: DetalleRecetaAereos[],
}

const fechaValidator= z
    .object({
      day: z.string(),
      month: z.string(),
      year: z.string(),
    })
    .transform(({ day, month, year }) => {
      let dayNumber = Number(day) +1 ;
      const formattedDate = `${year}-${month.padStart(2, '0')}-${(dayNumber.toString()).padStart(2, '0')}T00:00:00.000Z`;
      return formattedDate;
    })
    .refine((date) => !isNaN(Date.parse(date)));


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
