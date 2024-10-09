import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PATH_SERVER } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';

@Injectable({
  providedIn: 'root',
})
export class SolicitudService {
  private api = PATH_SERVER;

  constructor(private http: HttpClient) { }

  /**
   * @description obtiene la informacion del select de entidad.
   * @returns observable
   */
  public getEntidades(): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/Solicitud/ObtenerEntidadesExternas`
    );
  }

  /**
   * @description obtiene la informacion del select de comisaria por municipio.
   * @param idMunicipio id del municipio
   * @returns observable
   */
  public getComisariaMunicipio(
    idMunicipio: number
  ): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/Solicitud/ComisariasPorMunicipio/${idMunicipio}`
    );
  }


  /**
  * @description obtiene la informacion del select de comisaria sin filtros.
  * @returns observable
  */
  public getComisariaTraslado(
    idComisaria: number | undefined
  ): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/Solicitud/ObtenerComisariasTraslado/${idComisaria}`
    );
  }

  /**
  * @description obtiene la informacion la remisión.
  * @param idSolicitudServicio
  * @returns observable
  */
  public getInformacionRemision(
    idSolicitudServicio: number
  ): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/Solicitud/ObtenerRemisionSolicitudServicio/${idSolicitudServicio}`
    );
  }


}
