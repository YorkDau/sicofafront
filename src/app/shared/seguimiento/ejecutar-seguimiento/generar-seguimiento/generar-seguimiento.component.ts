import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

import { CodigosRespuesta, ImagenesModal, Mensajes } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { RemisionService } from 'src/app/pages/private/abogado/services/remision.service';
import {
  CargaArchivoRemision,
  InvolucradoRemision,
} from 'src/app/pages/private/interfaces/tipo-remision.interface';
import { SeguimientoService } from 'src/app/services/seguimiento.service';
import { SharedService } from 'src/app/services/shared.service';
import { Modales } from 'src/app/shared/modals';
import {
  DataSeguimiento,
  TiposFormatoSeguimiento,
} from '../../interfaces/seguimiento.interface';
import { PdfExport } from './formatos/pdf-exports';

@Component({
  selector: 'app-generar-seguimiento',
  templateUrl: './generar-seguimiento.component.html',
  styleUrls: ['./generar-seguimiento.component.scss'],
})
export class GenerarSeguimientoComponent implements OnInit {
  public myForm!: FormGroup;
  public objSol!: any;
  public mostrarValidaciones: boolean = false;
  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;
  public listaInvolucrados: InvolucradoRemision[] = [];
  public dataReporte!: DataSeguimiento;
  public listaFormatos: TiposFormatoSeguimiento[] = [];
  private archivo!: string | null;
  public modo: string = 'formato';
  listaFormatosFiltrados: any[] = []; // La que se muestra en el select

  listaFormatosInforme = [{ id: '0001', nombre: 'Informe_Seguimiento' }];

  user!: UserInterface | undefined;

  constructor(
    private fb: FormBuilder,
    private remisionService: RemisionService,
    private _dialog: MatDialog,
    private segumientoService: SeguimientoService,
    private sharedService: SharedService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.user = this.authService.currentUserValue;
    this.objSol = JSON.parse(sessionStorage.getItem('info')!);
  }

  ngOnInit(): void {
    this.cargarForm();
    this.route.queryParams.subscribe((params) => {
      if (params['modo']) {
        this.modo = params['modo'];
        this.resetForm();
      }
    });
    this.getListInvolucrados();
  }
  private resetForm(): void {
    this.myForm.reset({
      involucrado: '',
      formato: '',
      nombreFormato: '',
    });
    this.listaFormatos = [];
    this.listaFormatosFiltrados = [];
    this.archivo = null;
    this.mostrarValidaciones = false;

    // Si necesitas mantener algún valor específico después del reset:
    // this.myForm.patchValue({
    //   algunCampoQueQuierasMantener: valor
    // });
  }
  /**
   * @description carga los campos del formulario
   */
  private cargarForm() {
    this.myForm = this.fb.group({
      involucrado: ['', [Validators.required]],
      formato: ['', Validators.required],
      nombreFormato: [''],
    });
  }

  /**
   * @description carga la informacion para el select de los involucrados
   */
  private getListInvolucrados() {
    this.remisionService.getInvolucrados(this.objSol.idSolicitud).subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode == CodigosRespuesta.OK) {
          this.listaInvolucrados = data.data;
        } else {
          this.msgError();
        }
      },
      error: () => {
        this.msgError();
      },
    });
  }
  /**
   * @description Carga la informacion para el select de los formularios segun el idInvolucrado
   */
  public getListaFormularios(event: any) {
    this.myForm.get('formato')?.setValue('');
    if (event.target.value != 0) {
      this.segumientoService
        .getListaFormatosSeguimiento(event.target.value, this.objSol.idTarea)
        .subscribe({
          next: (data: ResponseInterface) => {
            if (data.statusCode === CodigosRespuesta.OK) {
              this.listaFormatos = data.data;
              this.filtrarFormatos();
            } else {
              this.msgError();
            }
          },
          error: () => {
            this.msgError();
          },
        });
    } else {
      this.listaFormatos = [];
      this.listaFormatosFiltrados = [];
    }
  }

  /**
   * @description obtiene los datos del seguimiento seleccionado
   */
  public obtenerDatosSeguimiento(event: any) {
    const involucrado = this.myForm.controls['involucrado'].value;
    if (event.target.value !== 0) {
      this.segumientoService
      .getInformacionInvolucrado(
        this.objSol.idSolicitud,
        event.target.value,
        involucrado
      )
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            this.dataReporte = data.data;
          } else {
            this.msgError();
          }
        },
        error: () => {
          this.msgError();
        },
      });
      
    }
  }
  /**
   * @description se filtran los formatos dependiendo del modo
   */

  public filtrarFormatos() {
    if (this.modo === 'formato') {
      this.listaFormatosFiltrados = this.listaFormatos.filter(
        (f) => f.nombre !== 'Informe_Seguimiento'
      );
    } else if (this.modo === 'informe') {
      this.listaFormatosFiltrados = this.listaFormatos.filter(
        (f) => f.nombre === 'Informe_Seguimiento'
      );
    }
  }

  /**
   * @description hace la validacion para que los campos sean obligatorios
   */
  public isRequired(campo: string): boolean {
    return this.myForm.controls[campo].hasError('required');
  }

  public enviarArchivo(e: string) {
    this.archivo = e;
  }

  /**
   * @description guarda el archivo de seguimiento que se firmo
   */

  private guardarArchivoSeguimiento(obj: CargaArchivoRemision) {
    const formValue = this.myForm.value;

    const request: CargaArchivoRemision = {
      entrada: this.archivo ?? '',
      idInvolucrado: formValue.involucrado,
      idPruebaPericial: null,
      idSolicitudServicio: this.objSol.idSolicitud,
      idUsuario: this.user?.userID!,
      nombrearchivo: null,
      tipoDocumento: formValue.formato?.nombre,
    };

    this.sharedService.guardarArchivoRemision(request).subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          Modales.modalExito(
            Mensajes.MENSAJE_CARGA,
            ImagenesModal.OK,
            this.dialog
          );
          this.router.navigate([
            '../abogado/ejecutar-seguimiento',
            this.objSol.idSolicitud,
          ]);
        } else {
          Modales.modalExito(
            Mensajes.MENSAJE_CARGA_ERROR,
            ImagenesModal.EXCLAMACION,
            this.dialog
          );
        }
      },
    });
  }

  /**
   * @description se valida que los campos necesarios esten llenos para poder generar
   * el pdf
   */
  public imprimir() {
    this.mostrarValidaciones = false;
    if (this.myForm.invalid) {
      this.mostrarValidaciones = true;
    } else {
      const formato = this.myForm.controls['formato'].value.nombre;
      let nombre = formato + ".pdf";
      this.sharedService.descargarFormatos(nombre, 'ss').subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            const source = `data:application/pdf;base64,${data.data}`;
            const link = document.createElement('a');
            const fileName = nombre;
            link.href = source;
            link.download = `${fileName}`;
            link.click();
          } else {
            this.msgError();
          }
        },
        error: () => {
          this.msgError();
        },
      });

      // const idRemision = this.myForm.controls['formato'].value.idRemision;
      // const formato = this.myForm.controls['formato'].value.nombre;
      // if (idRemision === 58) {
      // } else {
      //   this.generarPDF();
      // }
    }
  }

  /**
   * @description para guardar el seguimiento se valida que los campos esten llenos
   */
  public guardar() {
    this.mostrarValidaciones = false;
    if (this.myForm.invalid) {
      this.mostrarValidaciones = true;
    } else {
      if (this.archivo) {
        this.guardarArchivoSeguimiento(this.getDataPostSeguimiento);
      } else {
        Modales.modalExito(
          Mensajes.MENSAJE_SIN_ARCHIVO,
          ImagenesModal.EXCLAMACION,
          this._dialog
        );
      }
    }
  }

  /**
   * @description genera los archivos pdf dependiendo del que se escogio en el select
   */

  public generarPDF() {
    const formato = this.myForm.controls['formato'].value.nombre;

    if (!formato) {
      console.warn('No se ha seleccionado un formato válido.');
      return;
    }

    if (!this.dataReporte) {
      console.warn('No hay datos disponibles para generar el reporte.');
      return;
    }

    if (this.modo === 'formato') {
      switch (formato) {
        case 'Constancia_De_Seguimiento_Contacto_Telefonico':
          PdfExport.generarPdfConstanciaSeguimientoContactoTelefonico(
            this.dataReporte
          );
          break;
        case 'Auto_Ordenando_Visita_Domiciliaria':
          PdfExport.generarPdfAutoOrdenandoVisitaDomiciliaria(this.dataReporte);
          break;
        case 'Informe_De_Seguimiento_Entrevista_Interventiva':
          PdfExport.generarPdfInformeSeguimientoEntrevistaInterventiva(
            this.dataReporte
          );
          break;
        case 'Formato_Seguimiento_Medidas_Proteccion':
          PdfExport.generarPdfFormatoSeguimientoMedidasProteccion(
            this.dataReporte
          );
          break;
        case 'Instrumento_Verificacion_De_La_Efectividad_De_La_Medida_De_Proteccion':
          PdfExport.generarPdfInstrumentoVerificacionEfectividadMedidasProteccion();
          break;
        case 'Instrumento_Para_El_Seguimiento_A_Las_Medidas_De_Atencion':
          PdfExport.generarPdfInstrumentoSeguimientoEfectividadMedidasAtencion();
          break;
        default:
          console.warn(`Formato no reconocido en modo 'formato': ${formato}`);
          break;
      }
    } else if (this.modo === 'informe') {
      switch (formato) {
        case 'Informe_Seguimiento':
          PdfExport.generarPdfFormatoSeguimiento(this.dataReporte);
          break;
        default:
          console.warn(`Formato no reconocido en modo 'informe': ${formato}`);
          break;
      }
    } else {
      console.warn(`Modo no reconocido: ${this.modo}`);
    }
  }

  /**
   * @description obtiene la informacion a enviar para el seguimiento
   */

  private get getDataPostSeguimiento(): CargaArchivoRemision {
    let tipoDocumento = '';
    let nombrearchivo = null;

    tipoDocumento = this.myForm.get('formato')?.value;
    return {
      entrada: this.archivo!,
      nombrearchivo,
      tipoDocumento,
      idSolicitudServicio: this.objSol.idSolicitud,
      idUsuario: this.user?.userID!,
      idInvolucrado: this.myForm.get('involucrado')?.value,
      idPruebaPericial: this.myForm.get('pericial')?.value,
    };
  }

  private msgError() {
    Modales.modalExito(
      Mensajes.MENSAJE_ERROR_G,
      ImagenesModal.EXCLAMACION,
      this._dialog
    );
  }
}
