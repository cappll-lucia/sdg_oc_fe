interface BaseEntity {
	id: number;
	createdAt: string;
	updatedAt: string;
}

export interface Cliente extends BaseEntity {
    dni: string , 
    nombre: string , 
    apellido: string , 
    email: string , 
    sexo:  string, 
    telefono: string , 
    domicilio: string , 
    fechaNac: Date , 
    observaciones: string , 
}

export interface RecetaRecetados extends BaseEntity{
    fecha: Date,
    oftalmologo: string,
    tipo: string,
    nro1: number,
    nro2: number,
    odEsf:  number,
    odCil:  number,
    odA: number,
    oiEsf: number ,
    oiCil:  number,
    oiA: number,
    dnp1: number,
    dnp2: number,
    diametro:  number,
    cristal: string,
    color: string ,
    armazon: string,
    tratamiento: string,
    observaciones: string,
}

export interface RecetaContacto extends BaseEntity {
    oftalmologo: string;
    fecha: Date,
    queratometriaOd1: number;
    quetM1Od: number;
    quetM2Od: number;
    quetM1Oi: number;
    quetM2Oi: number;
    observacionQueratometria: string;
    parpado: boolean;
    maquillaje: boolean;
    tonicidad: boolean;
    hendiduraPalpebral: boolean;
    alturaPalpebral: boolean;
    buenParpadeoRitmo: boolean;
    buenParpadeoAmplitud: boolean;
    estesiometria: string;
    odCb: number;
    odEsferico: number;
    odCilindrico: number;
    odEje: number;
    odDiametro: number;
    oiCb: number;
    oiEsferico: number;
    oiCilindrico: number;
    oiEje: number;
    oiDiametro: number;
    marca: string;
    observaciones: string;
    pruebas: Prueba[]; 
}

export interface Prueba extends BaseEntity {
    idRecetaLentesContacto: number; 
    numeroPrueba: number;
    odDiametro: number;
    odEje: number;
    odCilindrico: number;
    odEsferico: number;
    odCb: number;
    oiDiametro: number;
    oiEje: number;
    oiCilindrico: number;
    oiEsferico: number;
    oiCb: number;
}

export interface HistoriaClinicaContacto extends BaseEntity {
    patologicos: boolean;
    traumaticos: boolean;
    sensLuzNatural: boolean;
    sensLuzArtificial: boolean;
    sensHumo: boolean;
    sensFrio: boolean;
    sensPolvo: boolean; 
    observacionesSens: string; //
    trastornosNeurologicos: boolean;
    regimenEventual: boolean;
    glandulasEndocrinas: boolean;
    sistemaCardiovascular: boolean;
    embarazo: boolean;
    estomatologia: boolean;
    caries: boolean;
    digestivos: boolean;
    alergiaDigestiva: boolean;
    alergiaRespiratoria: boolean;
    alergiaCutanea: boolean;
    alergiaOtras: boolean;
    rinitisPrimaveral: boolean;
    sinusitisCronica: boolean;
    observacionesAntecedentes: string; //
    antibioticos: boolean;
    antiestaminicos: boolean;
    piladoraContraceptiva: boolean;
    anorexigenos: boolean;
    neurolepticos: boolean;
    tratamientoDigestivo: boolean;
    diureticos: boolean;
    tranquilizantes: boolean;
    corticoides: boolean;
    porosimpaticoliticos: boolean;
    observacionesTratamientos: string;
}


export interface ClienteConReceta extends BaseEntity{
    dni: string , 
    nombre: string , 
    apellido: string , 
    email: string , 
    sexo:  string, 
    telefono: string , 
    domicilio: string , 
    fechaNac: Date , 
    observaciones: string ,
    recetasRecetados: RecetaRecetados[],
    historiaClinicaContacto: HistoriaClinicaContacto | undefined,
    recetasContacto: RecetaContacto[] 
}


export interface Audiometria extends BaseEntity{
    pdfUrl: string | undefined,
    observaciones: string,
    fechaInforme: Date
}


export interface ClienteConAudiometria extends BaseEntity{
    dni: string , 
    nombre: string , 
    apellido: string , 
    email: string , 
    sexo:  string, 
    telefono: string , 
    domicilio: string , 
    fechaNac: Date , 
    observaciones: string ,
    audiometrias: Audiometria[] 
}

export interface Marca extends BaseEntity {
    nombre: string;
}

export interface Proveedor extends BaseEntity {
    cuit: string;
    razonSocial: string;
    email: string;
    telefono: string;
}

export interface Producto extends BaseEntity {
    nombre: string;
    descripcion: string;
    categoria: string; 
    precio: number;
    stock: number;
    marca: Marca;
    proveedor: Proveedor; 
}
