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