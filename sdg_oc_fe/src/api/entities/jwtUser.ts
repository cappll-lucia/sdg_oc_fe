import { BaseEntity } from "./entities";

export interface JwtUser extends BaseEntity {
	username: string;
	password: string;
    nombre: string;
	role: string;
}