import { BaseEntity } from "./entities";
import { z} from 'zod';
import { Localidad } from "./localidad";
import { ClienteObraSocial } from "./clienteObraSocial";
import { CondicionIva } from "./venta";
import { emailValidator, fechaValidator, isValidNumber } from "@/lib/utils";

export interface Cliente extends BaseEntity {
    nroDocumento: number ,
    tipoDocumento: TipoDocumento,
    categoriaFiscal: CondicionIva,
    nombre: string , 
    apellido: string , 
    email: string , 
    sexo:  string, 
    telefono: string , 
    domicilio: string , 
    fechaNac: Date , 
    observaciones: string , 
    localidad: Localidad,
    clienteObrasSociales : ClienteObraSocial[]
}

export interface ClienteRecetasCount {
    clienteId: string ;
    nombre: string ;
    apellido: string ;
    cantidadRecetasLentesAereos: number ;
    cantidadRecetasLentesContacto: number ;
    fechaUltimaReceta: Date | null
}  

export enum TipoDocumento {
  DNI = 96,
  CUIT = 80,
}


export const createClienteValidator = z.object({
  nroDocumento: z.number().int().positive(), 
  TipoDocumento: z.enum(Object.keys(TipoDocumento) as [string, ...string[]]), 
  nombre: z.string({message: "Ingrese el nombre del cliente"}).min(1,{message: "Ingrese el nombre del cliente"}), 
  apellido: z.string({message: "Ingrese el apellido del cliente"}).min(1, {message: "Ingrese el apellido del cliente"}),
  email: z.string({message: "Ingrese el email del cliente"}).email("Email inválido"),
  telefono: z.string().regex(/^\d+$/, "Telefono inválido"),
  sexo: z.enum(["Masculino", "Femenino"]),
  fechaNac: z
    .object({
      day: z.string(),
      month: z.string(),
      year: z.string(),
    })
    .transform(({ day, month, year }) => {
      console.log('d: '+ day+'- m: '+month+' - y: '+year)
      let dayNumber = Number(day) +1 ;
      const formattedDate = `${year}-${month.padStart(2, '0')}-${(dayNumber.toString()).padStart(2, '0')}T00:00:00.000Z`;
      console.log(formattedDate)
      return formattedDate;
    })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Fecha de nacimiento inválida",
    }),
  observaciones: z.string().optional(),
  domicilio: z.string({message: "Ingrese el domicilio del cliente"}).min(1, "El domicilio es requerido"),
  localidad: z.object({
    id: z.number().int().positive(),
  })
});
export type CreateClienteValidator = z.infer<typeof createClienteValidator>;



export const editClienteValidator = z.object({
  dni: z.number().int().positive(), 
  nombre: z.string().min(1, "El nombre es requerido"), 
  apellido: z.string().min(1, "El apellido es requerido"),
  email: z.string().email("Formato de email inválido"),
  telefono: z.string().regex(/^\d+$/, "El teléfono solo debe contener números"),
  sexo: z.enum(["Masculino", "Femenino"]),
  fechaNac: z
    .object({
      day: z.string({message: 'hola'}),
      month: z.string({message: 'hola'}),
      year: z.string({message: 'hola'}),
    })
    .transform(({ day, month, year }) => {
      let dayNumber = Number(day) +1 ;
      const formattedDate = `${year}-${month.padStart(2, '0')}-${(dayNumber.toString()).padStart(2, '0')}T00:00:00.000Z`;
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
export type EditClienteValidator = z.infer<typeof editClienteValidator>;




export const createClienteCustomValidator = (_newCliente: {
    nroDocumento: number| undefined,
    tipoDocumento: TipoDocumento| undefined,
    categoriaFiscal: CondicionIva| undefined,
    nombre: string | undefined, 
    apellido: string | undefined, 
    email: string | undefined, 
    sexo:  string| undefined, 
    telefono: string | undefined, 
    domicilio: string | undefined, 
    fechaNac: Date | undefined, 
    observaciones: string | undefined, 
    localidad: {id: number | undefined},
}, _fecha : {
    day: string,
    month: string,
    year: string,
  })=>{
    const isValid = {
      nroDocumento: isValidNumber(_newCliente.tipoDocumento),
      tipoDocumento: _newCliente.tipoDocumento ? Object.values(TipoDocumento).includes(_newCliente.tipoDocumento) : false ,
      categoriaFiscal:  _newCliente.categoriaFiscal ? Object.values(CondicionIva).includes(_newCliente.categoriaFiscal) : false ,
      nombre: _newCliente.nombre ? _newCliente.nombre?.trim().length > 0 : false,
      apellido:  _newCliente.apellido ? _newCliente.apellido?.trim().length > 0 : false,
      email: emailValidator.safeParse(_newCliente.email).success,
      sexo: _newCliente.sexo ? ['Femenino', 'Masculino'].includes(_newCliente.sexo) :false,
      telefono: isValidNumber(_newCliente.tipoDocumento),
      domicilio: _newCliente.domicilio ? _newCliente.domicilio?.trim().length > 0 : false, 
      fechaNac: fechaValidator.safeParse(_fecha).success,
      localidad: _newCliente.localidad ? Boolean(_newCliente.localidad.id) : false,
    }
    const success = Object.values(isValid).every(Boolean);
    return {success, isValid};
  }

export const createClienteObraSocialCustomValidator = (_clienteOS:{
  obraSocial: {id: number| undefined},
  numeroSocio: string
}[])=>{
  const isValidArray = _clienteOS.map(_os=>({
      obraSocial: Boolean(_os.obraSocial.id),
      numeroSocio: Boolean(_os.numeroSocio.trim().length > 0)
  }))
  const success = _clienteOS.length > 0 && isValidArray.every(isValid =>
    Object.values(isValid).every(Boolean)
  );
  return {success, isValid: isValidArray}
}


export type NewClienteType = {
  nroDocumento: number| undefined,
  tipoDocumento: TipoDocumento| undefined,
  categoriaFiscal: CondicionIva| undefined,
  nombre: string | undefined, 
  apellido: string | undefined, 
  email: string | undefined, 
  sexo:  string| undefined, 
  telefono: string | undefined, 
  domicilio: string | undefined, 
  fechaNac: Date | undefined, 
  observaciones: string | undefined, 
  localidad: { id: number| undefined}
}