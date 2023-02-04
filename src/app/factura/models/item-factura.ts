import { Producto } from "./producto";

export class ItemFactura {
    product!: Producto;
    amount: number = 1 ;
    subTotal!: number;
}
