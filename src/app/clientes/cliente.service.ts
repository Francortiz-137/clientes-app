import { formatDate, registerLocaleData } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of, pipe, tap, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import Swal from 'sweetalert2';
import { AuthService } from '../usuarios/auth.service';
import { Cliente } from './cliente';
import { Region } from './region';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api/clientes';

  private httpHeaders = new HttpHeaders({'Content-type': 'application/json'})

  constructor(private http: HttpClient, private router: Router,
   private authService: AuthService) { }

  private agregarAuthorizationHeader(){
    let token = this.authService.accessToken;

    if (token) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders
  }

  private isNoAuth(e: HttpErrorResponse ): boolean {
    if (e.status === 401 || e.status === 403) {
      if( e.status === 401){
        if (this.authService.isAuthenticated()) {
          this.authService.logout();
        }
        Swal.fire("Prohibido",`necesitas iniciar sesion para acceder a este recurso`,"warning");
        this.router.navigate(['/login']);
      }
      if( e.status === 403){
        Swal.fire("Acceso denegado",`${this.authService.usuario.username} no tienes acceso a este recurso`,"warning");
        this.router.navigate(['/clientes']);
      }
      return true;
    }
    return false;
  }

  getRegiones(): Observable<Region[]>
  {
    return this.http.get<Region[]>(this.urlEndPoint + '/regiones',{headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(e => {
        this.isNoAuth(e);
        return throwError(()=>e)
      })
    );
  }

  getClientes(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint+'/page/'+ page).pipe(
      tap((response:any) => {
        (response.content as Cliente[]).forEach( cliente => {
          console.log(cliente.name);
        })
      }),
      map((response:any) => {
        (response.content as Cliente[]).map(cliente => {
          cliente.name = cliente.name.toUpperCase();
          
        //  cliente.createdAt = formatDate(cliente.createdAt, 'EEEE dd, MMMM, yyyy', 'es')
          return cliente;
        });
        return response
      }),tap((response:any) => {
          (response.content as Cliente[]).forEach( cliente => {
          console.log(cliente.name);
        })
      })
    );
  }
   
  create(cliente: Cliente): Observable<Cliente>{
    return this.http.post(this.urlEndPoint,cliente,{headers: this.agregarAuthorizationHeader()}).pipe(
      map( (response: any) => response.cliente as Cliente),
      catchError(e=> {
        if (this.isNoAuth(e)) {
          return throwError(()=> e);
        }

        if(e.status == 400){
          return throwError(()=> e);
        }

        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(()=> e);
      })
    )
  }

  getCliente(id: number): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`,{headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(e => {
          if (this.isNoAuth(e)) {
            return throwError(()=> e);
          }
          this.router.navigate(['/clientes'])
          console.error(e.error.mensaje);
          Swal.fire('Error al editar', e.error.mensaje,'error');
          return throwError(() => e);
        })
    )
  }

  update(cliente: Cliente): Observable<any>{
    return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`,cliente,{headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(e=> {
        if (this.isNoAuth(e)) {
          return throwError(()=> e);
        }
        if(e.status == 400){
          return throwError(()=> e);
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => e);
      })
    )
  }

  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`,{headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(e=> {
        if (this.isNoAuth(e)) {
          return throwError(()=> e);
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => e);
      })
    )
  }

  uploadImg(archivo: File, id: number): Observable<HttpEvent<unknown>>{
    let formData = new FormData();
    formData.append("archivo",archivo);
    formData.append("id", id.toString());

    let httpHeaders = new HttpHeaders();
    let token = this.authService.accessToken;
    if(token){
      httpHeaders = httpHeaders.append('Authorization', 'Bearer'+ token);
    }

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData,{
        reportProgress: true,
        headers: httpHeaders
    });

    return this.http.request(req).pipe(
      catchError(e => {
        this.isNoAuth(e);
        return throwError(()=>e)
      })
    );

  }
}