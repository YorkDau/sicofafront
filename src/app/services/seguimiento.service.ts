import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PATH_SERVER } from '../constants';
import { ResponseInterface } from '../interfaces/response.interface';
import { CerrarActuacionesInterface } from '../interfaces/shared.interfaces';
import { PostTablaSeguimiento } from '../pages/private/interfaces/seguimiento.interface';
import { listaMedidasInterface } from '../shared/seguimiento/interfaces/medidas.interface';

@Injectable({
  providedIn: 'root',
})
export class SeguimientoService {
  private api = PATH_SERVER;

  constructor(private http: HttpClient) {}

  /**
   * @description llama servicio para consultar los seguimientos
   * @returns observable
   */
  public getSeguimientos(
    filtros: PostTablaSeguimiento
  ): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}/Seguimientos/ConsultarListaSeguimientos`,
      filtros
    );
  }

  /**
   * @description llama servicio para consultar las solicitudes por tipo de documento y numero de documento
   * @param tipoDocumento tipo de documento de la persona
   * @param numeroDocumento numero de documento de la persona
   * @returns observable
   */
  public getCodigoSolicitudesPorPersona(
    tipoDocumento: string,
    numeroDocumento: string
  ): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/Seguimientos/ListaCodigosServicio/${tipoDocumento}/${numeroDocumento}`
    );
  }

  /**
   * @description llama servicio para consultar los seguimientos
   * @param idSolicitud id de la solicitud
   * @returns observable
   */
  public postCrearRegistroTarea(
    idSolicitud: number
  ): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}/Seguimientos/IniciarProcesoSeguimiento`,
      {
        idSolicitud,
      }
    );
  }


  /**
   * @description llama el servicio para obtener la lista de formatos de seguimiento
   * @param idInvolucrado idTarea
   * @rerturn observable
   */
   public getListaFormatosSeguimiento(
    idInvolucrado: number,
    idTarea: number): Observable<ResponseInterface>{
      return this.http.get<ResponseInterface>(
        `${this.api}/Seguimientos/RemisionesSeguimientosPorInvolucradoTarea/${idInvolucrado}/${idTarea}`
      );
  }

  /**
   * @description llama al servicio que obtiene los datos de la tabla de seguimiento
   * @param idSolicitud
   * @param idTarea
   * @return observable
   */

  public getTablaSeguimiento(
    idTarea: number | null | undefined,
    idSolicitud: number
  ): Observable<ResponseInterface>{
    return this.http.get<ResponseInterface>(
      `${this.api}/Seguimientos/RemisionesSeguimientosPorTarea/${idTarea}/${idSolicitud}`
    );
  }

  /**
   * @description Servicio para que obtiene la informacion necesaria para los formatos de seguimiento
   * @param idSolicitud
   * @param nombreFormato
   * @param idInvolucrado
   * @return observable
   */

  public getInformacionInvolucrado(
    idSolicitud: number,
    nombreFormato: string,
    idInvolucrado: number
  ): Observable<ResponseInterface>{
    return this.http.get<ResponseInterface>(
      `${this.api}/Seguimientos/ReportesSeguimientos/${idSolicitud}/${nombreFormato}/${idInvolucrado}`
    );
  }

/**
 * @description servicio para traer las medidas de atencion proteccion y estabilizacion con el id de solicitud
 * @param idSolicitud
 * @returns obvserbable
 */

  public getMedidasEjecutadas(
    idSolicitud: number,
    idUsuario: number,
  ):Observable<ResponseInterface>{
    return this.http.get<ResponseInterface>(
      `${this.api}/Seguimientos/ListarMedidasSeguimiento/${idSolicitud}/${idUsuario}`
    );
  }

  public getMedidasEjecutadasPard(
    idSolicitud: number,
    idUsuario: number,
  ):Observable<ResponseInterface>{
    return this.http.get<ResponseInterface>(
      `${this.api}/Seguimientos/ListarMedidasSeguimientoPard/${idSolicitud}/${idUsuario}`
    );
  }

  public guardarMedidasSeguimiento(
    objMedidas: listaMedidasInterface
  ): Observable<ResponseInterface>{
    return this.http.post<ResponseInterface>(
      `${this.api}/Seguimientos/GuardarMedidasSeguimiento`,
      objMedidas
    );
  }
  /**
   * @description Cerrar actuaciones de la tarea
   * @param body
   * @returns observable
   */
   public cerrarActuaciones(
    body: CerrarActuacionesInterface
  ): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}/Seguimientos/CerrarActuaciones`,
      body
    );
  }

  /**
   * @description Cerrar actuaciones de la tarea
   * @param body
   * @returns observable
   */
   public cerrarActuacionesPard(
    body: CerrarActuacionesInterface
  ): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}/Seguimientos/CerrarActuacionSeguimientoPard`,
      body
    );
  }


  public postActualizarTareaSeguimiento(
    idSolicitud: number,
    idTarea: number
  ): Observable<ResponseInterface>{
    return this.http.post<ResponseInterface>(
      `${this.api}/Seguimientos/ActualizaTareaSeguimiento`,
      {
        idSolicitud,
        idTarea,
      }
    );
  }
}
