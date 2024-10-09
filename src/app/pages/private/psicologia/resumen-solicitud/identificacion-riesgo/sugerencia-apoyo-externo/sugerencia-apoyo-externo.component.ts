import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  CodigosRespuesta,
  ImagenesModal,
  TipoReportePdf,
  TiposDocumentoCarga,
} from 'src/app/constants';
import { Modales } from 'src/app/shared/modals';
import { EntrevistaPsicologicaEmocionalService } from '../../../services/entrevista-psicologica-emocional.service';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { SugerenciaApoyo } from 'src/app/pages/private/interfaces/psicologia.interface';
import { lastValueFrom } from 'rxjs';
import { SharedService } from '../../../../../../services/shared.service';
import { Title } from '@angular/platform-browser';
import { ArchivoInterface } from '../../../../../../interfaces/shared.interfaces';
import { SharedFunctions } from 'src/app/shared/functions';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sugerencia-apoyo-externo',
  templateUrl: './sugerencia-apoyo-externo.component.html',
  styleUrls: ['./sugerencia-apoyo-externo.component.scss'],
})
export class SugerenciaApoyoExternoComponent implements OnInit {
  public temp: number = 0;
  public seguridad: boolean = true;
  public redes: boolean = false;
  public myForm!: FormGroup;
  public checkSeguridad: SugerenciaApoyo[] = [];
  public checkRedesApoyo: SugerenciaApoyo[] = [];
  public textoFile: string = '';
  public tipoPdf = TipoReportePdf.SEGURIDAD_REDES_APOYO;
  public file!: ArchivoInterface | null;
  public idSolicitud: number = 0;
  public cargarHtml: boolean = false;

  public tarea = JSON.parse(sessionStorage.getItem('info')!);

  constructor(
    private fb: FormBuilder,
    private entrevistaService: EntrevistaPsicologicaEmocionalService,
    private sharedService: SharedService,
    private modales: Modales,
    private title: Title,
    private spinner: NgxSpinnerService
  ) {
    this.title.setTitle(
      'SICOFA - Identificación riesgo - Sugerencias de apoyo externo'
    );

    this.obtenerArchivoCargado();
  }

  ngOnInit(): void {
    this.cargarForm();
    this.cargarCheckSeguridad();
    this.cargarCheckRedesApoyo();
  }

  /**
   * @description Carga formulario
   */
  private cargarForm() {
    this.myForm = this.fb.group({});
  }

  /**
   * @description cambia valores del tab
   * @param tab valor del tab
   */
  public cambiarTab(tab: number) {
    if (tab === 0) {
      this.seguridad = true;
      this.redes = false;
    } else if (tab === 1) {
      this.seguridad = false;
      this.redes = true;
    }
  }

  /**
   * @description Al menos un campo debe estar seleccionado en Seguridad
   * hace validacion personal en validators.ts
   */
  public isRequiredSeguridad(): boolean {
    return this.myForm.hasError('requiredSeguridad');
  }

  /**
   * @description Al menos un campo debe estar seleccionado en Redes de Apoyo
   * hace validacion personal en validators.ts
   */
  public isRequiredRedes(): boolean {
    return this.myForm.hasError('requiredRedes');
  }

  /**
   * @description el campo confirmo que el documento esta firmado debe estar seleccionado
   * hace validacion personal en validators.ts
   */
  public isRequiredConfirmar(): boolean {
    return this.myForm.hasError('requiredConfirmar');
  }

  /**
   * @description carga los check de la parte de Seguridad
   */
  private cargarCheckSeguridad() {
    this.entrevistaService
      .getSeguridad(this.tarea.idSolicitud)
      .subscribe((data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.checkSeguridad = data.data;
        }
      });
  }

  /**
   * @description carga los check de la parte de Redes de Apoyo
   */
  private cargarCheckRedesApoyo() {
    this.entrevistaService
      .getRedesApoyo(this.tarea.idSolicitud)
      .subscribe((data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.checkRedesApoyo = data.data;
        }
      });
  }

  public archivarDiligencias() {
    this.modales.modalArchivarDiligencias(this.tarea, '/psicologia');
  }

  public cancelar() {
    this.modales.modalCancelar('/psicologia');
  }

  public cerrarActuaciones() {
    if (this.file) {
      this.modales.modalCerrarActuaciones(this.tarea, '/psicologia');
    } else {
      this.modales.modalInformacion(
        `Debe cargar el documento`,
        ImagenesModal.EXCLAMACION
      );
    }
  }

  cargarArchivo(base64: string) {
    if (base64) {
      this.sharedService
        .guardarArchivo({
          idSolicitudServicio: this.tarea.idSolicitud,
          entrada: base64,
          nombrearchivo: null,
          tipoDocumento: TiposDocumentoCarga.SUGERENCIAS_DE_APOYO_EXTERNO,
        })
        .subscribe(async (result) => {
          if (result && result.statusCode == 200) {
            await this.obtenerArchivoCargado();
            this.modales.modalExito('Archivo cargado exitosamente');
          }
        });
    }
  }

  async obtenerArchivoCargado() {
    const resultConsultar = await lastValueFrom(
      this.sharedService.ConsultarArchivos(
        this.tarea.idSolicitud,
        TiposDocumentoCarga.SUGERENCIAS_DE_APOYO_EXTERNO
      )
    );
    if (
      resultConsultar &&
      resultConsultar.statusCode == 200 &&
      resultConsultar.data &&
      resultConsultar.data[0]
    ) {
      this.file = {
        idSolicitud: this.tarea.idSolicitud,
        idArchivo: resultConsultar.data[0].idSolicitudDocumento,
        nombreArchivo: resultConsultar.data[0].nombreDocumento,
      };
    }
  }

  /**
   *
   * @description Imprime formato PDF
   * @param completo True: si es el formato completo False: si es formato vacio
   */
  imprimirPDF(completo?: boolean) {
    this.cargarHtml = true;
    if (completo) {
      this.idSolicitud = this.tarea.idSolicitud;
    } else {
      this.idSolicitud = 0;
    }
    this.temp = Date.now();
  }
}
