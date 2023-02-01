import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router:Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      let role = route.data['role'] as string;

      if(!this.authService.isAuthenticated()) {
        return false;
      }

      if(this.authService.hasRole(role)){
        return true;
      }
      Swal.fire('Acceso denegado',`${this.authService.usuario.username} no tienes acceso a este recurso`,'warning');
      this.router.navigate(['/clientes']);
      return false;
  }
  
}
