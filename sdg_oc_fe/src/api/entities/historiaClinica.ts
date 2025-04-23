import { Cliente } from "./clientes";
import { BaseEntity } from "./entities";

export interface HistoriaClinica extends BaseEntity{
    patologicas: boolean;
    traumaticas: boolean;
    sensLuzNatural: boolean;
    sensLuzArtificial: boolean;
    sensHumo: boolean;
    sensFrio: boolean;
    sensPolvo: boolean;
    observacionesSens: string;
    transtornosNeurologicos: boolean;
    regimenEventual: boolean;
    glandulasEndocinas: boolean;
    sistemaCardiovascular: boolean;
    embarazo: boolean;
    estomatologia: boolean;
    caries: boolean;
    digestivo: boolean;
    alergiaDigestiva: boolean;
    alergiaRespiratoria: boolean;
    alergiaCutanea: boolean;
    alergiaOtras: boolean;
    rinitisPrimaveral: boolean;
    sinusitisCronica: boolean;
    observacionesAntecedentes: string;
    antibioticos: boolean;
    antiestaminicos: boolean;
    pildoraContraceptiva: boolean;
    anorexigenos: boolean;
    neurolepticos: boolean;
    tratamientoDigestivo: boolean;
    dirueticos: boolean;
    tranquilizantes: boolean;
    corticoides: boolean;
    parasimpaticoliticos: boolean;
    cliente: Cliente
}

export type NewHistoriaClinicaType = {
    patologicas: boolean;
    traumaticas: boolean;
    sensLuzNatural: boolean;
    sensLuzArtificial: boolean;
    sensHumo: boolean;
    sensFrio: boolean;
    sensPolvo: boolean;
    observacionesSens: string;
    transtornosNeurologicos: boolean;
    regimenEventual: boolean;
    glandulasEndocinas: boolean;
    sistemaCardiovascular: boolean;
    embarazo: boolean;
    estomatologia: boolean;
    caries: boolean;
    digestivo: boolean;
    alergiaDigestiva: boolean;
    alergiaRespiratoria: boolean;
    alergiaCutanea: boolean;
    alergiaOtras: boolean;
    rinitisPrimaveral: boolean;
    sinusitisCronica: boolean;
    observacionesAntecedentes: string;
    antibioticos: boolean;
    antiestaminicos: boolean;
    pildoraContraceptiva: boolean;
    anorexigenos: boolean;
    neurolepticos: boolean;
    tratamientoDigestivo: boolean;
    dirueticos: boolean;
    tranquilizantes: boolean;
    corticoides: boolean;
    parasimpaticoliticos: boolean;
    cliente: {
        id: number|undefined
    }
}