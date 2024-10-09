import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { PATH_SERVER } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import {
  actualizarProgramacionQuorum,
  ActualizarQuorumAudiencia,
  GuardarQuorumAudiencia,
} from '../../interfaces/abogado.interface';

@Injectable({
  providedIn: 'root',
})
export class QuorumService {
  private api = PATH_SERVER;

  constructor(private http: HttpClient) {}
  /**
   * @descripcion  consulta el listado de quorum
   */
  public consultar(
    idSolicitud: number,
    idTarea: number
  ): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(
        `${PATH_SERVER}/Quorum/ListaInvolucradosQuorum/${idSolicitud}/${idTarea}`
      )
      .pipe(take(1));
  }
  /**
   * @descripcion  consulta el listado de quorum
   */
  public obtenerQuorum(idTarea: number): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(
        `${PATH_SERVER}/Programacion/ObtenerQuorum?idTarea=${idTarea}`
      )
      .pipe(take(1));
  }

  /**
   * @descripcion actualiza el estado y archivo del quorum
   */
  public guardarQuorum(
    body: GuardarQuorumAudiencia
  ): Observable<ResponseInterface> {
    return this.http
      .post<ResponseInterface>(`${PATH_SERVER}/File/GuardarQuorum`, body)
      .pipe(take(1));
  }

  /**
   * @descripcion actualiza quorum
   */
  public actualizarEstadoQuorum(
    body: ActualizarQuorumAudiencia
  ): Observable<ResponseInterface> {
    return this.http
      .post<ResponseInterface>(
        `${PATH_SERVER}/Programacion/ActualizarQuorum`,
        body
      )
      .pipe(take(1));
  }

  public actualizarProgramacionQuorum(
    body: actualizarProgramacionQuorum
  ): Observable<ResponseInterface> {
    return this.http
      .post<ResponseInterface>(
        `${PATH_SERVER}/Programacion/ActualizarProgramacionQuorum`,
        body
      )
      .pipe(take(1));
  }
  
}
