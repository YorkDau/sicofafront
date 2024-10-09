import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { PATH_SERVER } from 'src/app/constants';

@Injectable({
  providedIn: 'root',
})
export class TrabajadorSocialService {
  private api = PATH_SERVER;

  private involucradoBS = new BehaviorSubject<boolean>(false);
  public involucrado$ = this.involucradoBS.asObservable();

  private derechosP1BS = new BehaviorSubject<boolean>(false);
  public derechosP1$ = this.derechosP1BS.asObservable();

  private derechosP2BS = new BehaviorSubject<boolean>(false);
  public derechosP2$ = this.derechosP2BS.asObservable();

  private agresorBS = new BehaviorSubject<boolean>(true);
  public agresor$ = this.agresorBS.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * @description emite validaciones formulario
   * @param estado true mostrar validaciones, false no
   */
  public emitirInvolucrados(estado: boolean) {
    this.involucradoBS.next(estado);
  }

  /**
   * @description emite validaciones formulario
   * @param estado true mostrar validaciones, false no
   */
  public emitirDerechosP1(estado: boolean) {
    this.derechosP1BS.next(estado);
  }

  /**
   * @description emite validaciones formulario
   * @param estado true mostrar validaciones, false no
   */
  public emitirDerechosP2(estado: boolean) {
    this.derechosP2BS.next(estado);
  }

  /**
   * @description emite validaciones formulario
   * @param estado true mostrar debajo derechos, false no
   */
  public emitirAgresor(estado: boolean) {
    this.agresorBS.next(estado);
  }

  /**
   * @description lista los involucrados pard
   * @param idSolicitud id de la solicitud
   * @returns observable
   */
  public listarInvolucradosComplementariaInfo(
    idSolicitud: number
  ): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/Compartido/ListarInvolucradosComplementariaInfo?IdSolicitudServicio=${idSolicitud}`
    );
  }

  /**
   * @description guarda el involucrado pard
   * @param objInvolucrado objeto a editar
   * @returns observable
   */
  public guardarInvolucradoComplementaria(
    objInvolucrado: any
  ): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}/Compartido/GuardarInvolucradoComplementaria`,
      objInvolucrado
    );
  }

  /**
   * @description edita el involucrado pard
   * @param objInvolucrado objeto a editar
   * @returns observable
   */
  public actualizarInvolucradoComplementaria(
    objInvolucrado: any
  ): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}/Compartido/ActualizarInvolucradoComplementaria`,
      objInvolucrado
    );
  }

  /**
   * @description llama servicio que carga el archivo
   * @param objArchivo objeto a cargar
   * @returns observable
   */
  public cargaActaVerificacionDerechos(
    objArchivo: any
  ): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}/File/CargaActaVerificacionDerechos`,
      objArchivo
    );
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
}
