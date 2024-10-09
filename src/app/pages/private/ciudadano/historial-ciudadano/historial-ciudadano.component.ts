import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { Mensajes } from '../../../../constants';
import { SharedFunctions } from '../../../../shared/functions';
import { Modales } from '../../../../shared/modals';
import {
  AuroraTableColumn,
  AuroraActionColumn,
} from '../../../../shared/table/table.component';
import { CiudadanoDetalleInterface } from '../../interfaces/ciudadano.interface';
import { SolicitudServicioInterface } from '../../interfaces/historial.interface';
import { CiudadanoService } from '../services/ciudadano.service';
import { ModalDetalleSolicitudCiudadanoComponent } from './modal-detalle-solicitud-ciudadano/modal-detalle-solicitud-ciudadano.component';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-historial-ciudadano',
  templateUrl: './historial-ciudadano.component.html',
  styleUrls: ['./historial-ciudadano.component.scss'],
})
export class HistorialCiudadanoComponent {
  private user!: UserInterface | undefined;
  public columns: AuroraTableColumn[] = [
    { name: 'codigo_solicitud', title: 'código solicitud' },
    {
      name: 'fecha_solicitud',
      title: 'fecha solicitud',
      render: (value) => {
        let dateString = this.datePipe.transform(value, 'dd/MM/yyyy');
        return dateString ? dateString : value;
      },
    },
    {
      name: 'hora_solicitud',
      title: 'hora solicitud',
      render: (value) => {
        let dateString = this.datePipe.transform(value, 'hh:mm a');
        return dateString ? dateString : value;
      },
    },
    { name: 'proceso', title: 'Proceso' },
    { name: 'estado_de_la_solicitud', title: 'estado' },
    { name: 'actions', title: 'acciones' },
  ];

  public actions: AuroraActionColumn[] = [
    {
      imagen: 'assets/images/eye.svg',
      tooltip: 'Visualizar',
      tooltipPosition: 'right',
      accion: (row) => {
        this.openModalDetalles(row.id_solicitud_servicio);
      },
    },
    {
      imagen: 'assets/images/irProceso.svg',
      tooltip: 'Retomar solicitud',
      tooltipPosition: 'right',
      accion: (row:SolicitudServicioInterface) => {
        this.router.navigate(['/solicitud', row.id_solicitud_servicio]);
      },
    },
  ];

  private id_ciudadano: number | undefined = undefined;
  public ciudadano: CiudadanoDetalleInterface | undefined = undefined;
  public listaRecepcion: SolicitudServicioInterface[] = [];
  public mostrarOcultarBoton: boolean = true;
  currentUser!: UserInterface | undefined;

  constructor(
    public dialog: MatDialog,
    private ciudadanoService: CiudadanoService,
    private activatedRoute: ActivatedRoute,
    private modales: Modales,
    private datePipe: DatePipe,
    private router: Router,
    private authService: AuthService
  ) {
    this.user = this.authService.currentUserValue;
    if (this.authService.currentUserValue?.perfil === 'COM') {
      this.mostrarOcultarBoton = false;
      this.actions.pop();
    }
    this.activatedRoute.params.subscribe((params) => {
      if (!params['id_ciudadano']) {
        this.modales
          .modalInformacion(
            'Error de enrutamiento: No se obtuvo la identificacion del ciudadano'
          )
          .subscribe(() => {
            history.back();
          });
      } else {
        this.id_ciudadano = params['id_ciudadano'];
        this.getCiudadano().then(() => {
          if (this.ciudadano) {
            // <!--registro_completo es el campo requiereModificacion-- >
            // <!--si es true mostramos la opcion de editar-- >
            // <!--si es false ocultamos la opcion de editar-- >
            this.ciudadano.requiereModificacon =
              this.ciudadano?.registro_completo;
            this.getSolicitudesCiudadano();
          }
        });
      }
    });
  }

  /**
   * @description abre modal con los detalles de la solicitud del servicio seleccionado
   */
  public openModalDetalles(id_solicitud: number): void {
    this.dialog.open(ModalDetalleSolicitudCiudadanoComponent, {
      panelClass: ['roundedModal', 'modalFondoGris'],
      disableClose: false,
      width: '776px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: { id_solicitud, ciudadano: this.ciudadano },
    });
  }

  /**
   * @description obtiene la informacion del ciudadano a partir de un id.
   */
  public async getCiudadano() {
    try {
      if (!this.id_ciudadano) {
        this.modales
          .modalInformacion(
            'Error de enrutamiento: No se obtuvo la identificacion del ciudadano'
          )
          .subscribe(() => {
            history.back();
          });
        return;
      }
      const result = await lastValueFrom(
        this.ciudadanoService.getCiudadano(this.id_ciudadano)
      );
      if (!result) {
        this.modales
          .modalInformacion('No se encontró la información del ciudadano.')
          .subscribe(() => {
            history.back();
          });
        return;
      }
      if (result.statusCode != 200) {
        this.modales.modalInformacion(result.message);
        return;
      }
      if (!result.data || !result.data.datosPaginados) {
        this.modales.modalInformacion(
          'Ocurrió un error al consultar los datos del ciudadano.'
        );
        return;
      }
      this.ciudadano = result.data.datosPaginados;
    } catch (error: any) {
      SharedFunctions.getErrorMessage(error);
      this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G).subscribe(() => {
        history.back();
      });
    }
  }

  /**
   * @description obtiene las solicitudes del ciudadano a partir de su id.
   */
  public async getSolicitudesCiudadano() {
    try {
      if (!this.id_ciudadano) {
        this.modales.modalInformacion(
          'Error de enrutamiento: No se obtuvo la identificacion del ciudadano'
        );
        return;
      }
      this.listaRecepcion = [];
      const result = await lastValueFrom(
        this.ciudadanoService.getSolicitudesCiudadano(this.id_ciudadano, this.user?.idComisaria)
      );
      if (result && result.statusCode != 200) {
        this.modales.modalInformacion(result.message);
        return;
      }
      if (
        result &&
        result.statusCode == 200 &&
        result.message == 'Error Interno'
      ) {
        return;
      }
      this.listaRecepcion =
        result && result.data && result.data.datosPaginados
          ? result.data.datosPaginados
          : [];
    } catch (error: any) {
      SharedFunctions.getErrorMessage(error);
      this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
    }
  }

  /**
   * Formatea el nombre del ciudadano
   * @returns nombre del ciudadano
   */
  printNombreCiudadano() {
    if (this.ciudadano) {
      let nombre_completo = '';
      nombre_completo += this.ciudadano.nombre_ciudadano
        ? this.ciudadano.nombre_ciudadano + ' '
        : '';
      nombre_completo += this.ciudadano.primer_apellido
        ? this.ciudadano.primer_apellido + ' '
        : '';
      nombre_completo += this.ciudadano.segundo_apellido
        ? this.ciudadano.segundo_apellido
        : '';
      return nombre_completo;
    }
    return 'Sin dato';
  }
  /**
   * @description nos dirige a la ruta de completar
   * información del ciudadano y realiza una marca
   * en la base de datos de la cita
   */
  public completarInformacionCiudadano() {
    if (this.id_ciudadano) {
      try {
        this.ciudadanoService
          .setCitaAtendida(this.id_ciudadano)
          .subscribe(() => {
            this.router.navigate(['/registro-ciudadano', this.id_ciudadano]);
          });
      } catch (error) {
        this.router.navigate(['/registro-ciudadano', this.id_ciudadano]);
      }
    }
  }

  public validarPoblacionEspecial() {
    return (
      this.ciudadano &&
      (this.ciudadano.pueblo_indigena != 'No' ||
        this.ciudadano.poblacion_lgtbi ||
        this.ciudadano.nino_nina_adolecente ||
        this.ciudadano.victima_conflicto_armado ||
        this.ciudadano.persona_lider_defensor_DH ||
        this.ciudadano.persona_habitalidad_calle ||
        this.ciudadano.migrante)
    );
  }
}
