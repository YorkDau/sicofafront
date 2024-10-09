import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CodigosRespuesta, ImagenesModal, Mensajes } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { Modales } from 'src/app/shared/modals';
import { DerechosPrimeroComponent } from '../derechos-primero/derechos-primero.component';
import { DerechosSegundoComponent } from '../derechos-segundo/derechos-segundo.component';
import { PresuntoInvolucradoComponent } from '../presunto-involucrado/presunto-involucrado.component';
import { TrabajadorSocialService } from '../services/trabajador-social.service';

@Component({
  selector: 'app-registro-involucrados-pard',
  templateUrl: './registro-involucrados-pard.component.html',
  styles: [],
})
export class RegistroInvolucradosPardComponent implements OnInit, OnDestroy {
  @ViewChild(PresuntoInvolucradoComponent)
  presuntoInvolucrado!: PresuntoInvolucradoComponent;

  @ViewChild(DerechosPrimeroComponent)
  derechosP1!: DerechosPrimeroComponent;

  @ViewChild(DerechosSegundoComponent)
  derechosP2!: DerechosSegundoComponent;

  public mostrarTodoForm: boolean = true;

  private involucradoSub!: Subscription;
  private objInvolucrado!: any;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private trabajadorSocialService: TrabajadorSocialService
  ) {}

  ngOnDestroy(): void {
    if (this.involucradoSub) this.involucradoSub.unsubscribe();
  }

  ngOnInit(): void {
    this.escucharCambiosInvolucrado();
    this.objInvolucrado = JSON.parse(sessionStorage.getItem('inv_pard')!);
  }

  /**
   * @description muestra modal cancelar
   */
  public cancelar(): void {
    Modales.modalConfirmacion(
      Mensajes.MENSAJE_CANCELAR_SOL,
      this.dialog,
      ImagenesModal.EXCLAMACION
    ).subscribe((res) => {
      if (res) {
        this.redireccionar();
        sessionStorage.removeItem('inv_pard');
      }
    });
  }

  /**
   * @description redirecciona a la ruta casos
   */
  private redireccionar(): void {
    this.router.navigate(['../trabajador-social/involucrados-pard']);
  }

  /**
   * @description valida y emite los errores en los formularios
   */
  public validarFormularios(): void {
    const resInvolucrado = this.validarInvolucradosForm();
    const resDerechos1 = this.validarDerechosP1();
    const resDerechos2 = this.validarDerechosP2();
    if (resDerechos1 && resDerechos2 && resInvolucrado) {
      if (this.objInvolucrado) this.editarInvolucrado();
      else this.guardarInvolucrado();
    } else if (resInvolucrado && !this.mostrarTodoForm) {
      if (this.objInvolucrado) this.editarInvolucrado();
      else this.guardarInvolucrado();
    }
  }

  /**
   * @description validar formulario presunto involucrado
   */
  private validarInvolucradosForm(): boolean {
    let resultado = false;
    if (this.presuntoInvolucrado) {
      if (this.presuntoInvolucrado.involucradoForm.invalid) {
        this.trabajadorSocialService.emitirInvolucrados(true);
      } else {
        this.trabajadorSocialService.emitirInvolucrados(false);
        resultado = true;
      }
    }

    return resultado;
  }

  /**
   * @description validar formulario derechos parte 1
   */
  private validarDerechosP1(): boolean {
    let resultado = false;
    if (this.derechosP1) {
      if (this.derechosP1.derechosPrimero.invalid) {
        this.trabajadorSocialService.emitirDerechosP1(true);
      } else {
        this.trabajadorSocialService.emitirDerechosP1(false);
        resultado = true;
      }
    }

    return resultado;
  }

  /**
   * @description validar formulario derechos parte 2
   */
  private validarDerechosP2(): boolean {
    let resultado = false;
    if (this.derechosP1) {
      if (this.derechosP2.derechosSegundo.invalid) {
        this.trabajadorSocialService.emitirDerechosP2(true);
      } else {
        this.trabajadorSocialService.emitirDerechosP2(false);
        resultado = true;
      }
    }

    return resultado;
  }

  /**
   * @description escucha cambios formulario de involucrados
   */
  private escucharCambiosInvolucrado(): void {
    this.involucradoSub = this.trabajadorSocialService.agresor$.subscribe(
      (v) => {
        if (!v) {
          this.mostrarTodoForm = false;
        } else {
          this.mostrarTodoForm = true;
        }
      }
    );
  }

  /**
   * @description arma el objeto para insertar o editar
   * @returns objeto para insertar o editar
   */
  private armarObjGuardarActualizar(): any {
    const principal = this.armarObjetoPrincipal();
    const {
      idInvolucrado,
      registroExpedidoEn,
      nombreEntidadExpedicion,
      datosAdicionales,
    } = this.armarObjetoPrincipal();

    let obj = {
      ...principal,
      eps: '',
      infoAdicional: {
        idInvolucrado,
        registroExpedidoEn,
        nombreEntidadExpedicion,
        datosAdicionales,
      },
    };

    if (this.validarDerechosP1() && this.validarDerechosP2()) {
      const derechos = {
        ...this.derechosP1.derechosPrimero.value,
        ...this.derechosP2.derechosSegundo.value,
      };

      obj = {
        ...obj,
        eps: derechos.nombreEPS,
        infoAdicional: { ...obj.infoAdicional, ...derechos },
      };
    }
    return obj;
  }

  /**
   * @description llama servicio que guarda edita involucrado
   */
  private guardarInvolucrado(): void {
    this.trabajadorSocialService
      .guardarInvolucradoComplementaria(this.armarObjGuardarActualizar())
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            Modales.modalExito(
              Mensajes.MENSAJE_OK,
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
   * @description muestra modal error
   */
  private modalError(): void {
    Modales.modalInformacion(
      Mensajes.MENSAJE_ERROR_G,
      this.dialog,
      ImagenesModal.EXCLAMACION
    );
  }

  /**
   * @description arma objeto casteado
   */
  private armarObjetoPrincipal(): any {
    let obj = {
      ...this.presuntoInvolucrado.involucradoForm.value,
    };

    obj.idInvolucrado = Number(obj.idInvolucrado);
    obj.idSolicitudServicio = Number(obj.idSolicitudServicio);
    obj.tipoDocumento = Number(obj.tipoDocumento);
    obj.idLugarExpedicion = Number(obj.idLugarExpedicion);
    obj.esVictima = Boolean(JSON.parse(obj.esVictima));
    obj.telefono = String(obj.telefono);

    return obj;
  }

  /**
   * @description llama servicio que edita involucrado
   */
  private editarInvolucrado(): void {
    this.trabajadorSocialService
      .actualizarInvolucradoComplementaria(this.armarObjGuardarActualizar())
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            Modales.modalExito(
              Mensajes.MENSAJE_OK,
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
}
