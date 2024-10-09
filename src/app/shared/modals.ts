import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { ModalConfirmacionComponent } from './modal-confirmacion/modal-confirmacion.component';
import { ModalExitoComponent } from './modal-exito/modal-exito.component';
import { ModalInfoComponent } from './modal-info/modal-info.component';
import { ImagenesModal, Mensajes } from 'src/app/constants';
import { RecepcionCasosInterface } from '../interfaces/recepcion-casos.interface';
import { SharedService } from '../services/shared.service';
import { Router } from '@angular/router';
import { SidenavComponent } from './components/general/sidenav/sidenav.component';
import { UserInterface } from '../interfaces/usuario.interface';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class Modales {
  public dialogRef: any;
  currentUser!: UserInterface;
  constructor(
    private dialog: MatDialog,
    private sharedService: SharedService,
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.currentUserValue!;
  }

  /**
   * @description muestra modal información
   * @param mensaje mensaje a mostrar
   * @param image imagen de mensaje {alerta, info, error}
   */
  public modalInformacion(
    mensaje: string,
    image?: string
  ): Observable<boolean> {
    let subject = new Subject<boolean>();

    const dialogRef = this.dialog.open(ModalInfoComponent, {
      panelClass: 'modal-info',
      disableClose: true,
      data: {
        mensaje,
        image,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      subject.next(result);
    });

    return subject.asObservable();
  }

  /**
   * @description muestra modal confirmación
   * @param mensaje mensaje a mostrar
   * @param dialog instancia dialog
   * @param contenidoMensaje contenido del mensaje de confirmacion
   * @returns Observable
   */
  public modalConfirmacion(
    mensaje: string,
    contenidoMensaje?: string,
    image: string = ImagenesModal.EXCLAMACION,
    botonAceptar?: string,
    botonCancelar?: string
  ): Observable<boolean> {
    let subject = new Subject<boolean>();

    const dialogRef = this.dialog.open(ModalConfirmacionComponent, {
      panelClass: ['dialog-responsive', 'modal-conf'],
      disableClose: true,
      data: {
        mensaje,
        contenidoMensaje,
        image,
        botonAceptar,
        botonCancelar,
      },
      maxWidth: '494px',
      minHeight: '307px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      subject.next(result);
    });

    return subject.asObservable();
  }
  /**
   * Este modal despliega un mensaje de confirmacion para cerrar las actuaciones
   * @param tarea
   * @param navigate
   * @returns
   */
  public modalCerrarActuaciones(
    tarea: RecepcionCasosInterface,
    navigate?: string,
    valorEtiqueta?: string
  ): Observable<boolean> {
    let subject = new Subject<boolean>();
    const { perfil } = this.currentUser;
    navigate = navigate
      ? navigate
      : SidenavComponent.getRutaPerfil(perfil!)[0].ruta!;
    this.modalConfirmacion(Mensajes.MENSAJE_CERRAR_ACT).subscribe((ok) => {
      if (ok) {
        if (tarea.idTarea) {
          this.sharedService
            .cerrarActuaciones({
              tareaID: tarea.idTarea,
              perfilCod: perfil!,
              userID: 0,
              valorEtiqueta,
            })
            .subscribe((cerrar) => {
              if (cerrar && cerrar.statusCode == 200) {
                subject.next(true);
                sessionStorage.removeItem('info');
                this.router.navigate([navigate]);
              } else {
                subject.next(false);
                this.modalInformacion(Mensajes.MENSAJE_ERROR_G);
              }
            });
        }
      } else {
        subject.next(false);
      }
    });
    return subject.asObservable();
  }
  /**
   * Este modal despliega un mensaje de confirmacion para cerrar las actuaciones
   * @param tarea
   * @param navigate
   * @returns
   */
  public modalArchivarDiligencias(
    tarea: RecepcionCasosInterface,
    navigate: string = '/abogado/casos'
  ): Observable<boolean> {
    let subject = new Subject<boolean>();
    const { perfil } = this.currentUser;
    this.modalConfirmacion(
      Mensajes.MENSAJE_ARCHIVAR_DILIGENCIAS,
      undefined,
      ImagenesModal.EXCLAMACION,
      `Continuar`,
      `Cancelar`
    ).subscribe((razonCerrarDiligencias: any) => {
      if (razonCerrarDiligencias) {
        if (tarea.idTarea) {
          this.sharedService
            .archivarDiligencias({
              tareaID: tarea.idTarea,
              perfilCod: perfil!,
              userID: 0,
              descripcion: razonCerrarDiligencias,
            })
            .subscribe((diligencias) => {
              if (diligencias && diligencias.statusCode == 200) {
                sessionStorage.removeItem('info');
                this.router.navigate([navigate]);
                subject.next(true);
              } else {
                subject.next(false);
                this.modalInformacion(Mensajes.MENSAJE_ERROR_G);
              }
            });
        }
      } else {
        this.modalInformacion('No se archivaron las diligencias');
        subject.next(false);
      }
    });
    return subject.asObservable();
  }
  /**
   * Este modal despliega un mensaje de confirmacion para
   * cancelar y redirigir al usuario, además borrará sessionStorage.info.
   * @param navigate
   * @returns
   */
  public modalCancelar(
    navigate: string = '/abogado/casos'
  ): Observable<boolean> {
    let subject = new Subject<boolean>();
    this.modalConfirmacion(
      Mensajes.MENSAJE_CANCELAR_MODAL,
      undefined,
      ImagenesModal.EXCLAMACION,
      `Continuar`,
      `Cancelar`
    ).subscribe((ok) => {
      if (ok) {
        sessionStorage.removeItem('info');
        this.router.navigate([navigate]);
      }
      subject.next(ok);
    });
    return subject.asObservable();
  }
  /**
   * @description muestra modal información
   * @param mensaje mensaje a mostrar
   * @param dialog componente dialog
   * @param image imagen de mensaje {alerta, info, error}
   */
  static modalInformacion(mensaje: string, dialog: MatDialog, image: string) {
    dialog.open(ModalInfoComponent, {
      panelClass: 'modal-info',
      disableClose: true,
      data: {
        mensaje,
        image,
      },
    });
  }

  /**
   * @description muestra modal confirmación
   * @param mensaje mensaje a mostrar
   * @param dialog instancia dialog
   * @param contenidoMensaje contenido del mensaje de confirmacion
   * @returns Observable
   */
  static modalConfirmacion(
    mensaje: string,
    dialog: MatDialog,
    image?: string
  ): Observable<boolean> {
    let subject = new Subject<boolean>();

    const dialogRef = dialog.open(ModalConfirmacionComponent, {
      minWidth: '494px',
      minHeight: '307px',
      maxWidth: '550px',
      disableClose: true,
      data: {
        mensaje,
        image,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      subject.next(result);
    });

    return subject.asObservable();
  }

  /**
   * @description abre modal de éxito
   * @param mensaje mensaje para mostrar
   * @param image ruta de la imagen
   * @param dialog instancia dialog
   */
  static modalExito(mensaje: string, image: string, dialog: MatDialog) {
    dialog.open(ModalExitoComponent, {
      panelClass: 'modal-exito-error',
      data: {
        mensaje,
        image,
      },
    });
  }

  /**
   * @description abre modal de éxito
   * @param mensaje mensaje para mostrar
   * @param image ruta de la imagen
   * @param dialog instancia dialog
   */
  public modalExito(
    mensaje: string,
    image: string = '/assets/images/check.svg'
  ) {
    let modal = this.dialog.open(ModalExitoComponent, {
      panelClass: 'modal-exito-error',
      disableClose: true,
      data: {
        mensaje,
        image,
      },
    });

    return modal.afterClosed();
  }
}
