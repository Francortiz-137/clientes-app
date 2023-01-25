import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Region } from './region';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit{
  
protected cliente: Cliente = new Cliente();
protected titulo: string = "Crear Cliente";
protected errores: string[] = [];
protected regiones: Region[] =[];
  ngOnInit(): void {
    this.cargarCliente()
  }

  constructor(private clienteService: ClienteService,private router:Router
    ,private activatedRoute: ActivatedRoute) {}

  cargarCliente(): void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.clienteService.getCliente(id).subscribe(
          (cliente) => this.cliente = cliente
        )
      }
    })
    this.clienteService.getRegiones().subscribe(
      regiones => this.regiones = regiones
    );
  }

  public create(): void{
    console.log("Clicked!")
    console.log(this.cliente)
    this.clienteService.create(this.cliente)
    .subscribe({
        next: cliente => {
          this.router.navigate(['/clientes'])
          Swal.fire('Nuevo Cliente',`El cliente: ${cliente.name} ha sido creado con exito!`,'success')
      }, 
      error: err=>{
        this.errores = err.error.errors as string[];
        console.error('Codigo de error del backend: ' + err.status);
        console.error(err.error.errors);
      }}
    )
  }

  update():void{
    console.log(this.cliente);
    this.clienteService.update(this.cliente)
    .subscribe( {
      next: cliente => {
        this.router.navigate(['/clientes'])
        Swal.fire('Cliente Actualizado', `El cliente: ${cliente.name} ha sido actualizado con exito`, 'success')
    }, 
    error: err=>{
      this.errores = err.error.errors as string[];
      console.error('Codigo de error del backend: ' + err.status);
      console.error(err.error.errors);
    }})
  }

  compararRegion(region1: Region, region2: Region): boolean {
    if (region1 === undefined && region2 === undefined) {
      return true;
    }
    return region1===null || region2===null|| region1===undefined || region2===undefined? false : region1.id===region2.id;
  }
}
