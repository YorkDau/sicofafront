import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CodigosRespuesta, ImagenesModal, Mensajes } from 'src/app/constants';
import { Modales } from 'src/app/shared/modals';
import { SharedFunctions } from 'src/app/shared/functions';
import {
  validarRemisionNoPersonalizada,
  validarRemisionPersonalizada,
} from './validators';
import { PdfExport } from 'src/app/pages/private/abogado/gestion-remision/generar-remision/reportes/pdf-export';
import {
  CargaArchivoRemision,
  InvolucradoRemision,
  TipoRemisionInterface,
} from '../../../interfaces/tipo-remision.interface';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { DataReporteByID, DataReporteInterface } from '../../../interfaces/data-reporte.interface';
import { RemisionService } from '../../services/remision.service';
import { SharedService } from 'src/app/services/shared.service';
import { Router } from '@angular/router';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ComisariaService } from '../../../comisario/administracion/services/comisaria.service';

@Component({
  selector: 'app-generar-remision',
  templateUrl: './generar-remision.component.html',
  styleUrls: ['./generar-remision.component.scss'],
})
export class GenerarRemisionComponent implements OnInit {
  public myForm!: FormGroup;
  public mostrarValidaciones: boolean = false;
  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;
  public listaTipoRemisiones: TipoRemisionInterface[] = [];
  public listaInvolucrados: InvolucradoRemision[] = [];
  public dataReporte!: DataReporteInterface;
  public dataReporteByID!: DataReporteByID;
  public objSol!: any;
  private archivo!: string | null;
  private user!: UserInterface;

  constructor(
    private fb: FormBuilder,
    private _dialog: MatDialog,
    private remisionService: RemisionService,
    private comisariaService: ComisariaService,
    private sharedService: SharedService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.objSol = JSON.parse(sessionStorage.getItem('info')!);
    this.user = this.authService.currentUserValue!;
  }

  ngOnInit(): void {
    this.obtenerInfoID();
    this.cargarForm();
    this.getListaInvolucrados();
    this.cambioRemisionPersonalizada();
  }

  private obtenerInfoID(){
    this.comisariaService.getInformacionComisariaByID(this.objSol.idSolicitud).subscribe({
      next: (resp) =>{
        this.dataReporteByID = resp.data;
      }
    })
  }
  
  /**
   * @description carga formulario
   */
  private cargarForm() {
    this.myForm = this.fb.group(
      {
        requiereRemision: false,
        remision: '',
        nombreRemision: '',
        involucrado: ['', [Validators.required]],
      },
      {
        validators: [
          validarRemisionPersonalizada(),
          validarRemisionNoPersonalizada(),
        ],
      }
    );
  }

  /**
   * @description carga el select de involucrados
   */
  private getListaInvolucrados() {
    this.remisionService.getInvolucrados(this.objSol.idSolicitud).subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
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
   * @description carga oculta las validaciones cuando marcan o desmarcan el check de requiere remision personalizada
   */
  private cambioRemisionPersonalizada() {
    this.myForm.get('requiereRemision')?.valueChanges.subscribe((_) => {
      this.mostrarValidaciones = false;
      this.myForm.get('remision')?.setValue('');
      this.myForm.get('nombreRemision')?.setValue('');
    });
  }

  /**
   * @description Metodo para cargar medidas provisionales dependiendo del involucrado
   */
  public cargarSelectTipoRemisiones(event: any) {
    this.myForm.get('remision')?.setValue('');
    if (event.target.value != 0) {
      this.remisionService
        .getRemisionesDisponibles(event.target.value)
        .subscribe({
          next: (data: ResponseInterface) => {
            if (data.statusCode === CodigosRespuesta.OK) {
              this.listaTipoRemisiones = data.data;
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
   * @description obtiene los datos de la remision seleccionada
   */
  public obtenerDatosRemision(event: any) {
    const involucrado = this.myForm.controls['involucrado'].value;
    if (event.target.value != 0) {
      this.remisionService
        .getGenerarRemisionReporte(
          this.objSol.idSolicitud,
          +involucrado,
          event.target.value
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
   * @description valida que los campos sean obligatorios o requeridos
   * * @param campo variable para ingresar el campo requerido
   */
  public isRequired(campo: string): boolean {
    return this.myForm.controls[campo].hasError('required');
  }

  /**
   * @description habilita o deshabilita las remision personalizada
   */
  public hablitarRemisionPersonalizada(): boolean {
    return this.myForm.get('requiereRemision')?.value;
  }

  /**
   * @description Solo permite ingresar numeros
   */
  public soloNumero(campo: string) {
    SharedFunctions.soloNumero(campo, this.myForm);
  }

  /**
   * @description Solo permite ingresar expresion regular
   */
  public soloLetras(campo: string) {
    SharedFunctions.soloLetras(campo, this.myForm);
  }

  /**
   * @description campo Remision requerido cuando remision personalizada esta check
   * hace validacion personal en validators.ts
   */
  public isRequiredRemisionPersonalizada(): boolean {
    return this.myForm.hasError('requiredRemisionPersonalizada');
  }

  /**
   * @description campo Remision requerido cuando remision personalizada no esta check
   * hace validacion personal en validators.ts
   */
  public isRequiredRemisionNoPersonalizada(): boolean {
    return this.myForm.hasError('requiredRemisionNoPersonalizada');
  }

  public enviarArchivo(e: string) {
    this.archivo = e;
  }

  /**
   * @description guarda el archivo de la remision
   */
  private guardarArchivoRemision(obj: CargaArchivoRemision) {
    this.sharedService.guardarArchivoRemision(obj).subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          Modales.modalExito(
            Mensajes.MENSAJE_CARGA,
            ImagenesModal.OK,
            this.dialog
          );
          this.router.navigate([
            '../abogado/gestion-remision',
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
   * @description para imprimir se valida que los campos esten llenos
   */
  public imprimir() {
    this.mostrarValidaciones = false;

    if (this.myForm.invalid) {
      this.mostrarValidaciones = true;
    } else {
      this.generarPDF();
    }
  }

  /**
   * @description para guardar se valida que los campos esten llenos
   */
  public guardar() {
    this.mostrarValidaciones = false;

    if (this.myForm.invalid) {
      this.mostrarValidaciones = true;
    } else {
      if (this.archivo) {
        this.guardarArchivoRemision(this.getDataPostRemision);
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
   * @description genera los pdf de la remision
   */
  public generarPDF() {
    const tipoReporte = this.myForm.controls['remision'].value;
    switch (tipoReporte) {
      case 'Oficio_Remisorio_Medicina_legal':
        PdfExport.generarPdfOficioMedicinaLegal(this.dataReporte, this.dataReporteByID);
        break;
      case 'Remision_secretaria_de_la_Mujer_u_otro_organo':
        PdfExport.generarPdfOficioSecretariaMujer(this.dataReporte, this.dataReporteByID);
        break;
      case 'Remision_Proceso_Psicologia_Externa':
        PdfExport.generarPdfRemisionPsicologia(this.dataReporte, this.dataReporteByID);
        break;
      case 'Remision_Apoyo_Policivo_Victima_Mujer':
        PdfExport.generarPdfApoyoPolicivoMujer(this.dataReporte, this.dataReporteByID);
        break;
      case 'Recepcion_Denuncia_Fiscalia':
        PdfExport.generarPdfDenunciaFiscalia(this.dataReporte, this.dataReporteByID);
        break;
      case 'Remision_Visita_domiciliaria':
        PdfExport.generarPdfVisitaDomiciliaria(this.dataReporte, this.dataReporteByID);
        break;
      case 'Solicitud_afiliacion_Regimen_de_salud':
        PdfExport.generarPdfRemisionSistemaSalud(this.dataReporte, this.dataReporteByID);
        break;
      case 'Solicitud_Protocolo_de_Riesgo':
        PdfExport.generarPdfProtocoloRiesgo(this.dataReporte, this.dataReporteByID);
        break;
      case 'Remision_Formato_Personeria':
        PdfExport.generarPdfRemisionPersoneria(this.dataReporte, this.dataReporteByID);
        break;
      case 'Solicitud_Historia_Clinica':
        PdfExport.generarPdfHistoriaClinica(this.dataReporte, this.dataReporteByID);
        break;
      case 'Remision_Tratamiento_Terapeutico':
        PdfExport.generarPdfRemisionSistemaSalud(this.dataReporte, this.dataReporteByID);
        break;
      case 'Solicitud_Evaluacion_del_Riesgo_Remisiones_NNA':
        PdfExport.generarPdfHistoriaClinica(this.dataReporte, this.dataReporteByID);
        break;
    }
  }

  /**
   * @description obtiene la informacion a enviar para la remision
   */
  private get getDataPostRemision(): CargaArchivoRemision {
    let tipoDocumento = '';
    let nombrearchivo = null;
    if (this.myForm.get('requiereRemision')?.value) {
      tipoDocumento = 'Otro';
      nombrearchivo = this.myForm.get('nombreRemision')?.value;
    } else {
      tipoDocumento = this.myForm.get('remision')?.value;
    }
    return {
      entrada: this.archivo!,
      nombrearchivo,
      tipoDocumento,
      idSolicitudServicio: this.objSol.idSolicitud,
      idUsuario: this.user.userID,
      idInvolucrado: this.myForm.get('involucrado')?.value,
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
