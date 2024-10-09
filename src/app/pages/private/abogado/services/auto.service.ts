import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PATH_SERVER } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { SeccionesInterface } from '../../../../interfaces/auto.interface';

@Injectable({
  providedIn: 'root',
})
export class AutoService {
  private api = PATH_SERVER;

  private seccionBS = new BehaviorSubject<any>(null);
  public seccion$ = this.seccionBS.asObservable();

  private seccionHijaBS = new BehaviorSubject<any>(null);
  public seccionHija$ = this.seccionHijaBS.asObservable();

  private autoInterfaceBS = new BehaviorSubject<any>(null);
  public autoInterface$ = this.autoInterfaceBS.asObservable();

  private seccionesBS = new BehaviorSubject<any>(null);
  public seccionesLista$ = this.seccionesBS.asObservable();

  private autoTituloBS = new BehaviorSubject<string | null>(null);
  public autoTitulo = this.autoTituloBS.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * @description emite la sección marcada
   * @param seccion sección seleccionada generar auto
   */
  public emitirSeccionSeleccionada(seccion: any) {
    this.seccionBS.next(seccion);
  }

  /**
   * @description emite los involucrados de la sección
   * @param seccion sección seleccionada generar auto
   */
  public emitirSeccionHijaSeleccionada(seccion: any) {
    this.seccionHijaBS.next(seccion);
  }

  /**
   * @description emite el item del auto seleccionado
   * @param seccion sección seleccionada generar auto
   */
  public emitirAuto(auto: any) {
    this.autoInterfaceBS.next(auto);
  }

  /**
   * @description emite un arreglo de secciones
   * @param secciones arreglo de secciones
   */
  public emitirArregloSecciones(secciones: SeccionesInterface[]) {
    this.seccionesBS.next(secciones);
  }

  /**
   * @description emite el texto del auto
   * @param texto texto a mostrar en el componente
   */
  public emitirTituloAuto(texto: string | null) {
    this.autoTituloBS.next(texto);
  }

  /**
   * @description llama servicio para crear o editar el auto
   * @param listaSecciones objeto generar auto
   * @returns observable
   */
  public guardarAuto(listaSecciones: any): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}/Plantilla/ActualizarSecciones`,
      listaSecciones
    );
  }

  /**
   * @description llama servicio para validar si se pregunta
   * @param idSolicitudServicio id solicitud del servicio
   * @returns observable
   */
  public getValidarDocumentoFirma(
    idSolicitudServicio: number
  ): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/Auto/ValidarDocumentoFirma/${idSolicitudServicio}`
    );
  }

  /**
   * @description llama servicio que consulta los formatos del auto
   * @param idSolicitudServicio id solicitud del servicio
   * @returns observable
   */
  public obtenerSecciones(
    idSolicitudServicio: number
  ): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/Plantilla/ObtenerSecciones?idSolicitudServicio=${idSolicitudServicio}`
    );
  }
}
