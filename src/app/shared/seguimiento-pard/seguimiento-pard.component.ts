import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { TablaRemisiones } from 'src/app/pages/private/interfaces/remision.interface';
import { SeguimientoService } from 'src/app/services/seguimiento.service';

import { lastValueFrom } from 'rxjs';
import { CodigosRespuesta, ImagenesModal, Mensajes } from 'src/app/constants';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Modales } from '../modals';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seguimiento-pard',
  templateUrl: './seguimiento-pard.component.html',
  styleUrls: ['./seguimiento-pard.component.scss']
})
export class SeguimientoPardComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  public displayedColumns: string[] = ['tipoFormato', 'fecha', 'acciones'];
  public displayedColumnsMedidas: string[] = ['nomMedida'];

  public dataSource = new MatTableDataSource<TablaRemisiones>([]);
  public dataSourceMedidas = new MatTableDataSource<TablaRemisiones>([]);

  public objSol = JSON.parse(sessionStorage.getItem('info')!);
  public idTareaInstrumentos!: number;
  private user!: UserInterface | undefined;
  modales: any;

  requiereModificar: string = 'no';

  constructor(
    private seguimientoService: SeguimientoService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.authService.currentUserValue!;
    this.cargarTabla();
  }

  private async cargarTabla() {
    const cargaID = await this.getListasMedidas();
    if (cargaID) {
      this.seguimientoService
        .getTablaSeguimiento(this.idTareaInstrumentos, this.objSol.idSolicitud)
        .subscribe({
          next: (data: ResponseInterface) => {
            if (data.statusCode === CodigosRespuesta.OK) {
              this.dataSource = new MatTableDataSource(data.data);
            } else {
              this.msgError();
            }
          },
          error: () => {
            this.msgError();
          },
        });
    }
  }

  private async getListasMedidas() {
    try {
      const data: ResponseInterface = await lastValueFrom(
        this.seguimientoService.getMedidasEjecutadasPard(this.objSol.idSolicitud, this.user?.userID!)
      );
      if (data.statusCode === CodigosRespuesta.OK) {
        this.dataSourceMedidas = new MatTableDataSource(data.data.medidas);
        this.dataSourceMedidas.paginator = this.paginator;
        this.idTareaInstrumentos = data.data.idTareaInstrumentos;
      }
      return Promise.resolve(true);
    } catch (error) {
      this.msgError()
    }
    return Promise.resolve(false);
  }

  private msgError() {
    this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
  }

  public cancelar() {
    this.modales.modalCancelar('/casos');
  }

  public modalConfirmaCerrarActuacion() {
    Modales.modalConfirmacion(
      Mensajes.MENSAJE_CERRAR_ACT,
      this.dialog,
      ImagenesModal.EXCLAMACION
    ).subscribe((res) => {
      if (res) this.cerrarActuacion();
    });
  }

  private cerrarActuacion() {

    this.seguimientoService
      .cerrarActuacionesPard(this.retornarObjCerrarActuacion())
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            this.modales
              .modalExito(
                `Información guardada exitosamente.`
              )
              .subscribe(() => {
                this.router.navigate(['/casos']);
              });
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
      perfilCod: this.user?.perfil,
      valorEtiqueta: this.requiereModificar === 'si' ? 1 : 0
    };
  }
}
