import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Usuario } from './usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: []
})
export class LoginComponent implements OnInit {
   
  titulo: String = "Sign in!";
  usuario: Usuario;

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){
      Swal.fire('Login', `Hola ${this.authService.usuario.username} ya estas authenticado`, 'info');
      this.router.navigate(['/clientes']);
    }
  }

  constructor(private authService: AuthService, private router: Router){
    this.usuario = new Usuario();
  }

  login(): void{
    console.log(this.usuario);
    if (this.usuario.username == null || this.usuario.password == null){
      Swal.fire('Error login','Username o password vacias!','error');
    }
    
    this.authService.login(this.usuario).subscribe({
      next: (res)=> {
      
        console.log(res);
      
        let payload = JSON.parse(window.atob(res.access_token.split('.')[1]));

        console.log(payload);
        this.authService.guardarToken(res.access_token);
        this.authService.guardarUsuario(res.access_token);
        let usuario = this.authService.usuario;

        this.router.navigate(['/clientes']);
        Swal.fire('Login',`Hola ${usuario.username} Has iniciado sesion con exito`,'success');
    },
      error: (error) => {
        
        console.log(error);
        if (error.status == 400){ 
          Swal.fire('Error login','Usuario o contraseña incorrectos!','error');
        }
      }
    })
  }
}
