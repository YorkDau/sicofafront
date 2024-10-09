import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import {
  DominiosEvaluacionOrientacion,
  PATH_SERVER,
} from '../../../../constants';
import { ResponseInterface } from '../../../../interfaces/response.interface';
import {
  ActualizarDatosIdentificacionInterface,
  RespuestaEntrevistaRedes,
} from 'src/app/pages/private/interfaces/psicologia.interface';
@Injectable({
  providedIn: 'root',
})
export class EntrevistaPsicologicaEmocionalService {
  private api = PATH_SERVER;

  constructor(private http: HttpClient) {}

  /**
   * @description obtiene los check de seguridad en sugerencia-apoyo-externo
   * @returns observable
   */
  public getSeguridad(idSolicitud: number): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(
        `${this.api}/EvaluacionPsicologica/EvaluacionOrientacion/${idSolicitud}/Seguridad`
      )
      .pipe(take(1));
  }

  /**
   * @description obtiene los check de red de apoyo en sugerencia-apoyo-externo
   * @returns observable
   */
  public getRedesApoyo(idSolicitud: number): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(
        `${this.api}/EvaluacionPsicologica/EvaluacionOrientacion/${idSolicitud}/Red_apoyo_externo`
      )
      .pipe(take(1));
  }

  /**
   * @description guarda las respuestas
   * @returns observable
   */
  public postGuardarRespuestasEntrevista(
    data: RespuestaEntrevistaRedes
  ): Observable<ResponseInterface> {
    return this.http
      .post<ResponseInterface>(
        `${this.api}/EvaluacionPsicologica/EvaluacionOrientacion`,
        data
      )
      .pipe(take(1));
  }

  /**
   * @description obtiene los check de red de apoyo en entrevista psicologica emocional
   * @returns observable
   */
  public getRedesApoyoChecks(
    idSolicitud: number
  ): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(
        `${this.api}/EvaluacionPsicologica/EvaluacionOrientacion/${idSolicitud}/${DominiosEvaluacionOrientacion.Red_apoyo}`
      )
      .pipe(take(1));
  }

  /**
   * @description obtiene los check de Persistencia en entrevista psicologica emocional
   * @returns observable
   */
  public getPersistenciaChecks(
    idSolicitud: number
  ): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(
        `${this.api}/EvaluacionPsicologica/EvaluacionOrientacion/${idSolicitud}/${DominiosEvaluacionOrientacion.Persistencia}`
      )
      .pipe(take(1));
  }
  /**
   * @description obtiene los check de tipo red de apoyo en entrevista psicologica emocional
   * @returns observable
   */
  public getTipoRedApoyoChecks(
    idSolicitud: number
  ): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(
        `${this.api}/EvaluacionPsicologica/EvaluacionOrientacion/${idSolicitud}/${DominiosEvaluacionOrientacion.Tipo_red_apoyo}`
      )
      .pipe(take(1));
  }

  /**
   * @description obtiene los check de red de apoyo en entrevista psicologica emocional
   * @returns observable
   */
  public getDescripciones(
    idSolicitud: number,
    dominioEvaluacionOrientacion: string
  ): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(
        `${this.api}/EvaluacionPsicologica/ObtenerEvaluacionPsicologicaEmocional/${idSolicitud}/${dominioEvaluacionOrientacion}`
      )
      .pipe(take(1));
  }

  /**
   * @description guarda las respuestas de la evaluacion psicologica
   * @returns observable
   */
  public actualizarEvaluacionPsicologica(
    data: RespuestaEntrevistaRedes
  ): Observable<ResponseInterface> {
    return this.http
      .post<ResponseInterface>(
        `${this.api}/EvaluacionPsicologica/ActualizarEvaluacionPsicologica`,
        data
      )
      .pipe(take(1));
  }

  /**
   * @description guarda las respuestas de la evaluacion psicologica
   * @returns observable
   */
  public actualizarDatosIdentificacion(
    data: ActualizarDatosIdentificacionInterface
  ): Observable<ResponseInterface> {
    return this.http
      .post<ResponseInterface>(
        `${this.api}/EvaluacionPsicologica/ActualizaEvaluacionPsicologicaEntrevista`,
        data
      )
      .pipe(take(1));
  }

  /**
   * @description obtener datos de identificacion de la victima principal
   * @returns observable
   */
  public getDatosIdentificacion(
    id_solicitud: number
  ): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(
        `${this.api}/EvaluacionPsicologica/ObtenerVictimaPrincipal/${id_solicitud}`
      )
      .pipe(take(1));
  }
  /**
   * @description obtener datos de identificacion de la victima principal
   * @returns observable
   */
  public getEvaluacionPsicologicaEntrevista(
    id_solicitud: number
  ): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(
        `${this.api}/EvaluacionPsicologica/ObtenerEvaluacionPsicologicaEntrevista/${id_solicitud}`
      )
      .pipe(take(1));
  }
}
