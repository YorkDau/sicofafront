import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { lastValueFrom, Subscription, map } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import {
  CodigosPerfil,
  CodigosRespuesta,
  ImagenesModal,
  Mensajes,
} from 'src/app/constants';
import {
  SeccionesInterface,
  TreeInterface,
} from 'src/app/interfaces/auto.interface';

import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { AbogadoService } from 'src/app/pages/private/abogado/services/abogado.service';
import { AutoService } from 'src/app/pages/private/abogado/services/auto.service';
import { TextoAutoPipe } from 'src/app/pipes/texto-auto.pipe';
import { Modales } from 'src/app/shared/modals';
import { ReporteAutoPDF } from './report-pdf';

@Component({
  selector: 'app-generar-auto',
  templateUrl: './generar-auto.component.html',
  styleUrls: ['./generar-auto.component.scss'],
  providers: [TextoAutoPipe],
})
export class GenerarAutoComponent implements OnInit, OnDestroy {
  @ViewChild('textPadre') txtPadre!: ElementRef;
  @ViewChild('textHijo') txtHijo!: ElementRef;

  private autoPadreSub!: Subscription;
  private objSol!: any;
  private listaSeccionesSub!: Subscription;
  public listaSecciones: SeccionesInterface[] = [];

  public objAutoPadre!: TreeInterface;
  public comentarios: string = '';
  public checkAprobacionComisario: boolean = false;
  public tituloAuto: string = '';
  public ABOGADO = CodigosPerfil.ABOGADO;
  public COMISARIO = CodigosPerfil.COMISARIO;
  public user!: UserInterface | undefined;
  public titulo: string = '';
  public mostrarFallo: boolean = true;

  constructor(
    private autoService: AutoService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private abogadoService: AbogadoService,
    private textoAuto: TextoAutoPipe
  ) { }

  ngOnDestroy(): void {
    if (this.autoPadreSub) {
      this.autoPadreSub.unsubscribe();
      this.listaSeccionesSub.unsubscribe();
    }
    this.autoService.emitirSeccionHijaSeleccionada(null);
    this.autoService.emitirArregloSecciones([]);
    this.autoService.emitirTituloAuto(null);
  }

  ngOnInit(): void {
    this.objSol = JSON.parse(sessionStorage.getItem('info')!);
    this.user = this.authService.currentUserValue;
    this.asingarSuscripcion();
    this.asignarTitulo();
  }

  /**
   * @description asigna el título al formulario
   */
  private asignarTitulo() {
    if (this.objSol.actividad === 'Crear auto con medidas') {
      this.titulo = 'ADOPCIÓN DE MEDIDAS DE PROTECCIÓN';
    } else {
      this.titulo = 'GESTIÓN DE AUDIENCIA';
    }
  }

  /**
   * @description asigna suscripción del auto
   */
  private asingarSuscripcion() {
    this.autoPadreSub = this.autoService.seccion$.subscribe((p: any) => {
      this.objAutoPadre = p;
    });
    this.listaSeccionesSub = this.autoService.seccionesLista$.subscribe(
      (l) => (this.listaSecciones = l)
    );
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
    if (this.user?.perfil === CodigosPerfil.ABOGADO) {
      this.router.navigate(['../abogado/casos']);
    } else {
      this.router.navigate(['../comisario/casos']);
    }
  }

  /**
   * @description valida que sea válido el objeto para guardar
   */
  public validarAutoPrevioGuardar(cerrar: boolean) {
    if (this.validarCampoObservaciones()) {
      this.guardarAuto(cerrar);
    } else {
      Modales.modalInformacion(
        Mensajes.MENSAJE_CAMPO_OBSERVACIONES,
        this.dialog,
        ImagenesModal.EXCLAMACION
      );
    }
  }

  /**
   * @description llama servicio de guardar auto
   */
  private guardarAuto(cerrar: boolean) {
    this.autoService.guardarAuto(this.retornarObjGuardarPlantilla()).subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          if (cerrar) {
            this.cerrarActuacion(this.retornarObjCerrarActuacion());
          } else {
            Modales.modalExito(
              Mensajes.MENSAJE_OK,
              ImagenesModal.OK,
              this.dialog
            );
          }
        } else {
          this.modalError();
        }
      },
      error: () => {
        this.modalError();
      },
    });
  }

  /**
   * @description crea objeto para guardar la plantilla
   * @returns objeto a guardar
   */
  private retornarObjGuardarPlantilla(): any {
    return {
      observacion: this.comentarios,
      aprobado: this.checkAprobacionComisario,
      secciones: this.listaSecciones,
    };
  }

  /**
   * @description ajusta el arreglo de auto antes de guardarlo
   * @param secciones objeto secciones para actualizar
   */
  public ajustarArregloAutoPadre(secciones: SeccionesInterface): void {
    secciones.textoSeccion = this.textoAuto.transform(
      this.txtPadre.nativeElement.value
    );
  }

  /**
   * @description llama servicio cerrar actuación
   */
  private cerrarActuacion(obj: any) {
    this.abogadoService.cerrarActuacion(obj).subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          Modales.modalExito(
            Mensajes.MENSAJE_CERRAR_SOLICITUD,
            ImagenesModal.OK,
            this.dialog
          );
          this.redireccionar();
        } else {
          this.modalError();
        }
      },
      error: () => {
        this.modalError();
      },
    });
  }

  /**
   * @description muestra modal cerrar actuación
   */
  public async modalConfirmaCerrarActuacion() {

    // if (this.objSol.actividad === 'Crear Auto Admisorio') {
    /**
     * objPlantilla -> los campos que están seleccionados
     */
    let objPlantilla = this.retornarObjGuardarPlantilla();
    let medidasaValidar: number[] = [];
    /**
     * secciones -> las secciones que estan seleccionadas en bd
     */
    const secciones: ResponseInterface = await lastValueFrom(
      this.autoService.obtenerSecciones(this.objSol.idSolicitud)
    );

    /**
     * medidasaValidar -> medidas que estaban en bd
     */
    medidasaValidar = secciones.data.medidasValidar;

    /**
     * validacion -> que alguna de las secciones seleccionadas coincida con las medidas a validar
     */

    let verMarcadas = objPlantilla.secciones.filter((marcadas: any) => marcadas.estadoSeccion);
    const validacion = verMarcadas.find((valor: any) => medidasaValidar.includes(valor.idSolPSeccion));

    if (validacion == undefined && secciones.data.aplicaMedidas) {
      Modales.modalConfirmacion(
        Mensajes.MENSAJE_NO_MEDIDAS,
        this.dialog,
        ImagenesModal.EXCLAMACION
      ).subscribe((res) => {
        if (res) {
          this.modalConfirmacionCerrarActuaciones();
        }
      });
      // }
    } else {
      this.modalConfirmacionCerrarActuaciones();
    }
  }

  modalConfirmacionCerrarActuaciones() {
    Modales.modalConfirmacion(
      Mensajes.MENSAJE_CERRAR_ACT,
      this.dialog,
      ImagenesModal.EXCLAMACION
    ).subscribe((res) => {
      if (res) this.validarAutoPrevioGuardar(true);
    });
  }

  /**
   * @description genera el reporte a partir de las secciones seleccionadas
   */
  public generarReporte() {
    ReporteAutoPDF.generarAuto();
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
      valorEtiqueta: this.checkAprobacionComisario ? '1' : '0',
    };
  }

  /**
   * @description obtiene comentarios de las observaciones comisario
   */
  public obtenerComentarios(observaciones: string) {
    this.comentarios = observaciones;
  }

  /**
   * @description obtiene la selección del check
   */
  public obtenerCheckComisario(checkAprobacionComisario: boolean) {
    this.checkAprobacionComisario = checkAprobacionComisario;
  }

  /**
   * @description valida que se hayan escrito comentarios
   * @returns true o false si el comentario aplica
   */
  private validarCampoObservaciones(): boolean {
    if (this.checkAprobacionComisario) {
      if (this.user?.perfil !== this.ABOGADO && this.mostrarFallo) {
        if (this.comentarios && this.comentarios !== '') {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  /**
   * @description muestra modal error
   */
  private modalError() {
    Modales.modalInformacion(
      Mensajes.MENSAJE_ERROR_G,
      this.dialog,
      ImagenesModal.EXCLAMACION
    );
  }

  /**
   * @description obtiene el título emitido por el componente secciones
   */
  public obtenerTitulo(titulo: string) {
    this.tituloAuto = titulo;
  }

  /**
   * @description obtiene el título emitido por el componente secciones
   */
  public obtenerObservacion(observacion: string) {
    this.comentarios = observacion;
    this.checkAprobacionComisario =
      observacion && observacion !== '' ? true : false;
  }
}
