import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { PATH_SERVER } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { ComisariaInterface } from '../interfaces/actualizacion-comisaria.interface';

@Injectable({
  providedIn: 'root',
})
export class ComisariaService {
  private api = PATH_SERVER;
  constructor(private http: HttpClient) {}

  /**
   * @description trae la información la comisaria especifica
   * @param idComisaria
   * @returns observable
   */
  public getInformacionComisaria(): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(`${this.api}/Comisaria/InformacionComisaria`)
      .pipe(take(1));
  }

  /**
   * @description trae la información del comisario y comisaria
   * @param idSolicitud
   * @returns observable
   */
  public getInformacionComisariaByID(idSolicitud: number,): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(`${this.api}/Comisaria/InformacionComisaria/${idSolicitud}`)
      .pipe(take(1));
  }


  /**
   * @description actualizacion de la informacion de la comisaria
   * @param body
   * @returns observable
   */
  public postActualizarComisaria(
    body: ComisariaInterface
  ): Observable<ResponseInterface> {
    return this.http
      .post<ResponseInterface>(
        `${this.api}/Comisaria/ActualizarComisaria`,
        body
      )
      .pipe(take(1));
  }
}
