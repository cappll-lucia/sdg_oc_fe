import { Cliente } from './clientes';
import type {BaseEntity} from  './entities'
import { PruebaLentesContacto } from './pruebasLentesContacto';


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