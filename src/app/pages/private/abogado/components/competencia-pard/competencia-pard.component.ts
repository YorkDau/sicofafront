import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CodigosRespuesta, ImagenesModal, Mensajes } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { Modales } from 'src/app/shared/modals';
import { AbogadoService } from '../../services/abogado.service';

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

  constructor(
    private abogadoService: AbogadoService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private modales: Modales,
    private router: Router
  ) { }
  
  ngOnInit(): void {
    this.objSol = JSON.parse(sessionStorage.getItem('info')!);
    this.initForm();
  }

  get f() {
    return this.form.controls;
  }

  initForm() {
    this.form = this.formBuilder.group({
      competenciaIcbf: ['no'],
      observaciones: ['', Validators.compose([Validators.maxLength(3000), Validators.required])]
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
      observacion: this.f.observaciones.value
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

}
