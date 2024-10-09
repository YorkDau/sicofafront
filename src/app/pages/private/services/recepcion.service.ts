import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PATH_SERVER } from 'src/app/constants';
import { ResponseInterface } from '../../../interfaces/response.interface';
import { RecepcionCitaFilter } from '../recepcion/interfaces/recepcion.interfaces';

@Injectable({
  providedIn: 'root',
})
export class RecepcionService {
  private api = PATH_SERVER;

  constructor(private http: HttpClient) { }

  /**
   * @description obtiene las solicitudes del ciudadano a partir de su id.
   * @returns solicitudes de servicio del ciudadano
   */
  public getCitas(body: RecepcionCitaFilter): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(`${this.api}/Solicitud/consultarCitas`, body);
  }



}
