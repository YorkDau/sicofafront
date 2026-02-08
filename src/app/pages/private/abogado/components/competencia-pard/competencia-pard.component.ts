import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CodigosRespuesta, ImagenesModal, Mensajes } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { Modales } from 'src/app/shared/modals';
import { AbogadoService } from '../../services/abogado.service';

import { SharedService } from 'src/app/services/shared.service';
import { ArchivoInterface } from 'src/app/interfaces/shared.interfaces';

@Component({
  selector: 'app-competencia-pard',
  templateUrl: './competencia-pard.component.html',
  styleUrls: ['./competencia-pard.component.scss']
})
export class CompetenciaPardComponent implements OnInit {

  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;
  public msgInvalido: string = Mensajes.MENSAJE_CAMPO_INV;

  public mostrarValidaciones: boolean = false;
  public form!: FormGroup;
  private objSol!: any;

  public iFileConstancia: ArchivoInterface = {}; // Constancia
  public iFileActa: ArchivoInterface = {}; // Acta de verificacion
  public iFileAuto: ArchivoInterface = {}; // Auto apertura

  constructor(
    private abogadoService: AbogadoService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private modales: Modales,
    private router: Router,
    
    private sharedService:SharedService
  ) { }
  
  ngOnInit(): void {
    this.objSol = JSON.parse(sessionStorage.getItem('info')!);
    this.initForm();
  }

  get f() {
    return this.form.controls;
  }
  get esMenor(){
    return this.objSol.tipo_presolicitud === 'DEN'
  }
  get esAdultoMayor(){
    return this.objSol.tipo_presolicitud === 'DENAM'
  }

  initForm() {
    this.form = this.formBuilder.group({
      competenciaIcbf: ['no'],
      observaciones: ['', Validators.compose([Validators.maxLength(3000), Validators.required])],
      adjuntoConstanciaTraslado:'',
      adjuntoActaVerificacion:'',
      adjuntoAutoTramite:''
    });
  }

  /**
   * @descripcion redirige a la consulta de tareas
   */
  cancelar() {
    this.modales.modalCancelar('/abogado/casos');
  }

  modalConfirmaCerrarActuacion() {
    if (this.form.valid) {
      Modales.modalConfirmacion(
        Mensajes.MENSAJE_CERRAR_ACT,
        this.dialog,
        ImagenesModal.EXCLAMACION
      ).subscribe((res) => {
        if (res) this.cerrarActuacion();
      });
    } else {
      this.mostrarValidaciones = true;
    }

  }

  public cerrarActuacion() {    
    this.abogadoService
      .cierreCompetenciaPard(this.retornarObjCerrarActuacion())
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            this.modales
              .modalExito(
                `Se ha registrado la competencia de la Pre-Solicitud de servicio.`
              )
              .subscribe(() => {
                this.router.navigate(['/abogado/casos']);
              });
          } else {
            Modales.modalInformacion(
              Mensajes.MENSAJE_ERROR_G,
              this.dialog,
              ImagenesModal.EXCLAMACION
            );
          }
        },
        error: () => {
          Modales.modalInformacion(
            Mensajes.MENSAJE_ERROR_G,
            this.dialog,
            ImagenesModal.EXCLAMACION
          );
        },
      });

  }

  private retornarObjCerrarActuacion(): any {
    return {
      idSolicitudServicio: this.objSol.idSolicitud,
      idTarea: this.objSol.idTarea,
      cierre: this.f.competenciaIcbf.value === 'si' ? true : false,
      observacion: this.f.observaciones.value,
      adjuntoConstanciaTraslado:this.f.adjuntoConstanciaTraslado.value,
      adjuntoActaVerificacion:this.f.adjuntoActaVerificacion.value,
      adjuntoAutoTramite:this.f.adjuntoAutoTramite.value
    };
  }

  public maxLength(campo: string): boolean {
    if (this.form.controls[campo]) {
      return this.form.controls[campo].hasError('maxlength');
    } else {
      return false;
    }
  }

  public isRequired(campo: string): boolean {
    return this.form.controls[campo].hasError('required');
  }

  public descargarDocumento(): void {
    const nombre: string = 'FORMATO TRASLADO.pdf';

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
  }

  /**
   * @description mensaje de error para lo servicios
   */
  private msgError() {
    this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
  }

  
  cargarConstancia(base64: string) {
    if (base64) {
      this.f.adjuntoConstanciaTraslado.setValue(base64);
    }
  }
  
  cargarActa(base64: string) {
    if (base64) {
      this.f.adjuntoActaVerificacion.setValue(base64);
    }
  }
  
  cargarAutoTramite(base64: string) {
    if (base64) {
      this.f.adjuntoAutoTramite.setValue(base64);
    }
  }
  
}
