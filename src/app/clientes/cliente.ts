import { Factura } from "../factura/models/factura";
import { Region } from "./region";

export class Cliente {
    id!: number;
    name!: string;
    lastName!: string;
    createdAt!: string;
    email!: string;
    img!: string;
    region!: Region;
    facturas!: Factura[];
}
