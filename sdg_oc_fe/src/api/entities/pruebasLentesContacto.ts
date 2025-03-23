import { isValidNumber } from "@/lib/utils";

export interface PruebaLentesContacto {
    numeroPrueba: number;
    recetaLentesContactoId: number;
    od_diametro: number;
    od_eje: number;
    od_cilindrico: number;
    od_esferico: number;
    od_cb: number;
    od_marca: string;
    oi_diametro: number;
    oi_eje: number;
    oi_cilindrico: number;
    oi_esferico: number;
    oi_cb: number;
    oi_marca: string;
    confort: boolean;
    movilidad: boolean;
    centraje: boolean;
    hiperemia: boolean;
    agudeza_visual: boolean;
    oi_edema: boolean;
    od_edema: boolean;
    observaciones: string;
}

export const pruebaLentesContactoCustomValidator = (_pruebas: {
    od_diametro: number | undefined;
    od_eje: number | undefined;
    od_cilindrico: number | undefined;
    od_esferico: number | undefined;
    od_cb: number | undefined;
    od_marca: string;
    oi_diametro: number | undefined;
    oi_eje: number | undefined;
    oi_cilindrico: number | undefined;
    oi_esferico: number | undefined;
    oi_cb: number | undefined;
    oi_marca: string;
    confort: boolean;
    movilidad: boolean;
    centraje: boolean;
    hiperemia: boolean;
    agudeza_visual: boolean;
    oi_edema: boolean;
    od_edema: boolean;
    observaciones: string;
}[])=>{
    const validateEsferico = (value:unknown) => isValidNumber(value) && value >= -35 && value <= 35;
    const validateCilindrico = (value:unknown) => isValidNumber(value) && value >= -10 && value <= 10;
    const validateDiametro = (value:unknown) => isValidNumber(value) && value >= 0 && value <= 30;
    const validateCb = (value:unknown) => isValidNumber(value) && value >= 0 && value <= 20;
    const validateEje = (value:unknown) => isValidNumber(value) && value >= 0 && value <= 180;
        const isValidArray = _pruebas.map(_prueba => ({
        od_diametro: validateDiametro(_prueba.od_diametro),
        od_eje: validateEje(_prueba.od_eje),
        od_cilindrico: validateCilindrico(_prueba.od_cilindrico),
        od_esferico: validateEsferico(_prueba.od_esferico),
        od_cb: validateCb(_prueba.od_cb),
        oi_diametro: validateDiametro(_prueba.oi_diametro),
        oi_eje: validateEje(_prueba.oi_eje),
        oi_cilindrico: validateCilindrico(_prueba.oi_cilindrico),
        oi_esferico: validateEsferico(_prueba.oi_esferico),
        oi_cb: validateCb(_prueba.oi_cb),
    }));

    const success = isValidArray.every(isValid => 
        Object.values(isValid).every(Boolean)
    );

    return { success, isValid: isValidArray };
}

export type NewPruebasContactoType ={
    od_diametro: number | undefined,
    od_eje: number | undefined,
    od_cilindrico: number | undefined,
    od_esferico: number | undefined,
    od_cb: number | undefined,
    od_marca: string,
    oi_diametro: number | undefined,
    oi_eje: number | undefined,
    oi_cilindrico: number | undefined,
    oi_esferico: number | undefined,
    oi_cb: number | undefined,
    oi_marca: string,
    confort: boolean,
    movilidad: boolean,
    centraje: boolean,
    hiperemia: boolean,
    agudeza_visual: boolean,
    oi_edema: boolean,
    od_edema: boolean,
    observaciones: string,
}