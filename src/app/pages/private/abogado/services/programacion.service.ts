import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PATH_SERVER } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import {
  GuardarProgramacionInterface,
  ProgramacionInterface,
} from '../../../../interfaces/programacion.interface';

@Injectable({
  providedIn: 'root',
})
export class ProgramacionService {
  private api = PATH_SERVER;

  constructor(private http: HttpClient) {}

  /**
   * @description obtiene las programaciones
   * @returns observable
   */
  public obtenerProgramacion(idTarea: number): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/Programacion/ObtenerProgramacion?idTarea=${idTarea}`
    );
  }

  /**
   * @description ActualizarProgramacion
   * @returns observable
   */
  public actualizarProgramacion(
    body: GuardarProgramacionInterface
  ): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}/Programacion/ActualizarProgramacion`,

      body
    );
  }
}
