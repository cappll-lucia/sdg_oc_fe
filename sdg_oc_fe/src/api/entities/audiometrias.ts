import { fechaValidator } from "@/lib/utils";
import { Cliente } from "./clientes";
import { BaseEntity } from "./entities";
import {z} from 'zod';

export interface Audiometria extends BaseEntity{
    fechaInforme: Date,
    linkPDF: string,
    observaciones: string,
    cliente: Cliente
}

export interface ClienteAudiometriasFecha {
    clienteId: string ;
    nombre: string ;
    apellido: string ;
    fechaUltimaAudiometria: Date | null
}   

export const audiometriaCustomValidator = (_audiometria: {
  cliente: {id: number | undefined},
  observaciones: string | undefined,
}, _fecha: {day: string, month: string, year: string }, _file: any)=>{
  const isValid = {
    cliente: Boolean(_audiometria.cliente.id),
    fechaInforme: fechaValidator.safeParse(_fecha).success,
    file: _file ? _file.type == 'application/pdf' : false
  }
  const success = Object.values(isValid).every(Boolean);
  return {success, isValid};
}

export const editAudiometriaCustomValidator = (_audiometria: {
  cliente: {id: number | undefined},
  observaciones: string | undefined,
}, _fecha: {day: string, month: string, year: string }, _file: any)=>{
  const isValid = {
    cliente: Boolean(_audiometria.cliente.id),
    fechaInforme: fechaValidator.safeParse(_fecha).success,
    file: _file==undefined ? true :  _file.type == 'application/pdf'
  }
  const success = Object.values(isValid).every(Boolean);
  return {success, isValid};
}

export type NewAudiometriaDTO = {
  cliente: {id: number | undefined},
  fechaInforme: Date | undefined,
  observaciones: string | undefined
}

export const editAudiometriaValidator = z.object({
    fechaInforme: z
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
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Fecha de informe inválida",
    }),
    observaciones: z.string().optional()
})
export type EditAudiometriaValidator = z.infer<typeof editAudiometriaValidator>;