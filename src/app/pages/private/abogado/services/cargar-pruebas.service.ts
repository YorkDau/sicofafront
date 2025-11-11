import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { PATH_SERVER } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { CargaArchivoRemision } from '../../interfaces/tipo-remision.interface';

@Injectable({
  providedIn: 'root',
})
export class CargarPruebasService {
  private api = PATH_SERVER;

  constructor(private http: HttpClient) {}

  /**
   * @descripcion consulta las pruebas cargadas
   */
  public consultarPruebasCargadas(
    idSolicitud: number,
    idTarea: number
  ): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(
        `${PATH_SERVER}/PruebaSolicitud/PruebaAsociadas/${idSolicitud}/${idTarea}`
      )
      .pipe(take(1));
  }

  /**
   * @descripcion añade el registro de la prueba
   */
  public anadirPrueba(
    archivo: CargaArchivoRemision
  ): Observable<ResponseInterface> {
    return this.http
      .post<ResponseInterface>(
        `${PATH_SERVER}/File/CargaPruebaSolicitud`,
        archivo
      )
      .pipe(take(1));
  }
  /**
   * @descripcion elimina la prueba seleccionada
   */
  public eliminarPrueba(
    idPrueba: number,
    idAnexo: number
  ): Observable<ResponseInterface> {
    return this.http
      .post<ResponseInterface>(`${PATH_SERVER}/File/EliminarPruebaSolicitud`, {
        idPrueba,
        idAnexo,
      })
      .pipe(take(1));
  }
}
