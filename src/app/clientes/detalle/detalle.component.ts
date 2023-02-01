import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/usuarios/auth.service';
import Swal from 'sweetalert2';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from './modal.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit{
  
  @Input() cliente!: Cliente;
  titulo:String = "Detalle de Cliente";
  protected fotoSeleccionada: File | null = null;
  progreso:number = 0;

  constructor(private clienteService: ClienteService, protected modalService:ModalService, protected authService:AuthService){  }
  ngOnInit(){
  }

  seleccionarFoto(event:any){
    this.fotoSeleccionada = event.target.files[0];
    this.progreso= 0;
     console.log(this.fotoSeleccionada);
     if(this.fotoSeleccionada && this.fotoSeleccionada.type.indexOf('image') < 0){
      Swal.fire( 'Error seleccionar imagen','No se puede seleccionar imagen!', 'error');
     }
  }

  subirFoto(){
    if(!this.fotoSeleccionada){
      Swal.fire('Error Uploading','Debe seleccionar una imagen','error');
    }else{

      this.clienteService.uploadImg(this.fotoSeleccionada, this.cliente.id).subscribe(
        (event) => {
          //this.cliente = cliente;
          if(event.type == HttpEventType.UploadProgress){
            this.progreso = Math.round(100 * event.loaded / event.total!);
          }else if(event.type == HttpEventType.Response){
            let response:any = event.body;
            this.cliente = response.cliente as Cliente;

            this.modalService.notificarUpload.emit(this.cliente);
            Swal.fire('La foto se ha subido exitosamente', response.mensaje,'success');
          }
        }
      );
    }
  }

  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }
}
