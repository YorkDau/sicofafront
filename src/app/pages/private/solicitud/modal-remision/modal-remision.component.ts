import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CodigosRespuesta, ImagenesModal, Mensajes } from 'src/app/constants';
import {
  ComisariaInterface,
  EntidadInterface,
} from '../../interfaces/solicitud.interface';
import { SolicitudService } from '../../services/solicitud.service';
import { UseModalRemision } from '../solicitud.component';
import { NombreUsuario, UserInterface } from '../../../../interfaces/usuario.interface';
import { AuthService } from '../../../../auth/services/auth.service';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { Modales } from 'src/app/shared/modals';
import { GestionUsuariosService } from '../../comisario/administracion/services/gestion-usuarios.service';

@Component({
  selector: 'app-modal-remision',
  templateUrl: './modal-remision.component.html',
  styleUrls: ['./modal-remision.component.scss'],
})
export class ModalRemisionComponent {
  public myForm!: FormGroup;
  public titulo!: string;
  public vEntidadComisaria!: string;
  public isEntidad!: boolean;
  public mostrarValidaciones: boolean = false;
  public vEntidad: boolean = false;
  public vComisaria: boolean = false;
  public vJustificacion: boolean = false;
  public selectEntidad: EntidadInterface[] = [];
  public selectComisaria: ComisariaInterface[] = [];
  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;
  private user!: UserInterface | undefined;
  public remitente: string = '';
  public usuario!: NombreUsuario;

  constructor(
    private authService: AuthService,
    private usuarioService: GestionUsuariosService,
    private solicitudService: SolicitudService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private matDialogRef: MatDialogRef<ModalRemisionComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Titulo: UseModalRemision;
      nroSolicitud: string;
      infoBrindada: string;
    }
  ) {
    this.user = this.authService.currentUserValue;
    this.obtenerNombreUsuario();
    this.cargarForms();
    this.cargarInfo(data);
    if (this.isEntidad) {
      this.cargaSelectEntidad();
    } else {
      this.cargaSelectComisaria();
    }

    this.myForm.get('entidad')?.valueChanges.subscribe((resp) => {
      this.validEntidad();
    });
    this.myForm.get('comisaria')?.valueChanges.subscribe((resp) => {
      this.validComisaria();
    });
    this.myForm.get('justificacion')?.valueChanges.subscribe((resp) => {
      this.validJustificacion();
    });
    this.esRemitido(+this.data.nroSolicitud);
  }

  private obtenerNombreUsuario(){
    const idUsuario = this.user!.userID;
    this.usuarioService.UsuarioEspecifico(idUsuario).subscribe({
      next: (resp) =>{
        this.usuario = resp.data;
        this.remitente = this.usuario.nombres + ' ' + this.usuario.apellidos;
      }
    })
  }

  private cargarForms() {
    this.myForm = this.fb.group({
      entidad: ['', Validators.required],
      comisaria: ['', Validators.required],
      justificacion: '',
      infoBrindada: '',
    });
    this.myForm.get('infoBrindada')?.disable();
  }

  /**
   * @description carga informacion del modal
   */
  private cargarInfo(data: {
    Titulo: UseModalRemision;
    nroSolicitud: string;
    infoBrindada: string;
  }) {
    this.myForm.get('infoBrindada')?.setValue(data.infoBrindada);
    if (data.Titulo === UseModalRemision.Externa) {
      this.titulo = `REMISIÓN A OTRA ENTIDAD EXTERNA SOLICITUD DE SERVICIO`;
      this.vEntidadComisaria = 'Entidad a que se remite';
      this.isEntidad = true;
    } else if (data.Titulo === UseModalRemision.Familia) {
      this.titulo = `REMISIÓN A OTRA COMISARÍA DE FAMILIA SOLICITUD DE SERVICIO`;
      this.vEntidadComisaria = 'Comisaria de familia a la que se remite';
      this.isEntidad = false;
    } else {
      this.titulo = `REMISIÓN A OTRA COMISARÍA DE FAMILIA SOLICITUD DE SERVICIO`;
      this.vEntidadComisaria = 'Comisaria de familia origen';
      this.isEntidad = false;
    }
  }

  /**
   * @description carga el select de entidad
   */
  private cargaSelectEntidad() {
    this.solicitudService.getEntidades().subscribe((entidad) => {
      if (entidad.statusCode === CodigosRespuesta.OK) {
        this.selectEntidad = entidad.data;
      }
    });
  }

  /**
   * @description carga el select de comisaria
   */
  private cargaSelectComisaria() {

    this.solicitudService.getComisariaTraslado(this.user?.idComisaria).subscribe((comisaria) => {
      if (comisaria.statusCode === CodigosRespuesta.OK) {
        this.selectComisaria = comisaria.data;
      }
    });
  }

  /**
   * @description confirmacion de modal
   */
  public confirmar() {
    this.mostrarValidaciones = false;
    if (this.isEntidad) {
      if (
        this.myForm.get('entidad')?.value != '' &&
        this.myForm.get('justificacion')?.value != ''
      ) {
        this.matDialogRef.close({
          respuesta: true,
          entidad: this.myForm.get('entidad')?.value,
          justificacion: this.myForm.get('justificacion')?.value,
        });
      } else {
        this.validEntidad();
        this.validJustificacion();
      }
    } else {
      if (
        this.myForm.get('comisaria')?.value != '' &&
        this.myForm.get('justificacion')?.value != ''
      ) {
        this.matDialogRef.close({
          respuesta: true,
          comisaria: this.myForm.get('comisaria')?.value,
          justificacion: this.myForm.get('justificacion')?.value,
        });
      } else {
        this.validComisaria();
        this.validJustificacion();
      }
    }
  }

  /**
   * @description Valida que los campos esten llenos
   */
  private validEntidad() {
    this.mostrarValidaciones = true;
    this.myForm.get('entidad')?.value == ''
      ? (this.vEntidad = true)
      : (this.vEntidad = false);
  }

  /**
   * @description Valida que los campos esten llenos
   */
  private validComisaria() {
    this.mostrarValidaciones = true;
    this.myForm.get('comisaria')?.value == ''
      ? (this.vComisaria = true)
      : (this.vComisaria = false);
  }

  /**
   * @description Valida que los campos esten llenos
   */
  private validJustificacion() {
    this.mostrarValidaciones = true;
    this.myForm.get('justificacion')?.value == ''
      ? (this.vJustificacion = true)
      : (this.vJustificacion = false);
  }

  /**
   * @description cierra modal
   */
  public cerrarModal() {
    this.matDialogRef.close();
  }


  /**
 * @description Obtiene la informacion de la remision
 */
  private esRemitido(idSolicitudServicio: number = 0) {
    if (idSolicitudServicio && idSolicitudServicio != 0) {
      this.getInformacionRemision(idSolicitudServicio);
    }
  }

  /**
 * @description Obtiene la informacion de la remision
 */
  private getInformacionRemision(idSolicitudServicio: number) {
    this.solicitudService.getInformacionRemision(idSolicitudServicio).subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.data.infoBrindada = data.data[0].descripcion_de_hechos;
          this.cargarInformacionRemision(data.data[0]);
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
 * @description mensaje de error
 */
  private msgError() {
    Modales.modalInformacion(
      Mensajes.MENSAJE_ERROR_G,
      this.dialog,
      ImagenesModal.EXCLAMACION
    );
  }

  /**
 * @description Carga la informacion del formulario si tiene datos
 */
  private cargarInformacionRemision(info: any) {
    this.myForm.patchValue({
      comisaria: info.id_comisaria_origen,
      justificacion: info.justificacion,
      infoBrindada: info.descripcion_de_hechos,
    });
    this.myForm.get('comisaria')?.disable();
    this.myForm.get('justificacion')?.disable();
  }


}
