import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PATH_SERVER } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';

@Injectable({
  providedIn: 'root',
})
export class InvolucradoService {
  private api = PATH_SERVER;

  constructor(private http: HttpClient) { }

 /**
   * @description obtiene la informacion del ciudadano a partir de un id.
   * @param id_involucrado id involucrado en cuestion
   * @returns informacion del involucrado 
   */
  public getInvolucrado(id_involucrado: number): Observable<any> {
    if (!id_involucrado) {
      throw new Error('Se requiere la identificacion del ciudadano');
    }
    return this.http.get<any>(
       `${this.api}/Solicitud/ObtenerInvolucrado/${id_involucrado}`
    );
  }

  /**
   * @description obtiene las solicitudes del involucrado a partir de su id.
   * @param id_involucrado id ciudadano en cuestion
   * @param idComisaria id de la comisaria
   * @returns solicitudes de servicio del involucrado
   */
  public getSolicitudesInvolucrado(id_involucrado: number, idComisaria: number | undefined): Observable<any> {
    if (!id_involucrado) {
      throw new Error('Se requiere la identificacion del involucrado');
    }
    return this.http.get<any>(
      `${this.api}/Solicitud/ObtenerSolicitudesInvolucrado/${id_involucrado}/${idComisaria}`
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
   * @description llama servicio consultar involucrados
   * @param data formdata
   * @returns observable
   */
  public getInvolucrados(data: FormData): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}/Solicitud/consultarInvolucrados`,
      data
    );
  }
}
