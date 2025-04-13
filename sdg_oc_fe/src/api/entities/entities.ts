import { UUID } from "crypto";
import type { Marca } from "./marca";
import { Proveedor } from "./proveedor";

export interface BaseEntity {
	id: number;
	createdAt: string;
	updatedAt: string;
}

export interface BaseTransactionalEntity {
	id: UUID;
	createdAt: string;
	updatedAt: string;
}


