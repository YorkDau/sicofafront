import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PATH_SERVER } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { IUsuario } from '../../interfaces/usuario.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private api = PATH_SERVER;

  constructor(private http: HttpClient) {}

  public registrarUsuario(request: IUsuario): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}/Usuario/CrearUsuario`,request
    );
  }

  public validUsuario(parametros: any): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/Solicitud/consultarNumeroDocumentoCiudadano`,
      {
        params: parametros,
      }
    );
  }

  public getUsuario(data: FormData): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}/Usuario/consultarUsuario`,
      data
    );
  }

}
