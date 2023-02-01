
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, tap, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Cliente } from './cliente';
import { Region } from './region';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api/clientes';

  constructor(private http: HttpClient, private router: Router) { }


  getRegiones(): Observable<Region[]>
  {
    return this.http.get<Region[]>(this.urlEndPoint + '/regiones')
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
    return this.http.post(this.urlEndPoint,cliente).pipe(
      map( (response: any) => response.cliente as Cliente),
      catchError(e=> {

        if(e.status == 400){
          return throwError(()=> e);
        }

        if(e.error.mensaje){
          console.error(e.error.mensaje);
        }
          return throwError(()=> e);
      })
    )
  }

  getCliente(id: number): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
          if(e.status != 401 && e.error.mensaje){
            this.router.navigate(['/clientes'])
            console.error(e.error.mensaje);
          }
            
          return throwError(() => e);
        })
    )
  }

  update(cliente: Cliente): Observable<any>{
    return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`,cliente).pipe(
      catchError(e=> {
      
        if(e.status == 400){
          return throwError(()=> e);
        }
        if(e.error.mensaje){
          console.error(e.error.mensaje);
        }
          return throwError(() => e);
      })
    )
  }

  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`)
    
  }

  uploadImg(archivo: File, id: number): Observable<HttpEvent<unknown>>{
    let formData = new FormData();
    formData.append("archivo",archivo);
    formData.append("id", id.toString());

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData,{
        reportProgress: true
    });

    return this.http.request(req);

  }
}