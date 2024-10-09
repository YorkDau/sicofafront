import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as FileSaver from 'file-saver';
import * as xls from 'xlsx';
import { MatTableDataSource } from '@angular/material/table';
import { CodigosRespuesta, DescargasExcel, ImagenesModal, Mensajes } from 'src/app/constants';
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
import { ReporteSolicitudInterface } from './solicitud.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { InformesDinamicosInterface } from './interfaces/informes-dinamicos.interface';

@Component({
  selector: 'app-informes-dinamicos',
  templateUrl: './informes-dinamicos.component.html',
  styleUrls: ['./informes-dinamicos.component.scss']
})
export class InformesDinamicosComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'fechaRegistro', 
    'codigoSolicitud',
    'comisaria', 
    'direccioncomisaria', 
    'nombreCompletoFuncionario', 
    'codigoTipoDocumentoFuncionario', 
    'tipoDocumentoFuncionario',
    'numeroDocumentoFuncionario', 
    'cargoFuncionario', 
    'correoElectronicoFuncionario', 
    'contactoTelefonoFijoFuncionario',
    'contactoCelularFuncionario',
    'nombreCompletoInvolucrado',  
    'fechaNacimientoInvolucrado', 
    'edadInvolucrado', 
    'codigoTipoDocumentoInvolucrado', 
    'tipoDocumentoInvolucrado', 
    'numeroDocumentoInvolucrado', 
    'fechaExpedicionDocInvolucrado', 
    'lugarExpedicionDocInvolucrado', 
    'codigoPaisInvolucrado', 
    'paisInvolucrado', 
    'codigoDepartamentoInvolucrado',
    'departamentoInvolucrado',  
    'codigoCidudadInvolucrado', 
    'ciudadMunicipioInvolucrado', 
    'correoElectronicoInvolucrado', 
    'contactoFijoInvolucrado', 
    'contactoConfianzaInvolucrado',
    'direccionUbicacionInvolucrado', 
    'sexoGeneroInvolucrado',    
    'identidadGeneroInvolucrado', 
    'orientacionSexualInvolucrado', 
    'nivelAcademicoInvolucrado', 
    'vicitmaEsPoblacionProteccionEspecial',
    'victimaPoneHechos',
    'rol', 
    'descripcionDeHechos', 
    'fechaHechoViolento', 
    'horaHechoViolento', 
    'descripcionLugareHechos'
  ];
  dataSource = new MatTableDataSource<InformesDinamicosInterface>([]);
  formulario: FormGroup = new FormGroup({});
  respuesta: InformesDinamicosInterface[] = [];
  verTabla: boolean = false;
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  public mostrarValidaciones = false;
  public mensaje = 'La fecha inicial es mayor a la final';
  public listaTipoDocumento: DominioInterface[] = [];
  public tiposViolencia: DominioInterface[] = [];
  public minDate!: Date;
  public maxDate!: Date;
  private objUser!: any;

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
    this.store.select('tipo_documento').subscribe(({tipo_documento}) => {
      this.listaTipoDocumento = tipo_documento;
    });
    this.sharedService.getDominio('PRESOL_DENUNS')
  }

  construirFormulario() {
    this.formulario = this.fb.group({
      tipoDocumento: ['', ],
      numeroDocumento: ['',],
      codigoSolicitud: [,],
      fechaInicial: [],
      fechaFinal: []
    },
    {
      validators: [
        validarDocumento()
      ]
    });
  }

  private getReportes(body: ReporteSolicitudInterface){

    this.sharedService.reporteSolicitud(body).subscribe({
      next: (data: ResponseInterface) => {
        if(data.data.datosPaginados && data.data.datosPaginados.length > 0)
        {
          this.respuesta = data.data.datosPaginados;
          this.verTabla = true;
        }
        else
        {
          this.respuesta = [];
          this.verTabla = false;
        }
        this.dataSource = new MatTableDataSource(this.respuesta);
        this.dataSource.paginator = this.paginator;
      }, 
      error: () => {

      }
    });
  }

  /**
   * @description cambia el maximo de la fecha final
   */
  public agregarMaxDate(){
    const añoInicial: any = this.datePipe.transform(this.formulario.get('fechaInicial')?.value,'YYYY');
    const mesInicial: any = this.datePipe.transform(this.formulario.get('fechaInicial')?.value,'MM');
    const diaInicial: any = this.datePipe.transform(this.formulario.get('fechaInicial')?.value,'dd');
    this.minDate = new Date( parseInt(añoInicial), parseInt(mesInicial) - 1, parseInt(diaInicial));
    this.maxDate = new Date( parseInt(añoInicial), parseInt(mesInicial) , parseInt(diaInicial));
  }

  /**
   * @description valida que la la fecha inicial sea menor a la final
   * @returns boolean
   */
  public FechaInicialMayorAFinal(): boolean {
    return this.formulario.hasError('fechaInialMayorAFinal');
  }
/**
 * @description valida que el campo de numero de documento se llene cuando se selecciona un tipo de documento
 * @returns boolean
 */
  public requiredNumeroDocumento(): boolean {
    return this.formulario.hasError('requioredNumeroDocumento');
  }
  /**
   * @description valida que el campo de tipo de documento se llene cuando se llena el numero de documento
   * @returns boolean
   */
  public requiredTipoDocumento(): boolean {
    return this.formulario.hasError('requiredTipoDocumento');
  }

  public getReporte(){
    this.mostrarValidaciones = false
   
    if (this.formulario.valid) {
        this.getReportes(this.getDatafilter)
    } else {
      this.mostrarValidaciones = true;
    }
 
  }

  private get getDatafilter(): ReporteSolicitudInterface{
    let fechaInicial = this.formulario.value.fechaInicial;  
    let fechaFinal = this.formulario.value.fechaFinal;
    let tipoDocumento = this.formulario.value.tipoDocumento;
    let numeroDcumento: string | null;
    (this.formulario.value.numeroDocumento === '') ? numeroDcumento = null : numeroDcumento = this.formulario.value.numeroDocumento;
    (this.formulario.value.tipoDocumento === '') ? tipoDocumento = null : tipoDocumento = this.formulario.value.tipoDocumento;
    return {
      codigoSolicitud: this.formulario.get('codigoSolicitud')?.value,
      fechaSolicitudDesde: fechaInicial,
      fechaSolicitudHasta: fechaFinal,
      numeroDocumento: numeroDcumento,
      codigoTipoDocumento: tipoDocumento,
    }
  }

  exportarExcel() : void {

    const worksheet: xls.WorkSheet = xls.utils.json_to_sheet(this.respuesta);
    const workbook: xls.WorkBook = xls.utils.book_new();
    xls.utils.book_append_sheet(workbook, worksheet, DescargasExcel.NOMBRE_HOJA_INOFORME);
    const excelBuffer: any = xls.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.generarArchivo(excelBuffer, DescargasExcel.INFORMES_SOLICITUDES);
  }

  private generarArchivo(buffer: any, fileName: string) : void {
      const data: Blob = new Blob([buffer], { type: DescargasExcel.EXCEL_TYPE });
      FileSaver.saveAs(data, fileName + DescargasExcel.EXTENSION);
  }

  private msgError() {
    Modales.modalExito(
      Mensajes.MENSAJE_ERROR_G,
      ImagenesModal.EXCLAMACION,
      this._dialog
    );
  }
}
