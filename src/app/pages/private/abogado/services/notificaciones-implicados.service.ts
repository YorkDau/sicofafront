import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { PATH_SERVER, TiposDocumentoCarga } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { CargaArchivoRemision } from '../../interfaces/tipo-remision.interface';

@Injectable({
  providedIn: 'root',
})
export class NotificacionesImplicadoService {
  private api = PATH_SERVER;

  constructor(private http: HttpClient) {}

  public consultar(
    idSolicitud: number,
    idTarea: number
  ): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(
        `${PATH_SERVER}/notificacion/NotificacionAsociada/${idSolicitud}/${TiposDocumentoCarga.NOTIFICACION_MEDIDA_PROTECCION}/${idTarea}`
      )
      .pipe(take(1));
  }

  public generarNotificacion(
    idSolicitud: number,
    idInvolucrado: number,
    idTarea: number
  ): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(
        `${PATH_SERVER}/notificacion/GenerarNotificacion/${idSolicitud}/${TiposDocumentoCarga.NOTIFICACION_MEDIDA_PROTECCION}/${idInvolucrado}/${idTarea}`
      )
      .pipe(take(1));
  }
  /**
   * Actualiza el archivo de la notificacion de implicados
   * @param archivo
   * @returns
   */
  public actualizarNotificacion(
    archivo: CargaArchivoRemision
  ): Observable<ResponseInterface> {
    return this.http
      .post<ResponseInterface>(
        `${PATH_SERVER}/File/ActualizarNotificacion`,
        archivo
      )
      .pipe(take(1));
  }
}
