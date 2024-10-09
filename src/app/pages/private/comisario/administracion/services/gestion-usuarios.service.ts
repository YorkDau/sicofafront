import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PATH_SERVER } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { crearUsuarioInterfce } from '../interfaces/gestion-usuarios.interface';

@Injectable({
  providedIn: 'root'
})
export class GestionUsuariosService {
  private api = PATH_SERVER;

  constructor(private http: HttpClient) { }

  /**
   * @descripition llama a un servicio para traer la lista de los perfiles existentes
   * @returns Observable
   */
  public getListaPerfiles(): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/Login/ListaPerfiles`
    );
  }

  /**
   * @description llama a un servicio para la creación de un nuevo usuario
   * @param objetoUsuario 
   * @returns 
   */
  public postCrearUsuario(
    objetoUsuario: crearUsuarioInterfce
  ): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}/Usuario/CrearUsuario`,
      objetoUsuario
    );
  }

  /**
   * @description llama a un servicio para traer la lista de usarios existente
   * @returns observable
   */
  public listaUsuarios(): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/Usuario/ListarUsuarios`
    );
  }

  /**
 * @description llama a un servicio para traer la lista de usarios existente
 * @param idComisaria
 * @returns observable
 */
  public listaUsuariosConId(idComisaria: number | undefined): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/Usuario/ListarUsuarios/${idComisaria}`
    );
  }

  /**
   * @description llama a un servicio que trae la informacion del usuario 
   * @param idUsuario 
   * @returns observable
   */
  public UsuarioEspecifico(
    idUsuario: number
  ): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/Usuario/GetUsuario/${idUsuario}`
    );
  }

  public actualizarUsuario(
    objetoUsuario: crearUsuarioInterfce
  ): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}/Usuario/ActualizarUsuarios`,
      objetoUsuario
    );
  }
}
