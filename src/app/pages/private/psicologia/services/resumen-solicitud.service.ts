import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { PATH_SERVER } from '../../../../constants';
import { ResponseInterface } from '../../../../interfaces/response.interface';

@Injectable({
  providedIn: 'root',
})
export class ResumentCasoPsicologiaService {
  private api = PATH_SERVER;

  constructor(private http: HttpClient) {}

  /**
   * @description obtiene las solicitudes que se encuentren en estados de atención psicologica
   * @returns solicitudes de servicio
   */
  public getDetallesCiudadanoAccionante(
    id_solicitud: number | string
  ): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(
        `${this.api}/EvaluacionPsicologica/ObtenerAccionante/${id_solicitud}`
      )
      .pipe(take(1));
  }
}
