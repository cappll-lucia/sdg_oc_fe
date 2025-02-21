import { BaseEntity } from "./entities";
import {z} from 'zod';

export interface Cliente extends BaseEntity {
    dni: string , 
    nombre: string , 
    apellido: string , 
    email: string , 
    sexo:  string, 
    telefono: string , 
    domicilio: string , 
    fechaNac: Date , 
    observaciones: string , 
    idLocalidad: number
}

export const createClienteValidator = z.object({
  dni: z.number().int().positive(), 
  nombre: z.string().min(1, "El nombre es requerido"), 
  apellido: z.string().min(1, "El apellido es requerido"),
  email: z.string().email("Formato de email inválido"),
  telefono: z.string().regex(/^\d+$/, "El teléfono solo debe contener números"),
  sexo: z.enum(["Masculino", "Femenino"]),
   fechaNac: z
    .object({
      day: z.string(),
      month: z.string(),
      year: z.string(),
    })
    .transform(({ day, month, year }) => {
      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00.000Z`;
      return formattedDate;
    })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Fecha de nacimiento inválida",
    }),
  observaciones: z.string().optional(), 
  domicilio: z.string().min(1, "El domicilio es requerido"),
  localidad: z.object({
    id: z.number().int().positive(),
  })
});

export type CreateClienteValidator = z.infer<typeof createClienteValidator>;