import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';
import {
  CodigosRespuesta,
  PATH_SERVER,
  TiposDocumentoCarga,
} from '../constants';
import { ResponseInterface } from '../interfaces/response.interface';
import {
  ArchivarDiligenciasInterface,
  CargarArchivoInterface,
  CerrarActuacionesInterface,
  CrearEtiquetaTareaInterface,
  EditarArchivoInterface,
  EliminarArchivoInterface,
} from '../interfaces/shared.interfaces';
import {
  CargaArchivoRemision,
  EditarArvhivoRemision,
} from '../pages/private/interfaces/tipo-remision.interface';
import { ReporteSolicitudInterface } from '../shared/components/informes/informes-dinamicos/solicitud.interface';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private api = PATH_SERVER + '/Compartido';
  private bsModuloActual = new BehaviorSubject<boolean>(false);

  public bsModuloActual$ = this.bsModuloActual.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * @description llama servicio consultar estados de cita
   * @returns observable
   */
  public getEstadosCita(): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/ConsultarDominio?Tipo_Dominio=Estado_cita`
    );
  }

  /**
   * @description llama servicio consultarPaises para colsultar pais
   * @returns observable
   */
  public getPaises(): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(`${this.api}/consultarPaises`);
  }

  /**
   * @description llama servicio consultarDepartamentos
   * @param idPais id del pais a filtrar departamentos
   * @returns observable
   */
  public getDepartamentos(idPais: number): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/consultarDepartamentos?idPais=${idPais}`
    );
  }

  /**
   * @description llama servicio consultarCiudadesMunicipios
   * @param depID id para filtrar ciudadaes
   * @returns observable
   */
  public getCiudades(depID: number): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/consultarCiudadades?depID=${depID}`
    );
  }

  /**
   * @description llama servicio consultarCiudadesMunicipios
   * @param tipo filtra para filtar (Sexo) (Genero) (Orientacion)
   * @returns observable
   */
  public getSexo(tipo: string): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/consultarGeneroSexual?tipo=${tipo}`
    );
  }

  /**
   * @description llama servicio que retorna género
   * @returns observable
   */
  public getLugarExpedicion() {
    return this.http.get<ResponseInterface>(
      `${this.api}/consultarLugarExpedicion`
    );
  }

  /**
   * @description llama servicio que retorna un dominio
   * @param tipoDominio los dominios posibles ej (Genero)
   * @returns observable
   */
  public getDominio(tipoDominio: string) {
    return this.http.get<ResponseInterface>(
      `${this.api}/ConsultarDominio?Tipo_Dominio=${tipoDominio}`
    );
  }

  /**
   * @description Consulta el dominio en localStrorage y si no lo encuentra lo consulta en la base de datos
   * @param tipoDominio nombre de tipo de dominio
   * @returns observable
   */
  public async getDominioFromLocal(tipoDominio: string) {
    //Añadir acciones para guardar y traer del store
    const result = await lastValueFrom(
      this.http.get<ResponseInterface>(
        `${this.api}/ConsultarDominio?Tipo_Dominio=${tipoDominio}`
      )
    );
    if (result.statusCode === CodigosRespuesta.OK) {
      return result.data;
    }
    return [];
  }

  /**
   * @description llama servicio que retorna los paises dependiento de tipo de documento
   * @param idTipDoc tipo de documento
   * @returns observable
   */
  public getPaisPorId(idTipDoc: number) {
    return this.http.get<ResponseInterface>(
      `${this.api}/ConsultarPaisPorTipoId?id_tipo_documento=${idTipDoc}`
    );
  }

  /**
   * @description llama servicio que retorna las localidades dependiento del municipio
   * @param IdCiudMun id de la ciudad/municipio
   * @returns observable
   */
  public getLocalidadPorMunicipio(IdCiudMun: number) {
    return this.http.get<ResponseInterface>(
      `${this.api}/consultarLocalidades?ciudMunID=${IdCiudMun}`
    );
  }

  /**
   * @description consulta servicio recepción casos
   * @param filtros objeto formulario
   * @returns observable
   */
  public consultarCasosPendienteDeAtencion(
    filtros: FormData
  ): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${PATH_SERVER}/Tarea/ConsultarCasosPendienteDeAtencion`,
      filtros
    );
  }

  /**
   * @description consulta servicio recepción casos
   * @param filtros objeto formulario
   * @returns observable
   */
  public asignarTarea(objTarea: any): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${PATH_SERVER}/Tarea/AsignarTarea`,
      objTarea
    );
  }

  /**
   * @description cambia el estado según el módulo donde se encuentre el usuario
   * @param estado true private, false public
   */
  public emitirModulo(estado: boolean) {
    this.bsModuloActual.next(estado);
  }

  /**
   * @description Cerrar actuaciones de la tarea
   * @param body
   * @returns observable
   */
  public cerrarActuaciones(
    body: CerrarActuacionesInterface
  ): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${PATH_SERVER}/Tarea/CerrarActuaciones`,
      body
    );
  }
  /**
   * @description crear etiqueta de la tarea
   * @param body
   * @returns observable
   */
  public crearEtiqueta(
    body: CrearEtiquetaTareaInterface
  ): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${PATH_SERVER}/Tarea/CrearEtiqueta`,
      body
    );
  }
  /**
   * @description archivar diligencias de la tarea
   * @param body
   * @returns observable
   */
  public archivarDiligencias(
    body: ArchivarDiligenciasInterface
  ): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${PATH_SERVER}/Tarea/ArchivarDiligencias`,
      body
    );
  }

  public guardarArchivo(
    objetoArchivo: CargarArchivoInterface
  ): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${PATH_SERVER}/File/CargaArchivo`,
      objetoArchivo
    );
  }

  public guardarArchivoRemision(
    objetoArchivo: CargaArchivoRemision
  ): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${PATH_SERVER}/File/CargarArchivoRemision`,
      objetoArchivo
    );
  }

  /**
   * @description consulta los archivos por id y tipo de solicitud
   * @returns observable
   */
  public ConsultarArchivos(
    idSolicitud: number,
    tipoAnexo: TiposDocumentoCarga
  ): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${PATH_SERVER}/File/ConsultarArchivos/${idSolicitud}/${tipoAnexo}`
    );
  }
  /**
   * @description consula la lista de formatos existentes
   * @returns observable
   */
  public listarFormatos(): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${PATH_SERVER}/File/ListarFormatos`
    );
  }

  /**
   * @description trae la base64 del formato seleccionado
   * @param nombreDocumento
   * @param codigo
   * @returns observable
   */
  public descargarFormatos(
    nombreDocumento: string,
    codigo: string
  ): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${PATH_SERVER}/File/DescargarFormato/${nombreDocumento}/${codigo}`
    );
  }

  /**
   * @description elimina un archivo por id de archivo y solicitud
   * @returns observable
   */
  public EliminarDocumentoPorID(
    body: EliminarArchivoInterface
  ): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${PATH_SERVER}/File/EliminarDocumentoPorID`,
      body
    );
  }

  /**
   * @description elimina un archivo por id de archivo y solicitud
   * @returns observable
   */
  public ObtenerArchivoPorId(
    idSolicitud: number,
    idArchivo: number
  ): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${PATH_SERVER}/File/ObtenerArchivoPorId/${idSolicitud}/${idArchivo}`
    );
  }

  /**
   * @description edita un archivo por id de remision y solicitud
   * @returns observable
   */
  public editarDocumentoRemision(
    archivo: EditarArvhivoRemision
  ): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${PATH_SERVER}/File/EditarRemision`,
      archivo
    );
  }

  /**
   * @description llama servicio Reporte Incumplimiento
   * @returns observable
   */
  public reporteIncumplimiento(objReporte: any): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${PATH_SERVER}/Incumplimiento/ReporteIncumplimiento`,
      objReporte
    );
  }

  /**
   * @description llama servicio guardar incumplimiento
   * @param objSol objeto apelación
   * @returns observable
   */
  public guardarIncumplimiento(objArchivo: any): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${PATH_SERVER}/File/GuardarIncumplimiento`,
      objArchivo
    );
  }

  /**
   * @description llama servicio para cerrar la tarea
   * @param objTarea objeto tarea
   * @returns observable
   */
  public cerrarActuacion(objTarea: any): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${PATH_SERVER}/Tarea/CerrarActuaciones`,
      objTarea
    );
  }

  /**
   * @description llama a un servicio para traer la data de los Reportes
   * @param reporte
   * @param fechaInicio
   * @param fechaFin
   * @returns Observable
   */

  public getReportes(
    reporte: string,
    fechaInicio: string | null,
    fechaFin: string | null
  ): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${PATH_SERVER}/Reporte/Esquema/${reporte}/${fechaInicio}/${fechaFin}`
    );
  }

  /**
   * @description llama a un servicio para filtrar la data de los reportes
   * @param body
   * @returns observable
   */
  public reporteSolicitud(
    body: ReporteSolicitudInterface
  ): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${PATH_SERVER}/ReporteSolicitud/GenerarReporteSolicitud`,
      body
    );
  }
  /**
   * @description llama a un servicio para traer la informacion general de la solicitud
   * @param idSolicitud
   * @returns observable
   */
  public ConsultaGeneral(idSolicitud: number): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${PATH_SERVER}/Solicitud/ConsultaGeneralSolicitud?idSolicitudServicio=${idSolicitud}`
    );
  }

    /**
   * @description llama a un servicio para retomar los datos del involucrado principal
   * @param idSolicitud
   * @returns observable
   */
    public ConsultaInvolucradoPrincipal(idSolicitud: number): Observable<ResponseInterface> {
      return this.http.get<ResponseInterface>(
        `${PATH_SERVER}/Solicitud/ConsultaInvolucradoPrincipal/${idSolicitud}`
      );
    }

    /**
   * @description llama a un servicio para retomar y obtener los datos del accionante
   * @param idCiudadano
   * @returns observable
   */
        public ObtenerAccionante(idCiudadano: number): Observable<ResponseInterface> {
          return this.http.get<ResponseInterface>(
            `${PATH_SERVER}/EvaluacionPsicologica/ObtenerInvolucrado/${idCiudadano}?esvictima=false&principal=true`
          );
        }

        /**
   * @description llama a un servicio para retomar y obtener la solicitud detallada
   * @param idSolicitud
   * @returns observable
   */
        public ObtenerSolicitudDetalle(idSolicitud: number): Observable<ResponseInterface> {
          return this.http.get<ResponseInterface>(
            `${PATH_SERVER}/Solicitud/ObtenerDatosSolicitud/${idSolicitud}`
          );
        }
}
