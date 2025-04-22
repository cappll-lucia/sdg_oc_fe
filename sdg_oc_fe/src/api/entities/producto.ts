import { BaseEntity } from "./entities";
import { Marca } from "./marca";
import { Proveedor } from "./proveedor";

export enum CategoriaEnum {
  LENTES_DE_SOL = 'LENTES DE SOL',
  LENTES_DE_CONTACTO = 'LENTES DE CONTACTO',
  FOTOGRAFIA = 'FOTOGRAFIA',
  AUDIOLOGIA = 'AUDIOLOGIA',
  LENTES_AEREOS = 'LENTES AEREOS',
  CRISTALES = 'CRISTALES',
  OTROS = 'OTROS',
}


export interface Producto extends BaseEntity{
    descripcion: string,
    codProv: string,
    precioLista: number,
    precio: number,
    stock: number,
    categoria: CategoriaEnum,
    marca: Marca,
    proveedor: Proveedor
}


export type NewProductoType = {
    codProv: string,
    descripcion: string|undefined,
    precio: number,
    precioLista: number,
    categoria: CategoriaEnum|undefined,
    marca: {id: number|undefined},
    proveedor: {id: number|undefined},
}