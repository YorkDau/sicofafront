import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PATH_SERVER } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { CiudadanoCompletoInterface } from '../../interfaces/ciudadano.interface';

@Injectable({
  providedIn: 'root',
})
export class CiudadanoService {
  private api = PATH_SERVER;

  constructor(private http: HttpClient) { }

  /**
   * @description llama servicio consultar ciudadano
   * @param data formdata
   * @returns observable
   */
  public getCiudadanos(data: FormData): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}/Solicitud/consultarCiudadanos`,
      data
    );
  }

  /**
   * @description llama servicio que consulta al ciudadano para validar si existe en la bd
   * @param numeroDocumento numero del documetno
   * @param idtipoDocumento tipo de documetno
   * @returns observable
   */
  public validCiudadano(parametros: {
    numeroDocumento: string;
    idtipoDocumento: string;
  }): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/Solicitud/consultarNumeroDocumentoCiudadano`,
      {
        params: parametros,
      }
    );
  }

  /**
   * @description llama servicio para insertar al ciudadano
   * @param parametros toda la informacion del ciudadano
   * @returns observable
   */
  public registrarCiudadano(
    parametros: CiudadanoCompletoInterface
  ): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}/Solicitud/registrarCiudadano`,
      parametros
    );
  }

  /**
   * @description obtiene la informacion del ciudadano a partir de un id.
   * @param id_ciudadano id ciudadano en cuestion
   * @returns informacion del ciudadano
   */
  public getCiudadano(id_ciudadano: number): Observable<any> {
    if (!id_ciudadano) {
      throw new Error('Se requiere la identificacion del ciudadano');
    }
    return this.http.get<any>(
      `${this.api}/Solicitud/ObtenerCiudadano/${id_ciudadano}`
    );
  }

  /**
   * @description obtiene las solicitudes del ciudadano a partir de su id.
   * @param id_ciudadano id ciudadano en cuestion
   * @param idComisaria id de la comisaria
   * @returns solicitudes de servicio del ciudadano
   */
  public getSolicitudesCiudadano(id_ciudadano: number, idComisaria: number | undefined): Observable<any> {
    if (!id_ciudadano) {
      throw new Error('Se requiere la identificacion del ciudadano');
    }
    return this.http.get<any>(
      `${this.api}/Solicitud/ObtenerSolicitudes/${id_ciudadano}/${idComisaria}`
    );
  }

  /**
   * @description obtiene el detalle de la solicitud a partir de su id.
   * @param id_solicitud id de la solicitud
   * @returns detalles de la solicitud
   */
  public getSolicitudDetalle(id_solicitud: number): Observable<any> {
    if (!id_solicitud) {
      throw new Error('Se requiere el numero de solicitud');
    }
    return this.http.get<any>(
      `${this.api}/Solicitud/ObtenerSolicitudDetalle/${id_solicitud}`
    );
  }

  /**
   * @description obtiene la informacion del ciudadano a partir de su id.
   * @param idCiudadano id del ciudadano
   * @returns observable
   */
  public cargarEditCiudadano(
    idCiudadano: number
  ): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/Solicitud/cargarDatosCiudadanoEditar?idCiudadano=${idCiudadano}`
    );
  }

  /**
   * @description llama servicio que edita la informacion del ciudadano
   * @param parametros informacion del ciudadano
   * @returns observable
   */
  public editCiudadano(
    parametros: CiudadanoCompletoInterface
  ): Observable<ResponseInterface> {
    return this.http.put<ResponseInterface>(
      `${this.api}/Solicitud/editarCiudadano`,
      parametros
    );
  }

  /**
   * @description obtiene la informacion del select de discapacidad.
   * @returns observable
   */
  public getDiscapacidades(): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/Solicitud/ObtenerTipoDiscapacidad`
    );
  }

  /**
  * @description Cambia el estado de las citas del ciudadano a Atendidas.
  * @param idCiudadano id ciudadano en cuestion
  * @returns ResponseInterface
  */
  public setCitaAtendida(idCiudadano: number): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(`${this.api}/Cita/AtenderCita`, { idCiudadano });
  }
}
