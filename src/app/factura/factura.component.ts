import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, startWith, map, filter, flatMap, mergeMap } from 'rxjs';
import { ClienteService } from '../clientes/cliente.service';
import { Factura } from './models/factura';
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
}


