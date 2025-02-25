import { BaseEntity } from "./entities";
import { Marca } from "./marca";
import { Proveedor } from "./proveedor";

export enum CategoriaEnum {
  LENTES_DE_SOL = 'LENTES_DE_SOL',
  LENTES_DE_CONTACTO = 'LENTES_DE_CONTACTO',
  HANDBAGS = 'HANDBAGS',
  LENTES_AEREOS = 'LENTES_AEREOS',
  CRISTALES = 'CRISTALES',
  OTROS = 'OTROS',
}


export interface Producto extends BaseEntity{
    descripcion: string,
    precio: number,
    precioSugerido: number,
    stock: number,
    categoria: CategoriaEnum,
    marca: Marca,
    proveedor: Proveedor
}