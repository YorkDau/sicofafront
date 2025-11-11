import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as FileSaver from 'file-saver';
import * as xls from 'xlsx';
import { MatTableDataSource } from '@angular/material/table';
import { CodigosRespuesta, DescargasExcel, ImagenesModal, Mensajes, Regex } from 'src/app/constants';
import { SharedService } from 'src/app/services/shared.service';
import { DatePipe } from '@angular/common';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { validarDocumento } from './validators';
import { DominioInterface } from 'src/app/interfaces/dominio.interface';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { GestionDominioService } from 'src/app/pages/private/comisario/administracion/services/gestion-dominio.service';
import { Modales } from 'src/app/shared/modals';
import { MatDialog } from '@angular/material/dialog';
import { ReporteSolicitudInterface } from './solicitud.interface'; // Asegúrate que esta interfaz contiene 'pard_generar' y 'id_comisaria'
import { AuthService } from 'src/app/auth/services/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { InformesDinamicosInterface } from './interfaces/informes-dinamicos.interface';
import * as interfaces from 'src/app/pages/private/interfaces/ciudadano.interface';


@Component({
  selector: 'app-informes-dinamicos',
  templateUrl: './informes-dinamicos.component.html',
  styleUrls: ['./informes-dinamicos.component.scss']
})
export class InformesDinamicosComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;

  // Define las columnas para el reporte base
  displayedColumnsBase: string[] = [
    'fecha_ingreso',
    'comisaria',
    'historia',
    'barrio',
    'direccion_ubicacion_involucrado',
    'nombre_completo_involucrado',
    'tipo_documento_involucrado',
    'numero_documento_involucrado',
    'edad_involucrado',
    'tipo_violencia',
    'descripcion_lugar_de_hechos',
    'hora_hecho_violento',
    'sexo_genero_involucrado',
    'identidad_genero_involucrado',
    'orientacion_sexual_involucrado',
    'etnia_involucrado',
    'pais_involucrado',
    'victima_conflicto_armado_involucrado',
    'vicitma_es_poblacion_proteccion_especial',
    'discapacidad_involucrado',
    'nivel_academico_involucrado',
    'ocupacion_involucrado',
    'estrato_involucrado',
    'hijos_involucrado',
    'estado_embarazo_involucrado',
    'afiliado_seguridad_social_involucrado',
    'contexto_familiar_involucrado',
    'convive_con_agresor',
    'nombre_completo_agresor',
    'tipo_documento_agresor',
    'numero_documento_agresor',
    'edad_agresor',
    'sexo_genero_agresor',
    'identidad_genero_agresor',
    'etnia_agresor',
    'ocupacion_agresor',
    'nivel_academico_agresor',
    'hijos_agresor',
    'pertenece_grupo_armado_agresor',
    'medida_proteccion_otorgada_ley_575_2000',
    'fecha_audiencia',
    'estado',
    'fecha_estado_proceso',
    'observaciones'
  ];

  // Define las columnas para el reporte PARD (ajusta según las propiedades de ReporteSolicitudPARDDTO)
  displayedColumnsPARD: string[] = [
    'id_solicitud_servicio',
    'fecha_solicitud',
    'estado_solicitud',
    'codigo_solicitud',
    'nombre_comisaria',
    'descripcion_de_hechos',
    'tipo_solicitud',
    'subestado_solicitud',
    'NombreVictima',
    'DocumentoVictima',
    'TipoDocumentoVictima',
    'GeneroVictima',
    'OrientacionSexualVictima',
    'EdadVictima',
    'TelefonoVictima',
    'CorreoVictima',
    'DireccionVictima',
    'nombre_contacto_confianza',
    'telefono_contacto_confianza',
    'es_PARD',
    'tipo_presolicitud',
    'observacion_Legal',
    'denuncia_verificada',
    'observacion_verificacion',
    'continua_denuncia',
    'competencia_icbf',
    'observaciones_competencia_icbf',
    'numero_documento_denunciante',
    'nombres_denunciante',
    'telefono_denunciante',
    'correo_denunciante',
    'id_plantilla',
    'estado_plantilla',
    'observacion_plantilla',
    'aprobado',
    'apelacion',
    'afecta_medidas',
    'estado_involucrado',
    'nombre_documento_anexo',
    'fecha_creacion_anexo',
    'es_anexo_victima',
    'nombre_usuario_anexo',
    'correo_usuario_anexo',
    'cargo_usuario',
    'celular_usuario',
    'perfil_usuario',
    'estado_tarea',
    'fecha_creacion_tarea',
    'fecha_terminacion_tarea'
  ];

  // La lista de columnas actualmente mostradas en la tabla
  displayedColumns: string[] = [];
  // DataSource para la tabla de Material. Se usa 'any' para manejar ambos tipos de datos.
  dataSource = new MatTableDataSource<any>([]);

  formulario: FormGroup = new FormGroup({});
  respuesta: any[] = []; // Almacenará los datos de cualquiera de los dos reportes
  verTabla: boolean = false;
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  public mostrarValidaciones = false;
  public mensaje = 'La fecha inicial es mayor a la final';
  public listaTipoDocumento: DominioInterface[] = [];
  public tiposViolencia: DominioInterface[] = [];
  public minDate!: Date;
  public maxDate!: Date;
  private objUser!: any; // Información del usuario logueado
  public selectSexo: interfaces.DominioInterface[] = [];
  public selectGenero: interfaces.DominioInterface[] = [];

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private datePipe: DatePipe,
    private store: Store<AppState>,
    private _dialog: MatDialog,
    private authService: AuthService,
  ) {
    this.objUser = this.authService.currentUserValue!;
  }

  ngOnInit(): void {
    this.construirFormulario();
    this.store.select('tipo_documento').subscribe(({ tipo_documento }) => {
      this.listaTipoDocumento = tipo_documento;
    });
    this.sharedService.getDominio('PRESOL_DENUNS');
    this.cargarSelects();

    // Inicializa las columnas mostradas por defecto al reporte base
    this.displayedColumns = this.displayedColumnsBase;

    // Suscribe a los cambios del checkbox 'pard_generar' para ajustar las columnas de la tabla
    this.formulario.get('pard_generar')?.valueChanges.subscribe(value => {
      if (value) {
        this.displayedColumns = this.displayedColumnsPARD;
      } else {
        this.displayedColumns = this.displayedColumnsBase;
      }
      // Opcional: Limpiar los datos actuales de la tabla cuando se cambia el tipo de reporte
      this.respuesta = [];
      this.dataSource = new MatTableDataSource(this.respuesta);
      this.verTabla = false; // Oculta la tabla si no hay datos
    });
  }

  /**
   * @description Construye el Reactive Form para los filtros del reporte.
   */
  construirFormulario() {
    this.formulario = this.fb.group({
      nombreVictima: ['',],
      nombreCompletoAgresor: ['',],
      tipoDocumento: ['',],
      numeroDocumento: ['',],
      codigoSolicitud: [,],
      fechaHechoViolento: [],
      fechaInicial: [],
      fechaFinal: [],
      sexo: '',
      idGenero: '',
      pard_generar: [false], // Control para el checkbox PARD, inicializado en false
    },
      {
        validators: [
          validarDocumento() // Validador personalizado para el documento
        ]
      });
  }

  private cargarSelects() {
    this.cargaSelectSexo();
    this.cargaSelectIdentidadGenero();
  }

  /**
   * @description Carga el select de sexo desde el servicio.
   */
  private cargaSelectSexo() {
    this.sharedService.getDominio('Sexo').subscribe((sexo) => {
      if (sexo.statusCode === CodigosRespuesta.OK) {
        this.selectSexo = sexo.data;
      }
    });
  }

  /**
   * @description Carga el select de Identidad de Género desde el servicio.
   */
  private cargaSelectIdentidadGenero() {
    this.sharedService.getDominio('Genero').subscribe((genero) => {
      if (genero.statusCode === CodigosRespuesta.OK) {
        this.selectGenero = genero.data;
      }
    });
  }

  /**
   * @description Realiza la llamada al servicio para obtener los reportes.
   * @param body El objeto ReporteSolicitudInterface con los filtros.
   */
  private getReportes(body: ReporteSolicitudInterface) {
    this.sharedService.reporteSolicitud(body).subscribe({
      next: (data: ResponseInterface) => {
        if (data.data.datosPaginados && data.data.datosPaginados.length > 0) {
          this.respuesta = data.data.datosPaginados;
          this.verTabla = true;
        } else {
          this.respuesta = [];
          this.verTabla = false;
          Modales.modalExito(
            Mensajes.MENSAJE_EXITO, // Puedes usar un mensaje más específico si lo prefieres
            ImagenesModal.EXCLAMACION,
            this._dialog
          );
        }
        this.dataSource = new MatTableDataSource(this.respuesta);
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.error('Error al obtener el reporte:', err);
        this.msgError(); // Muestra un mensaje de error genérico
        this.respuesta = []; // Limpia la tabla en caso de error
        this.dataSource = new MatTableDataSource(this.respuesta);
        this.verTabla = false;
      }
    });
  }

  /**
   * @description Ajusta la fecha mínima y máxima para el picker de fecha final.
   */
  public agregarMaxDate() {
    const añoInicial: any = this.datePipe.transform(this.formulario.get('fechaInicial')?.value, 'YYYY');
    const mesInicial: any = this.datePipe.transform(this.formulario.get('fechaInicial')?.value, 'MM');
    const diaInicial: any = this.datePipe.transform(this.formulario.get('fechaInicial')?.value, 'dd');
    this.minDate = new Date(parseInt(añoInicial), parseInt(mesInicial) - 1, parseInt(diaInicial));
    this.maxDate = new Date(parseInt(añoInicial), parseInt(mesInicial), parseInt(diaInicial));
  }

  /**
   * @description Valida si la fecha inicial es mayor a la final.
   * @returns boolean
   */
  public FechaInicialMayorAFinal(): boolean {
    return this.formulario.hasError('fechaInialMayorAFinal');
  }

  /**
   * @description Valida si el campo de número de documento es requerido.
   * @returns boolean
   */
  public requiredNumeroDocumento(): boolean {
    return this.formulario.hasError('requioredNumeroDocumento');
  }

  /**
   * @description Valida si el campo de tipo de documento es requerido.
   * @returns boolean
   */
  public requiredTipoDocumento(): boolean {
    return this.formulario.hasError('requiredTipoDocumento');
  }

  /**
   * @description Método principal para generar el reporte.
   * Valida el formulario y llama a `getReportes`.
   */
  public getReporte() {
    this.mostrarValidaciones = false;

    if (this.formulario.valid) {
      this.getReportes(this.getDatafilter);
    } else {
      this.mostrarValidaciones = true;
    }
  }

  /**
   * @description Construye el objeto con los filtros a partir de los valores del formulario.
   * @returns ReporteSolicitudInterface
   */
  private get getDatafilter(): ReporteSolicitudInterface {
    let fechaInicial = this.formulario.value.fechaInicial;
    let fechaFinal = this.formulario.value.fechaFinal;
    let tipoDocumento = this.formulario.value.tipoDocumento;
    let numeroDcumento: string | null;
    let nombreCompletoVictima = this.formulario.value.nombreVictima;
    let nombreCompletoVictimario = this.formulario.value.nombreCompletoAgresor;
    let sexoVictima = this.formulario.value.sexo;
    let fechaHechoViolento = this.formulario.value.fechaHechoViolento;
    let identidadGeneroVictima = this.formulario.value.idGenero;
    // Obtiene el valor del checkbox 'pard_generar'
    let pardGenerar = this.formulario.value.pard_generar;

    (this.formulario.value.numeroDocumento === '') ? numeroDcumento = null : numeroDcumento = this.formulario.value.numeroDocumento;
    (this.formulario.value.tipoDocumento === '') ? tipoDocumento = null : tipoDocumento = this.formulario.value.tipoDocumento;

    return {
      codigoSolicitud: this.formulario.get('codigoSolicitud')?.value,
      fechaSolicitudDesde: fechaInicial,
      fechaSolicitudHasta: fechaFinal,
      numeroDocumento: numeroDcumento,
      codigoTipoDocumento: tipoDocumento,
      nombreCompletoVictima: nombreCompletoVictima,
      nombreCompletoVictimario: nombreCompletoVictimario,
      sexoVictima: sexoVictima,
      fechaHechoViolento: fechaHechoViolento,
      horaHechoViolento: null,
      identidadGeneroVictima: identidadGeneroVictima,
      pard_generar: pardGenerar, // Incluye el valor del checkbox
      id_comisaria: this.objUser.id_comisaria // Asumo que el ID de la comisaría del usuario es relevante
    };
  }

  /**
   * @description Exporta los datos de la tabla a un archivo Excel.
   */
  exportarExcel(): void {
    // Los datos en 'this.respuesta' ya son los que se muestran en la tabla,
    // ya sean del reporte base o del PARD.
    const worksheet: xls.WorkSheet = xls.utils.json_to_sheet(this.respuesta);
    const workbook: xls.WorkBook = xls.utils.book_new();
    xls.utils.book_append_sheet(workbook, worksheet, DescargasExcel.NOMBRE_HOJA_INOFORME);
    const excelBuffer: any = xls.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Define el nombre del archivo basado en si es reporte PARD o no
    let fileName = DescargasExcel.INFORMES_SOLICITUDES;
    if (this.formulario.get('pard_generar')?.value) {
      fileName = DescargasExcel.REPORTE_PARD; // Usa el nombre del reporte PARD
    }
    this.generarArchivo(excelBuffer, fileName);
  }

  /**
   * @description Guarda el buffer de datos como un archivo.
   * @param buffer El buffer de datos del archivo.
   * @param fileName El nombre del archivo a guardar.
   */
  private generarArchivo(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: DescargasExcel.EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + DescargasExcel.EXTENSION);
  }

  /**
   * @description Muestra un modal de error genérico.
   */
  private msgError() {
    Modales.modalExito(
      Mensajes.MENSAJE_ERROR_G,
      ImagenesModal.EXCLAMACION,
      this._dialog
    );
  }
}