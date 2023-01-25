import { Component } from '@angular/core';
import { tap } from 'rxjs';
import Swal from 'sweetalert2';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './detalle/modal.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent{
  
  clientes!: Cliente[];
  paginador: any;
  clienteSeleccionado!: Cliente;

  constructor(private clienteService: ClienteService, private activatedRoute : ActivatedRoute, private modalService:ModalService) {}

  ngOnInit(){
    
    this.activatedRoute.paramMap.subscribe( params => {
      let page = +params.get('page')!;

      if(!page){
        page= 0;
      }

      this.clienteService.getClientes(page).pipe(
          tap(response => {
            console.log('ClientesComponent: tap 3');
            (response.content as Cliente[]).forEach(cliente => {
              console.log(cliente.name);
            })
          })
        ).subscribe(
          response => {
            this.clientes = response.content as Cliente[];
            this.paginador = response;
        });
      });

      this.modalService.notificarUpload.subscribe(cliente => {
        this.clientes = this.clientes.map(cliOriginal => {
          if(cliOriginal.id == cliente.id){
            cliOriginal.img = cliente.img;
          }
          return cliOriginal;
        })
      });
  }

  delete(cliente: Cliente): void{
    Swal.fire({
      title: "Are you sure",
      text: `Seguro que deseas eliminar al cliente ${cliente.name}`,
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "gray",
      cancelButtonColor: "red",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "No, cancel"
    }).then((result) => {
      if(result.value){
        this.clienteService.delete(cliente.id).subscribe(
          response =>{
            this.clientes = this.clientes.filter(cli => cli !== cliente)
            Swal.fire("Deleted","Your client has been deleted", "success"
            )
          });
      }
    });   
    
  }

  abrirModal(cliente: Cliente): void{
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }
}
