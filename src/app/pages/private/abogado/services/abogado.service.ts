import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { PATH_SERVER } from 'src/app/constants';
import { DominioInterface } from 'src/app/interfaces/dominio.interface';
import { ResponseInterface } from 'src/app/interfaces/response.interface';

@Injectable({
  providedIn: 'root',
})
export class AbogadoService {
  private api = PATH_SERVER;

  private relatoBS = new BehaviorSubject<any>({});
  public relatoBS$ = this.relatoBS.asObservable();

  private tipoViolenciaBS = new BehaviorSubject<DominioInterface[]>([]);
  public tipoViolencia$ = this.tipoViolenciaBS.asObservable();

  private testimonialBS = new BehaviorSubject<any>({});
  public testimonialBS$ = this.testimonialBS.asObservable();

  private cargaJuezBS = new BehaviorSubject<boolean>(false);
  public cargaJuez$ = this.cargaJuezBS.asObservable();

  private gridPardBS = new BehaviorSubject<boolean>(false);
  public gridPard$ = this.gridPardBS.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * @description llama servicio obtener involucrado medidas protección
   * @param idSolicitud id de la solicitud
   * @returns observable
   */
  public obtenerInvolucrados(
    idSolicitud: number
  ): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(
        `${this.api}/Abogado/ObtenerInvolucrados/${idSolicitud}`
      )
      .pipe(take(1));
  }

  /**
   * @description emite objeto relato
   * @param relato objeto relato
   */
  public emitirObjRelato(relato: any) {
    this.relatoBS.next(relato);
  }

  /**
   * @description emite arrelgo tipo de violencia
   * @param tipoV arreglo tipo violencia
   */
  public emitirTipoViolencia(tipoV: DominioInterface[]) {
    this.tipoViolenciaBS.next(tipoV);
  }

  /**
   * @description emite formulario testimonial
   * @param testimonial formulario testimonial
   */
  public emitirTestimonial(testimonial: FormData) {
    this.testimonialBS.next(testimonial);
  }

  /**
   * @description llama servicio guardar testimonial
   * @param objTestimonial formulario testimonial
   * @returns observable
   */
  public guardarTestimonial(
    objTestimonial: FormData
  ): Observable<ResponseInterface> {
    return this.http
      .post<ResponseInterface>(
        `${this.api}/Abogado/RegistrarMedidaProteccion`,
        objTestimonial
      )
      .pipe(take(1));
  }

  /**
   * @description llama servicio obtener testimonial
   * @param idSolicitud idSolicitud
   * @returns observable
   */
  public obtenerTestimonial(
    idSolicitud: number
  ): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(
        `${this.api}/Abogado/ObtenerInformacionMedidasProteccion/${idSolicitud}`
      )
      .pipe(take(1));
  }

  /**
   * @description llama servicio para cerrar la tarea
   * @param objTarea objeto tarea
   * @returns observable
   */
  public cerrarActuacion(objTarea: any): Observable<ResponseInterface> {
    return this.http
      .post<ResponseInterface>(`${this.api}/Tarea/CerrarActuaciones`, objTarea)
      .pipe(take(1));
  }

  /**
   * @description consulta listado archivos decisión juez
   * @param idTarea id de la tarea
   */
  public obtenerPruebaAsociadaJuez(
    idSolicitud: number,
    idTarea: number
  ): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(
        `${this.api}/PruebaSolicitud/PruebaAsociadaJuez/${idSolicitud}/${idTarea}`
      )
      .pipe(take(1));
  }

  /**
   * @description llama servicio cargar documentos
   * @param objPrueba objeto a enviar
   * @returns  observable
   */
  public cargarPruebaJuez(objPrueba: FormData): Observable<ResponseInterface> {
    return this.http
      .post<ResponseInterface>(
        `${this.api}/File/CargaPruebaSolicitud`,
        objPrueba
      )
      .pipe(take(1));
  }

  /**
   * @description llama servicio editar documentos
   * @param objPrueba objeto a enviar
   * @returns  observable
   */
  public editarPruebaJuez(objPrueba: any): Observable<ResponseInterface> {
    return this.http
      .post<ResponseInterface>(`${this.api}/File/EditarPrueba`, objPrueba)
      .pipe(take(1));
  }

  /**
   * @description sirve para consultar servicio de documentos cuando se agrega uno
   * @param estado valor boleano
   */
  public emitirCargaJuez(estado: boolean) {
    this.cargaJuezBS.next(estado);
  }

  /**
   * @description obtiene el base64 del archivo seleccionado
   * @param idTarea id de la tarea
   * @param idAnexo id del anexo
   */
  public obtenerArchivoPorId(
    idSolicitud: number,
    idAnexo: number
  ): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(
        `${this.api}/File/ObtenerArchivoPorId/${idSolicitud}/${idAnexo}`
      )
      .pipe(take(1));
  }

  /**
   * @description llama servicio obtener apelación
   * @param objSol objeto apelación
   * @returns observable
   */
  public obtenerApelacion(objApelacion: any): Observable<ResponseInterface> {
    return this.http
      .post<ResponseInterface>(
        `${this.api}/Apelacion/ObtenerApelacion`,
        objApelacion
      )
      .pipe(take(1));
  }

  /**
   * @description llama servicio Consultar Tareas Apelación
   * @returns observable
   */
  public consultarTareasApelacion(
    idSolicitud: number
  ): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(
        `${this.api}/Apelacion/ConsultarTareasApelacion?idSolicitudServicio=${idSolicitud}`
      )
      .pipe(take(1));
  }

  /**
   * @description llama servicio Consultar médidas Apelación
   * @returns observable
   */
  public consultarMedidasApelacion(
    idSolicitud: number
  ): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(
        `${this.api}/Apelacion/ConsultarMedidasApelacion?idSolicitudServicio=${idSolicitud}`
      )
      .pipe(take(1));
  }

  /**
   * @description llama servicio actualizar apelación
   * @param objSol objeto apelación
   * @returns observable
   */
  public actualizarApelacion(
    objApelacion: FormData
  ): Observable<ResponseInterface> {
    return this.http
      .post<ResponseInterface>(
        `${this.api}/Apelacion/ActualizarApelacion`,
        objApelacion
      )
      .pipe(take(1));
  }

  /**
   * @description llama servicio cerrar actuación apelación
   * @param objSol objeto apelación
   * @returns observable
   */
  public cerrarActuacionApelacion(
    objApelacion: any
  ): Observable<ResponseInterface> {
    return this.http
      .post<ResponseInterface>(
        `${this.api}/Apelacion/CerrarActuacionApelacion`,
        objApelacion
      )
      .pipe(take(1));
  }

  /**
   * @description llama servicio Reporte Incumplimiento
   * @returns observable
   */
  public reporteIncumplimiento(
    idSolicitud: number
  ): Observable<ResponseInterface> {
    return this.http
      .get<ResponseInterface>(
        `${this.api}/Incumplimiento/ReporteIncumplimiento/${idSolicitud}`
      )
      .pipe(take(1));
  }

  /**
   * @description llama servicio guardar incumplimiento
   * @param objSol objeto apelación
   * @returns observable
   */
  public guardarIncumplimiento(objArchivo: any): Observable<ResponseInterface> {
    return this.http
      .post<ResponseInterface>(
        `${this.api}/File/GuardarIncumplimiento`,
        objArchivo
      )
      .pipe(take(1));
  }

  /**
   * @description llama servicio firmar plantilla
   * @param objFirma objeto a firmar
   * @returns observable
   */
  public firmarPlantilla(objFirma: any): Observable<ResponseInterface> {
    return this.http
      .post<ResponseInterface>(
        `${this.api}/Plantilla/FirmarPlantilla`,
        objFirma
      )
      .pipe(take(1));
  }

  /**
   * @description llama servicio Cargar Adjunto Firma
   * @param objFirma objeto a cargar
   * @returns observable
   */
  public cargarAdjuntoFirma(objFirma: any): Observable<ResponseInterface> {
    return this.http
      .post<ResponseInterface>(
        `${this.api}/Plantilla/CargarAdjuntoFirma`,
        objFirma
      )
      .pipe(take(1));
  }

  /**
   * @description llama servicio consulta de médidas pard
   * @param idSolicitud id de la solicitud
   * @returns observable
   */
  public consultarMedidasPard(idSolicitud: any): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/PruebasPard/ConsultarMedidasPard?idSolicitudServicio=${idSolicitud}`
    );
  }

  /**
   * @description llama servicio cargar archivos pard
   * @param objArchivo archivo a cargar
   * @returns observable
   */
  public actualizarAnexoMedidasPard(
    objArchivo: any
  ): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}/PruebasPard/ActualizarAnexoMedidasPard`,
      objArchivo
    );
  }

  /**
   * @description emite true o false para volver a consultar grid pard
   */
  public emitirPARD(estado: boolean): void {
    this.gridPardBS.next(estado);
  }

  public cierreCompetenciaPard(obj: any): Observable<ResponseInterface> {
    return this.http
      .post<ResponseInterface>(
        `${this.api}/Presolicitud/CierrePresolicitudASolicitud`,
        obj
      )
      .pipe(take(1));
  }

  /**
   * @description llama servicio consulta de médidas pard
   * @param tipo id de la solicitud
   * @returns observable
   */
  public consultarPruebasDecreto(
    idSolicitud: number,
    tipo: string
  ): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/PruebasPard/ConsultarPruebasDecreto?idSolicitudServicio=${idSolicitud}&tipoDecreto=${tipo}`
    );
  }

  /**
   * @description llama servicio consulta Lista Medidas Decreto
   * @param tipo id de la solicitud
   * @returns observable
   */
  public consultaListaMedidasDecreto(
    idSolicitud: number
  ): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/PruebasPard/ConsultaListaMedidasDecreto?idSolicitudServicio=${idSolicitud}`
    );
  }

  /**
   * @description llama servicio que agrega el decreto
   * @param objArchivo objeto a insertar
   * @returns observable
   */
  public agregarDecreto(objArchivo: FormData): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}/PruebasPard/AgregarDecreto`,
      objArchivo
    );
  }

  /**
   * @description llama servicio consulta Listado Involucrados
   * @param idSolicitud id de la solicitud
   * @param idTarea id de la tarea
   * @returns observable
   */
  public listadoInvolucrados(
    idSolicitud: number,
    idTarea: number
  ): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/PruebasPard/ListadoInvolucrados/${idSolicitud}/${idTarea}`
    );
  }

  /**
   * @description llama servicio consulta Listar Involucrado Notificados
   * @param idSolicitud id de la solicitud
   * @param idTarea id de la tarea
   * @returns observable
   */
  public listarInvolucradoNotificados(
    idSolicitud: number,
    idTarea: number
  ): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/PruebasPard/ListarInvolucradoNotificados/${idSolicitud}/${idTarea}`
    );
  }

  /**
   * @description llama servicio Guardar Notificación Pard
   * @param objInvolucrado objeto a insertar
   * @returns observable
   */
  public guardarNotificacioPard(
    objInvolucrado: any
  ): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}/PruebasPard/GuardarNotificacioPard`,
      objInvolucrado
    );
  }

  /**
   * @description llama servicio cargar documentos PARD
   * @param objArchivo objeto a enviar
   * @returns  observable
   */
  public cargarNotificacionPARD(
    objArchivo: FormData
  ): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}/File/CargarNotificacionPARD`,
      objArchivo
    );
  }

  /**
   * @description llama servicio cargar documentos PARD decretar-desistir
   * @param objArchivo objeto a enviar
   * @returns  observable
   */
  public actualizarAnexoDecreto(
    objArchivo: FormData
  ): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}/PruebasPard/ActualizarAnexoDecreto`,
      objArchivo
    );
  }
}
