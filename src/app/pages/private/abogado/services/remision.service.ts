import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PATH_SERVER } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';

@Injectable({
  providedIn: 'root',
})
export class RemisionService {
  private api = PATH_SERVER;

  constructor(private http: HttpClient) {}

  /**
   * @description llama servicio obtener las remisiones de la tabla por solicitud
   * @param idSolicitud id de la solicitud
   * @returns Observable
   */
  public getTablaRemisiones(
    idSolicitud: number,
  ): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/Abogado/RemisionesAsociadasPorSolicitud/${idSolicitud}`
    );
  }

  /**
   * @description llama servicio obtener involucrados
   * @param idSolicitud id de la solicitud
   * @returns Observable
   */
  public getInvolucrados(idSolicitud: number): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/Abogado/ObtenerListaInvolucrados/${idSolicitud}`
    );
  }

  /**
   * @description llama servicio obtener las remisiones disponibles del involucrado
   * @param idInvolucrado id del involucrado
   * @returns Observable
   */
  public getRemisionesDisponibles(
    idInvolucrado: number,
  ): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/Abogado/RemisionesDisponiblesPorInvolucrado/${idInvolucrado}/`
    );
  }

  /**
   * @description llama servicio obtener informacion para el documento a generar
   * @param idSolicitud id de la solicitud
   * @param idInvolucrado id del involucrado
   * @param nombreRemision nombre de la remision a generar
   * @returns Observable
   */
  public getGenerarRemisionReporte(
    idSolicitud: number,
    idInvolucrado: number,
    nombreRemision: string
  ): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/Abogado/GenerarRemision/${idSolicitud}/${idInvolucrado}/${nombreRemision}`
    );
  }
}
