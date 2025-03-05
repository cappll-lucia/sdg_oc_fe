import { BaseEntity } from "./entities";
import { Provincia } from "./provincia";

export interface Localidad extends BaseEntity {
    localidad: string,
    provincia: Provincia
}
