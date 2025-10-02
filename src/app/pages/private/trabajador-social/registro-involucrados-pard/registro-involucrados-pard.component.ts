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
    const inv = JSON.parse(sessionStorage.getItem('inv_pard') || '{}');

    if (inv && inv.esRepresentante) {
      this.mostrarTodoForm = false;
    }

    if (inv && inv.idInvolucrado) {
      this.objInvolucrado = inv;
      console.log('Editando involucrado:', this.objInvolucrado);
    } else {
      this.objInvolucrado = null;
      console.log('Creando nuevo involucrado');
    }
  }

  /**
   * Escucha cambios desde el hijo para decidir si mostrar formularios hijos
   */
public evaluarFormularioHijo(event: { esVictima: boolean; esRepresentante: boolean }): void {
  // 👇 Solo mostrar formularios si es víctima y NO es representante
  this.mostrarTodoForm = event.esVictima && !event.esRepresentante;
}

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

  private redireccionar(): void {
    this.router.navigate(['../trabajador-social/involucrados-pard']);
  }

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

private validarInvolucradosForm(): boolean {
  let resultado = false;
  if (this.presuntoInvolucrado) {
    const form = this.presuntoInvolucrado.involucradoForm;

    // 🔹 Forzar ajuste de validaciones ANTES de validar
    const esVictima = form.get('esVictima')?.value;
    this.presuntoInvolucrado['ajustarEdicionValidacionesEdad'](esVictima);

    // 🔹 Marca todos los campos como "tocados"
    Object.values(form.controls).forEach((control) => {
      control.markAsTouched();
    });

    if (form.invalid) {
      this.trabajadorSocialService.emitirInvolucrados(true);
    } else {
      this.trabajadorSocialService.emitirInvolucrados(false);
      resultado = true;
    }
  }
  return resultado;
}


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

  private validarDerechosP2(): boolean {
    let resultado = false;
    if (this.derechosP2) {
      if (this.derechosP2.derechosSegundo.invalid) {
        this.trabajadorSocialService.emitirDerechosP2(true);
      } else {
        this.trabajadorSocialService.emitirDerechosP2(false);
        resultado = true;
      }
    }
    return resultado;
  }

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

  private modalError(): void {
    Modales.modalInformacion(
      Mensajes.MENSAJE_ERROR_G,
      this.dialog,
      ImagenesModal.EXCLAMACION
    );
  }

  private armarObjetoPrincipal(): any {
    let obj = {
      ...this.presuntoInvolucrado.involucradoForm.value,
    };

    obj.idInvolucrado = Number(obj.idInvolucrado);
    obj.idSolicitudServicio = Number(obj.idSolicitudServicio);
    obj.tipoDocumento = Number(obj.tipoDocumento);
    obj.paisExp = Number(obj.paisExp);
    obj.departamentoExp = Number(obj.departamentoExp);
    obj.municipioExp = Number(obj.municipioExp);
    obj.esVictima = Boolean(obj.esVictima);
    obj.esRepresentante = Boolean(obj.esRepresentante);
    obj.edadEn = Number(obj.edadEn);
    obj.telefono = String(obj.telefono);

    return obj;
  }

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
