import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PATH_SERVER } from '../constants';
import { ResponseInterface } from '../interfaces/response.interface';

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  private api = PATH_SERVER + '/Compartido';
  constructor(private http: HttpClient) {}

  /**
   * consulta los datos del instrumento de riesgo
   * @param body
   * @returns
   */
  public getInstrumentoRiesgo(idSolicitud: number) {
    return this.http.get<ResponseInterface>(
      `${PATH_SERVER}/EvaluacionPsicologica/ObtenerReporte12/${idSolicitud}`
    );
  }

  /**
   * consulta los datos de seguridad redes de apoyo
   * @param body
   * @returns
   */
  public getSeguridadRedesApoyo(idSolicitud: number) {
    return this.http.get<ResponseInterface>(
      `${PATH_SERVER}/EvaluacionPsicologica/ObtenerReporte13/${idSolicitud}`
    );
  }

  /**
   * consulta los datos de entrevista psicologica emocional
   * @param body
   * @returns
   */
  public getEntrevistaPsicologicaEmocional(idSolicitud: number) {
    return this.http.get<ResponseInterface>(
      `${PATH_SERVER}/EvaluacionPsicologica/ObtenerReporte17/${idSolicitud}`
    );
  }
}
