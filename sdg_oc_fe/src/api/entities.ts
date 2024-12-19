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

export interface ClienteConRecetaRecetados extends BaseEntity{
    dni: string , 
    nombre: string , 
    apellido: string , 
    email: string , 
    sexo:  string, 
    telefono: string , 
    domicilio: string , 
    fechaNac: Date , 
    observaciones: string ,
    recetasRecetados: RecetaRecetados[] 
}
