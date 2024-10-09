import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import {
  EstadosNotificacionImplicado,
  TiposDocumentoCarga,
} from '../../../../constants';
import { RecepcionCasosInterface } from '../../../../interfaces/recepcion-casos.interface';
import { SharedService } from '../../../../services/shared.service';
import { SharedFunctions } from '../../../../shared/functions';
import { Modales } from '../../../../shared/modals';
import {
  NotificacionImplicado,
  NotificacionMedidaProteccion,
} from '../../interfaces/abogado.interface';
import { NotificacionesImplicadoService } from '../services/notificaciones-implicados.service';

@Component({
  selector: 'app-notificaciones-implicados',
  templateUrl: './notificaciones-implicados.component.html',
  styleUrls: ['./notificaciones-implicados.component.scss'],
})
export class NotificacionesImplicadosComponent implements OnInit {
  @ViewChild('paginator') paginator!: MatPaginator;

  public tarea: RecepcionCasosInterface = JSON.parse(
    sessionStorage.getItem('info')!
  );
  public listaImplicados: NotificacionImplicado[] = [];
  public columnas: string[] = ['nombres', 'estado', 'accion'];
  public dataSource: MatTableDataSource<NotificacionImplicado> =
    new MatTableDataSource<NotificacionImplicado>([]);

  public date = new Date();

  public implicadoSeleccionado!: NotificacionMedidaProteccion | null;
  private user!: UserInterface;
  
  constructor(
    private notificacionesImplicadoService: NotificacionesImplicadoService,
    private authService: AuthService,
    private modales: Modales,
    private spinner: NgxSpinnerService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.currentUserValue!;
    this.consultar();
  }

  /**
   * @descripcion consulta las notificaciones
   */
  consultar() {
    this.notificacionesImplicadoService
      .consultar(this.tarea.idSolicitud, this.tarea.idTarea)
      .subscribe((result) => {
        if (result && result.statusCode === 200) {
          this.listaImplicados = result.data;
          this.dataSource.data = this.listaImplicados;
          this.dataSource.paginator = this.paginator;
        }
      });
  }
  /**
   * @descripcion si el estado es enviado
   */
  isEnviado(row: NotificacionImplicado) {
    return row.estado == EstadosNotificacionImplicado.ENVIADO;
  }
  /**
   * @descripcion si el estado es no enviado
   */
  isNoEnviado(row: NotificacionImplicado) {
    return row.estado == EstadosNotificacionImplicado.NO_ENVIADO;
  }
  /**
   * @descripcion si el estado es recibido
   */
  isRecibido(row: NotificacionImplicado) {
    return row.estado == EstadosNotificacionImplicado.RECIBIDO || row.idAnexo;
  }
  /**
   * @descripcion permite cargar un archivo a partir del base64
   */
  cargarArchivo(base64: string, row: NotificacionImplicado) {
    if (base64) {
      if (row.idAnexo) {
        this.editarArchivo(base64, row);
      } else {
        this.notificacionesImplicadoService
          .actualizarNotificacion({
            idSolicitudServicio: this.tarea.idSolicitud,
            idUsuario: this.user.userID,
            idInvolucrado: row.idInvolucrado,
            entrada: base64,
            nombrearchivo: null,
            idTarea: this.tarea.idTarea,
            tipoDocumento: TiposDocumentoCarga.NOTIFICACION_MEDIDA_PROTECCION,
          })
          .subscribe(async (archivo) => {
            if (archivo && archivo.statusCode == 200) {
              this.modales
                .modalExito('Constancia cargada exitosamente.')
                .subscribe(() => {
                  this.consultar();
                });
            }
          });
      }
    }
  }
  /**
   * @descripcion permite editar un archivo a partir del base64
   */
  editarArchivo(base64: string, row: NotificacionImplicado) {
    if (base64 && row.idAnexo) {
      this.sharedService
        .editarDocumentoRemision({
          idSolicitudServicio: this.tarea.idSolicitud,
          idSolicitudServicioAnexo: row.idAnexo,
          entrada: base64,
        })
        .subscribe(async (archivo) => {
          if (archivo && archivo.statusCode == 200) {
            this.modales
              .modalExito('Constancia modificada exitosamente.')
              .subscribe(() => {
                this.consultar();
              });
          }
        });
    }
  }
  /**
   * @descripcion permite consultar la informacion del reporte y generar su visualizacion
   */
  visualizarReporte(row: NotificacionImplicado) {
    this.spinner.show();
    this.notificacionesImplicadoService
      .generarNotificacion(
        this.tarea.idSolicitud,
        row.idInvolucrado,
        this.tarea.idTarea
      )
      .subscribe((result) => {
        if (result && result.statusCode == 200) {
          this.consultar();
          this.implicadoSeleccionado = result.data;
          this.spinner.show();
          setTimeout(() => {
            SharedFunctions.generatePdfAutoTable([
              document.getElementById(
                'reporte-notificacion-implicados'
              ) as HTMLTableElement,
              document.getElementById(
                'reporte-constancia-notificacion'
              ) as HTMLTableElement,
            ]);
            setTimeout(() => {
              this.spinner.hide();
              this.implicadoSeleccionado = null;
            }, 1000);
          }, 1000);
        }
      });
  }

  cerrarActuaciones() {
    this.modales.modalCerrarActuaciones(this.tarea);
  }

  cancelar() {
    this.modales.modalCancelar();
  }

  archivarDiligencias() {
    this.modales.modalArchivarDiligencias(this.tarea);
  }
  /**
   * La audiencia es reprogramable siempre que uno de los involucrados haya presentado una excusa válida.
   */
  get habilitarCerrarActuaciones() {
    const sinRecibir: any[] = this.dataSource.data.filter((value) => {
      return (
        value.estado && value.estado !== EstadosNotificacionImplicado.RECIBIDO
      );
    });
    return sinRecibir && sinRecibir.length ? false : true;
  }
}
