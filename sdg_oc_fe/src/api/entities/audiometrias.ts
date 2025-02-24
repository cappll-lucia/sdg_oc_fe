import { Cliente } from "./clientes";
import { BaseEntity } from "./entities";
import {z} from 'zod';

export interface Audiometria extends BaseEntity{
    fechaInforme: Date,
    linkPDF: string,
    observaciones: string,
    cliente: Cliente
}


export const createAudiometriaValidator = z.object({
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
    observaciones: z.string().optional(),
    cliente: z.object({
        id: z.number().int().positive()
    })
})
export type CreateAudiometriaValidator = z.infer<typeof createAudiometriaValidator>;