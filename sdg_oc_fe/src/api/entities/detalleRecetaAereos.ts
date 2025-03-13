import { TipoReceta } from "./recetasAereos";

export interface DetalleRecetaAereos {
    numeroDetalle: number;
    tipo_detalle: TipoReceta;
    od_esferico: number;
    od_cilindrico: number;
    od_grados: number;
    oi_esferico: number;
    oi_cilindrico: number;
    oi_grados: number;
    dnp: number;
}

export const createDetalleAereosCustomValidator = (_detalle:{
  tipo_detalle: TipoReceta,
  od_esferico: number | undefined, 
  od_cilindrico: number | undefined, 
  od_grados: number | undefined, 
  oi_esferico: number | undefined, 
  oi_cilindrico: number | undefined, 
  oi_grados: number | undefined, 
  dnp: number | undefined 
}) =>{
  const isTipoDetalleValid = Object.keys(TipoReceta).includes(_detalle.tipo_detalle);
  const validateEsferico = (value: number | undefined) => value !== undefined && value >= -35 && value <= 35;
  const validateCilindrico = (value: number | undefined) => value !== undefined && value >= -10 && value <= 10;
  const validateGrados = (value: number | undefined) => value !== undefined && value >= 0 && value <= 180;

  const isValid = {
    tipo_detalle: isTipoDetalleValid,
    od_esferico: validateEsferico(_detalle.od_esferico),
    od_cilindrico: validateCilindrico(_detalle.od_cilindrico),
    od_grados: validateGrados(_detalle.od_grados),
    oi_esferico: validateEsferico(_detalle.oi_esferico),
    oi_cilindrico: validateCilindrico(_detalle.oi_cilindrico),
    oi_grados: validateGrados(_detalle.oi_grados),
    dnp: Boolean(_detalle.dnp)
  };
  const success = Object.values(isValid).every(Boolean);
  return {success, isValid};
}


export type NewDetalleType = {
  tipo_detalle: TipoReceta,
  od_esferico: number | undefined, 
  od_cilindrico: number | undefined, 
  od_grados: number | undefined, 
  oi_esferico: number | undefined, 
  oi_cilindrico: number | undefined, 
  oi_grados: number | undefined, 
  dnp: number | undefined 
}
