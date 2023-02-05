import { Producto } from "./producto";

export class ItemFactura {
    product!: Producto;
    amount: number = 1 ;
    subTotal!: number;

    constructor(){}

    public calcularImporte(): number{
        return this.amount * this.product.price;
    }
}
