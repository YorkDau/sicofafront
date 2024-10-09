import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { PATH_SERVER } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import {
  agregarDominioInterface,
  modificarDominioInterface,
} from '../interfaces/dominios.interface';

@Injectable({
  providedIn: 'root',
})
export class GestionDominioService {
  private api = PATH_SERVER;

  constructor(private http: HttpClient) {}

  /**
   * @description llama el servicio para traer la lista de los tipos de dominio
   * @returns observable
   */

  public getListaDominios(): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(`${this.api}/Dominio/ListaDominio`)
      .pipe(take(1));
  }

  /**
   * @description llama a un servicio para obtener la lista de Dominios dentro de un tipo de dominio
   * @param tipoDominio
   * @returns observable
   */

  public getListaDominiosPorGrupo(
    tipoDominio: string
  ): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(
        `${this.api}/Dominio/DominioPorGrupo/${tipoDominio}`
      )
      .pipe(take(1));
  }

  /**
   * @description llama a un servicio para obtener el detalle de cada lista de dominio
   * @param idDominio
   * @returns
   */

  public getDetallesDominio(idDominio: number): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(
        `${this.api}/Dominio/DominioDetalles/${idDominio}`
      )
      .pipe(take(1));
  }

  /**
   * @description llama a un servicio para crear un nuevo Dominio
   * @param objetoDominio
   * @returns observable
   */

  public postCrearNuevoDominio(
    objetoDominio: agregarDominioInterface
  ): Observable<ResponseInterface> {
    return this.http
      .post<ResponseInterface>(
        `${this.api}/Dominio/AgregarDominio`,
        objetoDominio
      )
      .pipe(take(1));
  }

  /**
   * @description llama a un servicio para modificar un dominio existente
   * @param objetoDominio
   * @returns observable
   */

  public postModificarDominio(
    objetoDominio: modificarDominioInterface
  ): Observable<ResponseInterface> {
    return this.http
      .post<ResponseInterface>(
        `${this.api}/Dominio/EditarDominio`,
        objetoDominio
      )
      .pipe(take(1));
  }
}
