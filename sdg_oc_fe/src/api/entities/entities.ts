import { UUID } from "crypto";

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


