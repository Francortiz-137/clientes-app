import { Cliente } from "src/app/clientes/cliente";
import { ItemFactura } from "./item-factura";

export class Factura {

    id!: number;
    itemDescription!: string;
    observation!: string;
    items: ItemFactura[] = [];
    client!: Cliente;
    total!: number;
    createdAt!: string;
}
