import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PATH_SERVER } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';

@Injectable({
  providedIn: 'root'
})
export class ComisariaService {

  private api = PATH_SERVER + '/Cita';

  constructor(private http: HttpClient) { }

  /**
   * @description llama servicio getComisarias
   * @returns observable
   */
  public getComisarias(idCiudad: number): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(`${this.api}/consultarComisarias?ciudmunID=${idCiudad}`);
  }


  /**
   * @description llama servicio consultarDisponibilidadCitas
   * @param idComisaria id de la comisaría
   * @returns observable
   */
  public getCitas(idComisaria: number): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(`${this.api}/consultarDisponibilidadCitas?idComisaria=${idComisaria}`);
  }

  /**
   * @description llama servicio consultarDepartamentos
   * @returns observable
   */
  public getDepartamentos(): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(`${this.api}/consultarDepartamentos`);
  }

  /**
   * @description llama servicio consultarCiudadesMunicipios
   * @returns observable
   */
  public getCiudades(depID: number): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(`${this.api}/consultarCiudadesMunicipios?depID=${depID}`);
  }


  /**
   * @description llama servicio crearCita
   * @param data obj form
   * @returns observable
   */
  public crearCita(data: FormData): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(`${this.api}/crearCita`, data);
  }


  /**
   * @description consulta servicio para saber si la hora seleccionada está dispobible
   * @param idCita id de la cita
   * @returns observable
   */
  public getDisponibilidadCitas(idCita: number): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(`${this.api}/reservarObtenerDisponibilidadCita?idCita=${idCita}`);
  }

}
