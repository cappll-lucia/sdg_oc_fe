import { fechaValidator, isValidNumber } from '@/lib/utils';
import { Cliente } from './clientes';
import type {BaseEntity} from  './entities'
import { NewPruebasContactoType, PruebaLentesContacto } from './pruebasLentesContacto';


export interface RecetaContacto extends BaseEntity{
    cliente: Cliente;
    fecha: Date;
    oftalmologo: string;
    quet_m1_od: number;
    quet_m2_od: number;
    quet_m1_oi: number;
    quet_m2_oi: number;
    observaciones_queterometria: string;
    maquillaje: boolean;
    tonicidad: boolean;
    hendidura_palpebral: boolean;
    altura_palpebral: boolean;
    buen_parpadeo_ritmo: boolean;
    buen_parpadeo_amplitud: boolean;
    estesiometria: string;
    od_cb: number;
    od_esferico: number;
    od_cilindrico: number;
    od_eje: number;
    od_diametro: number;
    od_marca: number;
    oi_cb: number;
    oi_esferico: number;
    oi_cilindrico: number;
    oi_eje: number;
    oi_diametro: number;
    oi_marca: number;
    observaciones: string;
    pruebasLentesContacto: PruebaLentesContacto[];
}


export const recetaContactoCustomValidator = (_newReceta: {
    cliente: { id: undefined | number }
    oftalmologo: string | undefined;
    quet_m1_od: number | undefined;
    quet_m2_od: number | undefined;
    quet_m1_oi: number | undefined;
    quet_m2_oi: number | undefined;
    observaciones_queterometria: string | undefined;
    maquillaje: boolean;
    tonicidad: boolean;
    hendidura_palpebral: boolean;
    altura_palpebral: boolean;
    buen_parpadeo_ritmo: boolean;
    buen_parpadeo_amplitud: boolean;
    estesiometria: string | undefined;
    od_cb: number | undefined;
    od_esferico: number | undefined;
    od_cilindrico: number | undefined;
    od_eje: number | undefined;
    od_diametro: number | undefined;
    od_marca: number | undefined;
    oi_cb: number | undefined;
    oi_esferico: number | undefined;
    oi_cilindrico: number | undefined;
    oi_eje: number | undefined;
    oi_diametro: number | undefined;
    oi_marca: number | undefined;
    observaciones: string | undefined;
}, _fecha : {
    day: string,
    month: string,
    year: string,
  })=>{
    const validateEsferico = (value:unknown) => isValidNumber(value) && value >= -35 && value <= 35;
    const validateCilindrico = (value:unknown) => isValidNumber(value) && value >= -10 && value <= 10;
    const validateDiametro = (value:unknown) => isValidNumber(value) && value >= 0 && value <= 30;
    const validateCb = (value:unknown) => isValidNumber(value) && value >= 0 && value <= 20;
    const validateEje = (value:unknown) => isValidNumber(value) && value >= 0 && value <= 180;
    const validateQuet = (value:unknown) => isValidNumber(value) && value >= 0 && value <= 90;
    const isValid = {
        oftalmologo: Boolean(_newReceta.oftalmologo),
        quet_m1_od: validateQuet(_newReceta.quet_m1_od),
        quet_m2_od: validateQuet(_newReceta.quet_m2_od),
        quet_m1_oi: validateQuet(_newReceta.quet_m1_oi),
        quet_m2_oi: validateQuet(_newReceta.quet_m2_oi),
        estesiometria: _newReceta.estesiometria ? ["Hiperestésico", "Normoestésico", "Hipoestésico"].includes(_newReceta.estesiometria) : false,
        od_cb: validateCb(_newReceta.od_cb),
        od_esferico: validateEsferico(_newReceta.od_esferico),
        od_cilindrico: validateCilindrico(_newReceta.od_cilindrico),
        od_eje: validateEje(_newReceta.od_eje),
        od_diametro: validateDiametro(_newReceta.od_diametro),
        od_marca: Boolean(_newReceta.od_marca),
        oi_cb:validateCb( _newReceta.oi_cb),
        oi_esferico: validateEsferico(_newReceta.od_cilindrico),
        oi_cilindrico: validateCilindrico(_newReceta.oi_cilindrico),
        oi_eje: validateEje(_newReceta.oi_eje),
        oi_diametro: validateDiametro(_newReceta.oi_diametro),
        oi_marca: Boolean(_newReceta.oi_marca) ,
        fecha: fechaValidator.safeParse(_fecha).success,
        cliente: Boolean(_newReceta.cliente.id)
    }
    const success = Object.values(isValid).every(Boolean);
    return {success, isValid};

}

export type NewRecetaContactoType={
    cliente: {
        id: undefined | number
    },
    fecha: Date | undefined;
    oftalmologo: string | undefined,
    quet_m1_od: number | undefined,
    quet_m2_od: number | undefined,
    quet_m1_oi: number | undefined,
    quet_m2_oi: number | undefined,
    observaciones_queterometria: string | undefined,
    maquillaje: boolean;
    tonicidad: boolean;
    hendidura_palpebral: boolean;
    altura_palpebral: boolean;
    buen_parpadeo_ritmo: boolean;
    buen_parpadeo_amplitud: boolean;
    estesiometria: string | undefined,
    od_cb: number | undefined,
    od_esferico: number | undefined,
    od_cilindrico: number | undefined,
    od_eje: number | undefined,
    od_diametro: number | undefined,
    od_marca: number | undefined,
    oi_cb: number | undefined,
    oi_esferico: number | undefined,
    oi_cilindrico: number | undefined,
    oi_eje: number | undefined,
    oi_diametro: number | undefined,
    oi_marca: number | undefined,
    observaciones: string | undefined,
    pruebasLentesContacto: Array<NewPruebasContactoType>
}

export type EditedRecetaContactoType={
    id: number
    cliente: {
        id: number
    },
    fecha: Date,
    oftalmologo: string,
    quet_m1_od: number,
    quet_m2_od: number,
    quet_m1_oi: number,
    quet_m2_oi: number,
    observaciones_queterometria: string,
    maquillaje: boolean;
    tonicidad: boolean;
    hendidura_palpebral: boolean;
    altura_palpebral: boolean;
    buen_parpadeo_ritmo: boolean;
    buen_parpadeo_amplitud: boolean;
    estesiometria: string,
    od_cb: number,
    od_esferico: number,
    od_cilindrico: number,
    od_eje: number,
    od_diametro: number,
    od_marca: number,
    oi_cb: number,
    oi_esferico: number,
    oi_cilindrico: number,
    oi_eje: number,
    oi_diametro: number,
    oi_marca: number,
    observaciones: string | undefined,
    pruebasLentesContacto: Array<NewPruebasContactoType>
}