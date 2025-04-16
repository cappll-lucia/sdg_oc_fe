import { BaseEntity } from "./entities";
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
      nroDocumento: _newCliente.nroDocumento ? isValidNumber(_newCliente.nroDocumento) : false,
      tipoDocumento: _newCliente.tipoDocumento ? Object.values(TipoDocumento).includes(_newCliente.tipoDocumento) : false ,
      categoriaFiscal:  _newCliente.categoriaFiscal ? Object.values(CondicionIva).includes(_newCliente.categoriaFiscal) : false ,
      nombre: _newCliente.nombre ? _newCliente.nombre?.trim().length > 0 : false,
      apellido:  _newCliente.apellido ? _newCliente.apellido?.trim().length > 0 : false,
      email: emailValidator.safeParse(_newCliente.email).success,
      sexo: _newCliente.sexo ? ['Femenino', 'Masculino'].includes(_newCliente.sexo) :false,
      telefono: _newCliente.telefono? isValidNumber(_newCliente.telefono) : false,
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

export const editClienteCustomValidator = (_cliente: Cliente, _fecha : {
    day: string,
    month: string,
    year: string,
  })=>{
    const isValid = {
      nroDocumento: _cliente.nroDocumento ? isValidNumber(_cliente.nroDocumento) : false,
      tipoDocumento: _cliente.tipoDocumento ? Object.values(TipoDocumento).includes(_cliente.tipoDocumento) : false ,
      categoriaFiscal:  _cliente.categoriaFiscal ? Object.values(CondicionIva).includes(_cliente.categoriaFiscal) : false ,
      nombre: _cliente.nombre ? _cliente.nombre?.trim().length > 0 : false,
      apellido:  _cliente.apellido ? _cliente.apellido?.trim().length > 0 : false,
      email: emailValidator.safeParse(_cliente.email).success,
      sexo: _cliente.sexo ? ['Femenino', 'Masculino'].includes(_cliente.sexo) :false,
      telefono: _cliente.telefono? isValidNumber(_cliente.telefono) : false,
      domicilio: _cliente.domicilio ? _cliente.domicilio?.trim().length > 0 : false, 
      fechaNac: fechaValidator.safeParse(_fecha).success,
      localidad: _cliente.localidad ? Boolean(_cliente.localidad.id) : false,
    }
    const success = Object.values(isValid).every(Boolean);
    return {success, isValid};
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

export type EditedClienteType = {
  nroDocumento: number,
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
  localidad: { id: number| undefined}
}