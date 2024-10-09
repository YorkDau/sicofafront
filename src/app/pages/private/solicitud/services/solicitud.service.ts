import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PATH_SERVER } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { SolicitudCiudadanoInterface } from '../../interfaces/solicitud.interface';

@Injectable({
  providedIn: 'root',
})
export class SolicitudService {
  private api = PATH_SERVER + '/Solicitud/';

  constructor(private http: HttpClient) {}

  /**
   * @description llama servicio
   * @param data form data
   */
  registrarInvolucrados(data: FormData): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}registroInvolucrado`,
      data
    );
  }

  /**
   * @description llama servicio consultar ciudadano involucrado
   * @param idCiudadano id ciudadano
   * @returns observable
   */
  consultaCiudadanoInvolucrado(
    idCiudadano: string
  ): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}ConsultaInvolucradoPrincipal/${idCiudadano}`
    );
  }

  /**
   * @description llama servicio de consecutivo de la solicitud
   * @param idComisaria se pasa el id de la comisaria que se obtiene en login
   * @returns observable
   */
  getSolicitudCiudadano(idComisaria: number): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}obtenerNumeroSolicitud?idComisaria=${idComisaria}`
    );
  }

  /**
   * @description llama servicio crear solicitud ciudadano involucrado
   * @param solicitud
   * @returns observable
   */
  crearSolicitudCiudadano(
    solicitud: SolicitudCiudadanoInterface
  ): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}crearSolicitudCiudadano`,
      solicitud
    );
  }


            /**
   * @description llama a un servicio para actualizar al ciudadano sin finalizar
   * @param solicitud
   * @returns observable
   */
    public actualizarSolicitudCiudadano(solicitud: SolicitudCiudadanoInterface): Observable<ResponseInterface> {
      return this.http.post<ResponseInterface>(
        `${this.api}ActualizarSolicitudCiudadano`,solicitud);
    }
}
