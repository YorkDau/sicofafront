import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { lastValueFrom, Subscription } from "rxjs";
import { AuthService } from "src/app/auth/services/auth.service";
import {
  CodigosPerfil,
  CodigosRespuesta,
  ImagenesModal,
  Mensajes,
} from "src/app/constants";
import {
  SeccionesInterface,
  TreeInterface,
} from "src/app/interfaces/auto.interface";

import { ResponseInterface } from "src/app/interfaces/response.interface";
import { UserInterface } from "src/app/interfaces/usuario.interface";
import { AbogadoService } from "src/app/pages/private/abogado/services/abogado.service";
import { AutoService } from "src/app/pages/private/abogado/services/auto.service";
import { TextoAutoPipe } from "src/app/pipes/texto-auto.pipe";
import { Modales } from "src/app/shared/modals";
import { ReporteAutoPDF } from "./report-pdf";

@Component({
  selector: "app-generar-auto",
  templateUrl: "./generar-auto.component.html",
  styleUrls: ["./generar-auto.component.scss"],
  providers: [TextoAutoPipe],
})
export class GenerarAutoComponent implements OnInit, OnDestroy {
  @ViewChild("textPadre") txtPadre!: ElementRef;
  @ViewChild("textHijo") txtHijo!: ElementRef;

  private autoPadreSub!: Subscription;
  private objSol!: any;
  private listaSeccionesSub!: Subscription;
  public listaSecciones: SeccionesInterface[] = [];

  public objAutoPadre!: TreeInterface;
  public comentarios: string = "";
  public checkAprobacionComisario: boolean = false;
  public tituloAuto: string = "";
  public ABOGADO = CodigosPerfil.ABOGADO;
  public COMISARIO = CodigosPerfil.COMISARIO;
  public user!: UserInterface | undefined;
  public titulo: string = "";
  public mostrarFallo: boolean = true;

  // ✅ Segunda pregunta como boolean
  public esNecesarioRemitir: boolean = false; // por defecto NO

  constructor(
    private autoService: AutoService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private abogadoService: AbogadoService,
    private textoAuto: TextoAutoPipe,
  ) {}

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
    this.objSol = JSON.parse(sessionStorage.getItem("info")!);
    this.user = this.authService.currentUserValue;
    this.asingarSuscripcion();
    this.asignarTitulo();
  }

  private asignarTitulo() {
    if (this.objSol.actividad === "Crear auto con medidas") {
      this.titulo = "ADOPCIÓN DE MEDIDAS DE PROTECCIÓN";
    } else {
      this.titulo = "GESTIÓN DE AUDIENCIA";
    }
  }

  private asingarSuscripcion() {
    this.autoPadreSub = this.autoService.seccion$.subscribe((p: any) => {
      this.objAutoPadre = p;
    });
    this.listaSeccionesSub = this.autoService.seccionesLista$.subscribe(
      (l) => (this.listaSecciones = l),
    );
  }

  public cancelarSolicitud() {
    Modales.modalConfirmacion(
      Mensajes.MENSAJE_CANCELAR_SOL,
      this.dialog,
      ImagenesModal.EXCLAMACION,
    ).subscribe((res) => {
      if (res) {
        this.redireccionar();
      }
    });
  }

  private redireccionar() {
    if (this.user?.perfil === CodigosPerfil.ABOGADO) {
      this.router.navigate(["../abogado/casos"]);
    } else {
      this.router.navigate(["../comisario/casos"]);
    }
  }

  public validarAutoPrevioGuardar(cerrar: boolean) {
    if (this.validarCampoObservaciones()) {
      this.guardarAuto(cerrar);
    } else {
      Modales.modalInformacion(
        Mensajes.MENSAJE_CAMPO_OBSERVACIONES,
        this.dialog,
        ImagenesModal.EXCLAMACION,
      );
    }
  }

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
              this.dialog,
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

  private retornarObjGuardarPlantilla(): any {
    return {
      observacion: this.comentarios,
      aprobado: this.checkAprobacionComisario,
      secciones: this.listaSecciones,
      // ✅ guardar como boolean
      esNecesarioRemitir: this.esNecesarioRemitir,
    };
  }

  public ajustarArregloAutoPadre(secciones: SeccionesInterface): void {
    secciones.textoSeccion = this.textoAuto.transform(
      this.txtPadre.nativeElement.value,
    );
  }

  private cerrarActuacion(obj: any) {
    this.abogadoService.cerrarActuacion(obj).subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          Modales.modalExito(
            Mensajes.MENSAJE_CERRAR_SOLICITUD,
            ImagenesModal.OK,
            this.dialog,
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

  public async modalConfirmaCerrarActuacion() {
    let objPlantilla = this.retornarObjGuardarPlantilla();
    let medidasaValidar: number[] = [];

    const secciones: ResponseInterface = await lastValueFrom(
      this.autoService.obtenerSecciones(this.objSol.idSolicitud),
    );

    medidasaValidar = secciones.data.medidasValidar;

    let verMarcadas = objPlantilla.secciones.filter(
      (marcadas: any) => marcadas.estadoSeccion,
    );
    const validacion = verMarcadas.find((valor: any) =>
      medidasaValidar.includes(valor.idSolPSeccion),
    );

    if (validacion == undefined && secciones.data.aplicaMedidas) {
      Modales.modalConfirmacion(
        Mensajes.MENSAJE_NO_MEDIDAS,
        this.dialog,
        ImagenesModal.EXCLAMACION,
      ).subscribe((res) => {
        if (res) {
          this.modalConfirmacionCerrarActuaciones();
        }
      });
    } else {
      this.modalConfirmacionCerrarActuaciones();
    }
  }

  modalConfirmacionCerrarActuaciones() {
    Modales.modalConfirmacion(
      Mensajes.MENSAJE_CERRAR_ACT,
      this.dialog,
      ImagenesModal.EXCLAMACION,
    ).subscribe((res) => {
      if (res) this.validarAutoPrevioGuardar(true);
    });
  }

  public generarReporte() {
    ReporteAutoPDF.generarAuto();
  }

  private retornarObjCerrarActuacion(): any {
    return {
      tareaID: this.objSol.idTarea,
      userID: this.user?.userID,
      perfilCod: "",
      valorEtiqueta: this.checkAprobacionComisario ? "1" : "0",
    };
  }

  public obtenerComentarios(observaciones: string) {
    this.comentarios = observaciones;
  }

  public obtenerCheckComisario(checkAprobacionComisario: boolean) {
    this.checkAprobacionComisario = checkAprobacionComisario;
  }

  // ✅ Recibe el valor booleano de remisión
  public obtenerRemision(valor: boolean) {
    this.esNecesarioRemitir = valor;
  }

  private validarCampoObservaciones(): boolean {
    if (this.checkAprobacionComisario) {
      if (this.user?.perfil !== this.ABOGADO && this.mostrarFallo) {
        if (this.comentarios && this.comentarios !== "") {
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

  private modalError() {
    Modales.modalInformacion(
      Mensajes.MENSAJE_ERROR_G,
      this.dialog,
      ImagenesModal.EXCLAMACION,
    );
  }

  public obtenerTitulo(titulo: string) {
    this.tituloAuto = titulo;
  }

  public obtenerObservacion(observacion: string) {
    this.comentarios = observacion;
    this.checkAprobacionComisario =
      observacion && observacion !== "" ? true : false;
  }
}
