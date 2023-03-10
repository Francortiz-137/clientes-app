import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_BACKEND } from '../config/config';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private _accessToken: String | null = null;

  private _usuario: Usuario | null = null;
  
  constructor(private http:HttpClient) { }

  public get usuario(): Usuario {
    if(this._usuario != null) {
      return this._usuario;
    }else if(this._usuario == null && sessionStorage.getItem('usuario') != null) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')!) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  public get accessToken(): String| null {
    if(this._accessToken != null) {
      return this._accessToken;
    }else if(this._accessToken == null && sessionStorage.getItem('token') != null) {
      this._accessToken = sessionStorage.getItem('token');
      return this._accessToken;
    }
    return null;
  }
  login(usuario: Usuario):Observable<any>{
    const urlEndPoint: string = URL_BACKEND + '/oauth/token';

    const credenciales = window.btoa('angularApp'+':'+'12345');

    const httpHeaders = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded',
    'Authorization': 'Basic '+ credenciales});
    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);

    return this.http.post(urlEndPoint, params.toString(),{headers: httpHeaders})
  }

  guardarUsuario(accessToken: String):void{
    let payload = this.obtenerDataToken(accessToken);
    this._usuario = new Usuario();
    this._usuario.username = payload.user_name;
    this._usuario.password = payload.password;
    this._usuario.roles = payload.authorities;

    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  guardarToken(accessToken: String):void{
    console.log("token: "+ accessToken);
    this._accessToken = accessToken;
    sessionStorage.setItem('token', this._accessToken.toString());
  }

  obtenerDataToken(accessToken: String|null):any
  {
    if (accessToken != null) {
      return JSON.parse(window.atob(accessToken.split('.')[1]));
    }
    return null;
  
  }

  isAuthenticated():boolean{
    let payload = this.obtenerDataToken(this.accessToken);
    if(payload!= null && payload.user_name!= null && payload.user_name.length>0){ 
      return true;
    }
    return false;
  }

  logout():void{
   this._usuario = null;
   this._accessToken = null;
   sessionStorage.clear();
   sessionStorage.removeItem('usuario'); 
   sessionStorage.removeItem('token'); 
  }

  hasRole(role:string):boolean{
    if(this._usuario?.roles.includes(role))
    {
      return true;
    }
    return false;
  }
}
