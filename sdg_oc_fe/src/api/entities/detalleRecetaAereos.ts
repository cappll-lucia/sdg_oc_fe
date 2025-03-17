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
export const editDetalleAereosCustomValidator = (_detalle:EditedDetalleType | undefined) =>{
  const validateEsferico = (value:unknown) => isValidNumber(value) && value >= -35 && value <= 35;
  const validateCilindrico = (value:unknown) => isValidNumber(value) && value >= -10 && value <= 10;
  const validateGrados = (value:unknown) => isValidNumber(value) && value >= 0 && value <= 180;
  const validateDnp = (value:unknown) => isValidNumber(value) && value >= 0;
  const isValid = {
    tipo_detalle: _detalle ? Object.keys(TipoReceta).includes(_detalle.tipo_detalle) : false,
    od_esferico: _detalle ?  validateEsferico(_detalle.od_esferico) : false,
    od_cilindrico: _detalle ?  validateCilindrico(_detalle.od_cilindrico) : false,
    od_grados: _detalle ?  validateGrados(_detalle.od_grados) : false,
    oi_esferico: _detalle ?  validateEsferico(_detalle.oi_esferico) : false,
    oi_cilindrico: _detalle ?  validateCilindrico(_detalle.oi_cilindrico) : false,
    oi_grados: _detalle ?  validateGrados(_detalle.oi_grados) : false,
    dnp: _detalle ?  validateDnp(_detalle.dnp) : false
  };
  const success = Object.values(isValid).every(Boolean);
  return {success, isValid};
}

const isValidNumber = (value: unknown): value is number => {
  if (typeof value === "number") return true;
  if (typeof value === "string" && value.trim() !== "" && !isNaN(Number(value))) {
    return true;
  }
  return false;
};



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

export type EditedDetalleType = {
  tipo_detalle: TipoReceta,
  od_esferico: number | undefined, 
  od_cilindrico: number | undefined, 
  od_grados: number | undefined, 
  oi_esferico: number | undefined, 
  oi_cilindrico: number | undefined, 
  oi_grados: number | undefined, 
  dnp: number | undefined 
}
