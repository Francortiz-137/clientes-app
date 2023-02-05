import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute } from '@angular/router';
import { Observable, startWith, map, filter, flatMap, mergeMap } from 'rxjs';
import { ClienteService } from '../clientes/cliente.service';
import { Factura } from './models/factura';
import { ItemFactura } from './models/item-factura';
import { Producto } from './models/producto';
import { FacturaService } from './services/factura.service';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit{

  titulo: string = 'Nueva Factura';
  factura: Factura = new Factura();

  autocompleteControl = new FormControl('');
  productosFiltrados!: Observable<Producto[]>;


  constructor(private clienteService:ClienteService,
    private activatedRoute: ActivatedRoute,
    private facturaService: FacturaService){}

  ngOnInit(){
    this.activatedRoute.paramMap.subscribe(params => {
      let clienteId = Number(params.get('clienteId'));
      this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.client = cliente);
    });
    
    this.productosFiltrados = this.autocompleteControl.valueChanges.pipe(
      map( (value:string|Producto|null) => typeof value === 'string'? value: value?.name),
      mergeMap(value => value ? this._filter(value): []),
    );
  }

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturaService.filtrarProductos(filterValue);
  }

  protected mostrarNombre(producto?: Producto): string | undefined {
    return producto? producto.name : undefined
  }

  protected seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
    let producto = event.option.value as Producto;
    console.log(producto);

    if (this.existeItem(producto.id)) {
      this.incrementaCantidad(producto.id)
    }
    else {
      let nuevoItem = new ItemFactura();
      nuevoItem.product = producto;
      this.factura.items.push(nuevoItem);
    }

    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  protected actualizarCantidad(id: number, event:any):void {
    let cantidad: number = event.target.value as number;

    if (cantidad == 0) {
      return this.eliminarItemFactura(id);
    }

    this.factura.items = this.factura.items
    .map((item:ItemFactura) => {
      if(id === item.product.id){
        item.amount = cantidad;
      }
      return item;
    });
  }

  existeItem(id: number): boolean {
    let existe = false;
    
    this.factura.items.forEach((item:ItemFactura) => {
      if(id === item.product.id){
        existe = true;
      }
    });

    return existe;
  }

  incrementaCantidad(id: number): void {
    this.factura.items = this.factura.items
    .map((item:ItemFactura) => {
      if(id === item.product.id){
        item.amount++;
      }
      return item;
    });
  }

  eliminarItemFactura(id: number): void {
    this.factura.items = this.factura.items.filter((item:ItemFactura) => {(item:ItemFactura) => item.product.id!== id});
  }
}


