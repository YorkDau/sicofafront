import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { CrearEtiquetaTareaInterface } from 'src/app/interfaces/shared.interfaces';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { SidenavComponent } from 'src/app/shared/components/general/sidenav/sidenav.component';
import {
  CodigosRespuesta,
  EstadoQuorum,
  ImagenesModal,
  Mensajes,
  TiposDocumentoCarga,
} from '../../../../constants';
import { RecepcionCasosInterface } from '../../../../interfaces/recepcion-casos.interface';
import { SharedService } from '../../../../services/shared.service';
import { Modales } from '../../../../shared/modals';
import { QuorumService } from '../../abogado/services/quorum.service';
import { QuorumAudiencia } from '../../interfaces/abogado.interface';

@Component({
  selector: 'app-quorum',
  templateUrl: './quorum.component.html',
  styleUrls: ['./quorum.component.scss'],
})
export class QuorumComponent {
  @ViewChild('paginator') paginator!: MatPaginator;
  public tarea: RecepcionCasosInterface = JSON.parse(
    sessionStorage.getItem('info')!
  );

  public columnas: string[] = [
    'nombreInvolucrado',
    'estado',
    'esVictima',
    'accion',
  ];

  idProgramacion!: number;
  idSolicitudServicio!: number;

  public dataSource: MatTableDataSource<QuorumAudiencia> =
    new MatTableDataSource<QuorumAudiencia>([]);
  public radioReprogramar: boolean = false;

  user!: UserInterface | undefined;

  constructor(
    private quorumService: QuorumService,
    private sharedService: SharedService,
    private authService: AuthService,
    private dialog: MatDialog,
    private modales: Modales,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
    this.consultar();
  }

  /**
   * @descripcion  consulta el listado de quorum
   */
  consultar() {
    this.quorumService
      .obtenerQuorum(this.tarea.idTarea)
      .subscribe({
        next: (result) => {
          if (result && result.statusCode === 200) {
            this.idProgramacion = result.data?.idProgramacion;
            this.idSolicitudServicio = result.data?.idSolicitudServicio;
            this.radioReprogramar = result.data?.reprogramada;
            this.dataSource.data = result.data?.quorums;
            this.dataSource.paginator = this.paginator;
          }
        },
        error: (err) => {
          this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
        },
      });
  }

  /**
   * @descripcion si el involucrado no asiste
   */
  isNoAsiste(row: QuorumAudiencia) {
    return row.estado == -1 || row.estado == EstadoQuorum.NO_ASISTE;
  }

  /**
   * @descripcion si el involucrado asiste
   */
  isAsiste(row: QuorumAudiencia) {
    return row.estado == EstadoQuorum.ASISTE;
  }

  /**
   * @description si el archivo fue cargado
   * @param row
   * @returns
   */
  isArchivoCargado(row: QuorumAudiencia) {
    return row.idAnexo > 0;
  }
  /**
   * @descripcion si el involucrado no asiste con justa causa
   */
  isJustaCausa(row: QuorumAudiencia) {
    return row.estado == EstadoQuorum.EXCUSA_JUSTA;
  }

  /**
   * @descripcion permite cargar la excusa del involucrado
   */
  cargarExcusa(base64: string, row: QuorumAudiencia) {
    row.estado = EstadoQuorum.EXCUSA_INJUSTA;
    if (base64) {
      this.guardarQuorum(row, base64);
    }
  }

  /**
   * @descripcion realiza la creacion del registro de quorum
   */
  guardarQuorum(row: QuorumAudiencia, base64: string = '') {
    const excusaJusta = row.estado == EstadoQuorum.EXCUSA_INJUSTA;
    this.quorumService
      .guardarQuorum({
        entrada: excusaJusta ? base64 : '',
        idAnexo: row.idAnexo > 0 ? row.idAnexo : 0,
        idQuorum: row.idQuorum > 0 ? row.idQuorum : 0,
        idEstado: row.estado,
        idInvolucrado: row.idInvolucrado,
        idSolicitudServicio: this.tarea.idSolicitud,
        idTarea: this.tarea.idTarea,
        idUsuario: this.user?.userID!,
        tipoDocumento: TiposDocumentoCarga.ASISTENCIA_QUORUM,
      })
      .subscribe((result) => {
        if (result && result.statusCode == 200) {
          this.consultar();
          this.modales.modalExito(
            excusaJusta
              ? 'Excusa cargada exitosamente.'
              : 'Asistencia marcada existosamente'
          );
        } else {
          this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
        }
      });
  }
  /**
   * @descripcion marca al involucrado como que asistió al quorum
   */
  marcarAsistio(row: QuorumAudiencia) {
    row.estado = EstadoQuorum.ASISTE;
    if (row.idQuorum && row.idQuorum > 0) {
      this.actualizarQuorum(row);
    } else {
      this.guardarQuorum(row);
    }
  }
  /**
   * @descripcion marca al involucrado como que asistió al quorum
   */
  marcarNoAsiste(row: QuorumAudiencia) {
    row.estado = EstadoQuorum.NO_ASISTE;
    this.actualizarQuorum(row);
  }

  /**
   * @descripcion marca al involucrado como que presentó excusa con justa causa
   */
  marcarJustaCausa(row: QuorumAudiencia) {
    row.estado = EstadoQuorum.EXCUSA_JUSTA;
    this.actualizarQuorum(row);
  }

  /**
   * @description actualiza el registro del quorum cuando ya existe
   * @param row
   */
  actualizarQuorum(row: QuorumAudiencia) {
    if (row.idQuorum && row.idQuorum > 0) {
      this.quorumService
        .actualizarEstadoQuorum({
          idEstado: row.estado,
          idQuorum: row.idQuorum,
          idAnexo: 0,
        })
        .subscribe({
          next: (result) => {
            if (result && result.statusCode == 200) {
              this.consultar();
              this.modales.modalExito(
                'Estado del quorum actualizado exitosamente.'
              );
            }
          },
          error: () => {
            this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
          },
        });
    }
  }
  /**
   * @descripcion cierra las actuaciones
   */
  cerrarActuaciones(crearEtiqueta: boolean = false) {
    this.modales.modalCerrarActuaciones(
      this.tarea,
      undefined,
      this.isAsistenTodos ? '0' : '1'
    );
  }

  modalConfirmaCerrarActuacion() {
    Modales.modalConfirmacion(
      Mensajes.MENSAJE_CERRAR_ACT,
      this.dialog,
      ImagenesModal.EXCLAMACION
    ).subscribe((res) => {
      if (res) this.guardar(true);
    });
  }

  crearEtiqueta() {
    const obj: CrearEtiquetaTareaInterface = {
      valorEtiqueta: this.radioReprogramar ? '1' : '0',
      idsolicitudServicio: this.tarea.idSolicitud,
      idtarea: this.tarea.idTarea,
    };
    this.sharedService.crearEtiqueta(obj).subscribe({
      next: (data: ResponseInterface) => {
        if (data && data.statusCode === CodigosRespuesta.OK) {
          this.cerrarActuacion();
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


  guardar(cerrar: boolean = false) {
    this.quorumService.actualizarProgramacionQuorum(this.getObjGuardar()).subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          if (cerrar) {
            this.cerrarActuacion();
          } else {
            this.modales.modalExito('Se ha guardado la informacion');
          }

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

  getObjGuardar(): any {
    return {
      idProgramacion: this.idProgramacion,
      idSolicitudServicio: this.idSolicitudServicio,
      reprogramada: this.radioReprogramar,
      faltantes: !this.isAsistenTodos
    };
  }

  cerrarActuacion() {
    this.sharedService
      .cerrarActuaciones({
        tareaID: this.tarea.idTarea,
        perfilCod: this.user?.perfil!,
        userID: this.user?.userID!,
        valorEtiqueta: this.isAsistenTodos ? '0' : '1',
      })
      .subscribe((cerrar) => {
        if (cerrar && cerrar.statusCode == 200) {
          sessionStorage.removeItem('info');
          let navigate = SidenavComponent.getRutaPerfil(this.user?.perfil!)[0]
            .ruta!;
          this.router.navigate([navigate]);
        } else {
          Modales.modalInformacion(
            Mensajes.MENSAJE_ERROR_G,
            this.dialog,
            ImagenesModal.EXCLAMACION
          );
        }
      });
  }

  get isAsistenTodos() {
    return this.dataSource.data.find(
      (value) => value.estado == EstadoQuorum.NO_ASISTE
    )
      ? false
      : true;
  }

  /**
   * @descripcion redirige a la recepcion
   */
  cancelar() {
    const ruta = this.tarea.pathRetorno ? this.tarea.pathRetorno : undefined;
    this.modales.modalCancelar(ruta);
  }
  /**
   * @descripcion archiva las diligencias
   */
  archivarDiligencias() {
    this.modales.modalArchivarDiligencias(this.tarea);
  }
}
