import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {
  CodigosRespuesta,
  ImagenesModal,
  Mensajes,
  MensajeSolicitudXPerfil,
} from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { Modales } from 'src/app/shared/modals';
import { MedidasJuezInterface } from '../../interfaces/decision-juez';
import { AbogadoService } from '../../services/abogado.service';

@Component({
  selector: 'app-modal-medidas-auto',
  templateUrl: './modal-medidas-auto.component.html',
  styleUrls: ['./modal-medidas-auto.component.scss'],
})
export class ModalMedidasAutoComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  public dataSource = new MatTableDataSource<MedidasJuezInterface[]>([]);
  public columnas: string[] = ['nombreMedida', 'accion'];
  public mensajeSinReg: string = MensajeSolicitudXPerfil.OTRO;

  constructor(
    private dialogRef: MatDialogRef<ModalMedidasAutoComponent>,
    private abogadoService: AbogadoService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      idSolicitud: number;
      listaMedidas: MedidasJuezInterface[];
    }
  ) {}

  ngOnInit(): void {
    if (!this.data.listaMedidas.length) {
      this.consultarMedidasApelacion();
    } else {
      this.llenarDataSourceGrid(this.data.listaMedidas);
    }
  }

  /**
   * @description llena dataSource grid
   * @param data arreglo
   */
  private llenarDataSourceGrid(data: any[]) {
    this.dataSource = new MatTableDataSource(data);
    this.data.listaMedidas = data;
    this.dataSource.paginator = this.paginator;
  }

  /**
   * @description llama servicio consultarMedidasApelacion
   */
  private consultarMedidasApelacion() {
    this.abogadoService
      .consultarMedidasApelacion(this.data.idSolicitud)
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            this.llenarDataSourceGrid(data.data);
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
   * @description cierra modal
   */
  public cerrarModal() {
    this.dialogRef.close(this.data.listaMedidas);
  }

  /**
   * @description cambia el estado de la medida seleccionada
   * @param row objeto a cambiar
   */
  public actualizarEstadoMedida(row: MedidasJuezInterface, estado: string) {
    setTimeout(() => {
      row.estadoMedida = estado;
      const updateArray = this.data.listaMedidas.map((m) =>
        m.idMedida === row.idMedida ? row : m
      );
      this.data.listaMedidas = [...updateArray];
    }, 100);
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
}
