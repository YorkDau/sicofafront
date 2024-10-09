import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { PATH_SERVER } from '../../../../constants';
import { ResponseInterface } from '../../../../interfaces/response.interface';
import { ActualizacionInvolucrado } from '../interfaces/actualizacion-involucrado.interface';
import { RespuestaTipoViolencia } from '../interfaces/involucrado.interface';
import { DescripcionHechosDTO } from '../interfaces/descripcion-hechos.interface';
import { CierreTarea } from '../../../../interfaces/cierre-tarea.interface';
import { RegistrarRecomendacionesValoracionRiesgo } from '../../interfaces/psicologia.interface';

@Injectable({
  providedIn: 'root',
})
export class IdentificacionDelRiesgoService {
  private api = PATH_SERVER;

  constructor(private http: HttpClient) {}

  /**
   * @description actualiza la informacion del involucrado
   * @returns observable
   */
  public postActualizarInvolucrado(
    body: ActualizacionInvolucrado
  ): Observable<ResponseInterface> {
    return this.http
      .post<ResponseInterface>(
        `${this.api}/EvaluacionPsicologica/ActualizarVictima`,
        body
      )
      .pipe(take(1));
  }

  /**
   * @description obtiene la información del involucrado víctima principal
   * @returns : Observable<ResponseInterface>
   */
  public getInvolucradoVictima(
    id_solicitud: number | string
  ): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(
        `${this.api}/EvaluacionPsicologica/ObtenerInvolucrado/${id_solicitud}?esvictima=true&principal=true`
      )
      .pipe(take(1));
  }

  /**
   * @description obtiene la información del involucrado victimario principal
   * @returns : Observable<ResponseInterface>
   */
  public getInvolucradoAgresor(
    id_solicitud: number | string
  ): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(
        `${this.api}/EvaluacionPsicologica/ObtenerInvolucrado/${id_solicitud}?esvictima=false&principal=true`
      )
      .pipe(take(1));
  }

  /**
   * @description obtiene la información institucional de la solicitud
   * @returns : Observable<ResponseInterface>
   */
  public getDatosInstitucionales(
    id_solicitud: number | string
  ): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(
        `${this.api}/EvaluacionPsicologica/ObtenerDatosInstitucionales/${id_solicitud}`
      )
      .pipe(take(1));
  }

  /**
   * @description obtiene la parametrizacion del formulario
   * @param tipoViolencia identificador de violencia
   * @param solicitud codigo de la solicitud
   * @returns : Observable<ResponseInterface>
   */
  public getTipoViolencia(
    solicitud: number,
    tipoViolencia: number,
    idTarea: number
  ): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(
        `${this.api}/EvaluacionPsicologica/ObtenerEvaluacion/${tipoViolencia}/${solicitud}/${idTarea}`
      )
      .pipe(take(1));
  }

  /**
   * @description guarda la entrevista del formulario
   * @param data informacion del formulario a guardar
   * @returns ResponseInterface
   */
  public postFormTipoViolencia(
    data: RespuestaTipoViolencia
  ): Observable<ResponseInterface> {
    return this.http
      .post<ResponseInterface>(
        `${this.api}/EvaluacionPsicologica/RegistrarCuestionario`,
        data
      )
      .pipe(take(1));
  }

  public getDescripcionHechosPorSolicitud(
    id_solicitud: number | string
  ): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(
        `${this.api}/EvaluacionPsicologica/ObtenerDescripcionHechosPorSolicitud/${id_solicitud}`
      )
      .pipe(take(1));
  }

  /**
   * @description actualiza Descripcion Hechos Por Solicitud
   * @returns : Observable<ResponseInterface>
   */
  public actualizarDescripcionHechosPorSolicitud(
    body: DescripcionHechosDTO
  ): Observable<ResponseInterface> {
    return this.http
      .post<ResponseInterface>(
        `${this.api}/EvaluacionPsicologica/ActualizarDescripcioHechosPorSolicitud`,
        body
      )
      .pipe(take(1));
  }

  /**
   * @description calcula la evaluacion del riesgo
   * @returns : Observable<ResponseInterface>
   */
  public getEvaluacionRiegos(
    id_solicitud: number
  ): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(
        `${this.api}/EvaluacionPsicologica/EvaluacionRiesgos/${id_solicitud}`
      )
      .pipe(take(1));
  }

  /**
   * @description actuializa la
   * @returns : Observable<ResponseInterface>
   */
  public postRegistrarRecomendaciones(
    body: RegistrarRecomendacionesValoracionRiesgo
  ): Observable<ResponseInterface> {
    let formData = new FormData();
    if (body.idSolicitudServicio && body.decripcion && body.file) {
      formData.append('idSolicitudServicio', body.idSolicitudServicio + '');
      formData.append('decripcion', body.decripcion);
      formData.append('file', body.file);
    }
    return this.http
      .post<ResponseInterface>(
        `${this.api}/EvaluacionPsicologica/RegistrarRecomendaciones`,
        body
      )
      .pipe(take(1));
  }

  /**
   * Cierra la tarea en curso y crea la evaluacion psicologica
   * @param body
   * @returns
   */
  public cerrarTareaYCrearEvaluacionPsicologica(body: CierreTarea) {
    return this.http
      .post<ResponseInterface>(
        `${PATH_SERVER}/EvaluacionPsicologica/ActualizarTareaP`,
        body
      )
      .pipe(take(1));
  }
}
