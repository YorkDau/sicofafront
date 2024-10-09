import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PATH_SERVER } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ComisariaService {
  private api = PATH_SERVER;

  constructor(private http: HttpClient) {}

  /**
   * @description llama servicio insertar comisarías
   * @param objComisaria objeto a insertar
   * @returns observable
   */
  public iniciarComisaria(objComisaria: any): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}/Comisaria/IniciarComisaria`,
      objComisaria
    );
  }

  /**
   * @description llama servicio actualiza comisarías
   * @param objComisaria objeto a editar
   * @returns observable
   */
  public actualizarComisaria(
    objComisaria: FormData
  ): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}/Comisaria/ActualizarComisaria`,
      objComisaria
    );
  }

  /**
   * @description llama servicio que devuelve el total de las comisarias en el sistema
   * @param objConsulta formulario
   * @returns observable
   */
  public consultarComisaria(
    objConsulta: FormData
  ): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}/Comisaria/ConsultarComisaria`,
      objConsulta
    );
  }

  /**
   * @description llama servicio que consultael usuario de la comisaría
   * @param idUsuario id del usuario
   * @returns observable
   */
  public consultarUsuarioComisaria(
    idUsuario: number
  ): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/Comisaria/ConsultarUsuarioComisaria?idComisaria=${idUsuario}`
    );
  }
}
