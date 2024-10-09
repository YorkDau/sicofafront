import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PATH_SERVER } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { PostDataProgramacionAudiencia } from '../interfaces/audiencia';

@Injectable({
  providedIn: 'root',
})
export class AudienciaService {
  private api = PATH_SERVER;

  constructor(private http: HttpClient) {}

  /**
   * @description llama servicio para obtener las razones de la audiencia
   * @param idTarea id de la tarea
   * @returns observable
   */
  public getRazonesAudiencia(idTarea: number): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/Audiencia/obtenerTiposAudiencia/${idTarea}`
    );
  }

  /**
   * @description llama servicio para obtener las razones de la audiencia
   * @param idComisaria id de la comisaria
   * @returns observable
   */
  public getAudienciasPorComisaria(
    idComisaria: number
  ): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/Audiencia/obtenerAudiencias/${idComisaria}`
    );
  }

  /**
   * @description llama servicio para guardar las razones de la audiencia
   * @param data informacion de la programacion de la audiencia
   * @returns observable
   */
  public postProgramacionAudiencia(
    data: PostDataProgramacionAudiencia
  ): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}/Audiencia/GuardarProgramacion`,
      data
    );
  }
}
