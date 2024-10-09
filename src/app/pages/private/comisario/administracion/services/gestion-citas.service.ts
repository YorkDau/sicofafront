import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { PATH_SERVER } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';

@Injectable({
  providedIn: 'root',
})
export class GestionCitasService {
  private api = PATH_SERVER;

  constructor(private http: HttpClient) {}

  /**
   * @description consulta las citas de la comisaria
   * @returns observable
   */

  public getConsultarCitasPre(): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(`${this.api}/Cita/consultarCitaPre`)
      .pipe(take(1));
  }

  /**
   * @description actualiza la cita seleccionada
   * @returns observable
   */

  public getActualizarCita(body: {
    idCita: number;
    activo: boolean;
  }): Observable<ResponseInterface> {
    return this.http
      .post<ResponseInterface>(`${this.api}/Cita/ActualizarCita`, body)
      .pipe(take(1));
  }

  /**
   * @description crear nueva cita
   * @returns observable
   */

  public getCrearCita(body: {
    fechaCita: string;
    horaCita: string;
  }): Observable<ResponseInterface> {
    return this.http
      .post<ResponseInterface>(`${this.api}/Cita/GuardarCita`, body)
      .pipe(take(1));
  }
}
