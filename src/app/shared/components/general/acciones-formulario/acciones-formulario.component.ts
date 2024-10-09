import { Component, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import {
  CodigosPerfil,
  CodigosRespuesta,
  ImagenesModal,
  Mensajes,
} from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { SharedService } from 'src/app/services/shared.service';
import { Modales } from 'src/app/shared/modals';

@Component({
  selector: 'app-acciones-formulario',
  templateUrl: './acciones-formulario.component.html',
  styles: [],
})
export class AccionesFormularioComponent implements OnDestroy {
  @Input() callBackFunction!: () => Observable<boolean>;
  @Input() callBackFunctionNative!: () => Observable<boolean>;
  @Input() mostrarGuardar: boolean = true;

  private subFunction!: Subscription;

  public objSol!: any;
  public user!: UserInterface | undefined;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private sharedService: SharedService,
    private authService: AuthService
  ) {
    this.objSol = JSON.parse(sessionStorage.getItem('info')!);
    this.user = this.authService.currentUserValue;
  }

  ngOnDestroy(): void {
    if (this.subFunction) this.subFunction.unsubscribe();
  }

  /**
   * @description muestra modal de cancelar solicitud
   */
  public cancelarSolicitud() {
    Modales.modalConfirmacion(
      Mensajes.MENSAJE_CANCELAR_SOL,
      this.dialog,
      ImagenesModal.EXCLAMACION
    ).subscribe((res) => {
      if (res) {
        this.redireccionar();
      }
    });
  }

  /**
   * @description redirecciona a la ruta casos
   */
  private redireccionar() {
    const perfil = this.user?.perfil;
    if (perfil === CodigosPerfil.ABOGADO) {
      this.router.navigate(['../abogado/casos']);
    } else if (perfil === CodigosPerfil.COMISARIO) {
      this.router.navigate(['../comisario/casos']);
    } else {
      this.router.navigate(['../trabajador-social/casos']);
    }
  }

  /**
   * @description muestra modal cerrar actuación
   */
  public modalConfirmaCerrarActuacion() {
    Modales.modalConfirmacion(
      Mensajes.MENSAJE_CERRAR_ACT,
      this.dialog,
      ImagenesModal.EXCLAMACION
    ).subscribe((res) => {
      if (res) this.validarEjecucionCallBackFunction();
    });
  }

  /**
   * @description llama servicio cerrar actuación
   */
  private cerrarActuacion() {
    this.sharedService
      .cerrarActuaciones(this.retornarObjCerrarActuacion())
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            Modales.modalExito(
              Mensajes.MENSAJE_CERRAR_SOLICITUD,
              ImagenesModal.OK,
              this.dialog
            );
            this.redireccionar();
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

  /**
   * @description arma objeto para cerrar la actuación
   * @returns interface
   */
  private retornarObjCerrarActuacion(): any {
    return {
      tareaID: this.objSol.idTarea,
      userID: this.user?.userID,
      perfilCod: '',
    };
  }

  /**
   * @description llama servicio de guardar
   */
  public guardar() {
    this.subFunction = this.callBackFunction().subscribe();
  }

  /**
   * @description valida que la ejecución de la función sea correcta para cerrar la actuación
   */
  private validarEjecucionCallBackFunction() {
    if (this.callBackFunctionNative) {
      this.subFunction = this.callBackFunctionNative().subscribe((d) => {
        if (d) {
          this.cerrarActuacion();
        }
      });
    } else {
      this.cerrarActuacion();
    }
  }
}
