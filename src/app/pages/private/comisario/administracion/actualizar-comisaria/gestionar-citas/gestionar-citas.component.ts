import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CodigosRespuesta, Mensajes } from '../../../../../../constants';
import { Modales } from '../../../../../../shared/modals';
import { CitaInterface } from '../../interfaces/actualizacion-comisaria.interface';
import { GestionCitasService } from '../../services/gestion-citas.service';
import { ModalCrearCitaComponent } from './modal-crear-cita/modal-crear-cita.component';
@Component({
  selector: 'app-gestionar-citas',
  templateUrl: './gestionar-citas.component.html',
  styleUrls: ['./gestionar-citas.component.scss'],
})
export class GestionarCitasComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  public displayedColumns: string[] = ['fecha', 'hora', 'activo'];
  public dataSource = new MatTableDataSource<CitaInterface>([]);
  public citas: CitaInterface[] = [
    {
      idCita: 0,
      activo: true,
      fechaCita: new Date(),
      horaCita: new Date(),
    },
  ];

  constructor(
    private _dialog: MatDialog,
    private gestionCitasService: GestionCitasService,
    private modales: Modales
  ) { }

  ngOnInit(): void {
    this.cargarCitas();
  }

  actualizarTabla() {
    this.dataSource.data = [];
    this.dataSource.data = this.citas;
    this.dataSource.paginator = this.paginator;
  }

  private cargarCitas() {
    this.gestionCitasService.getConsultarCitasPre().subscribe({
      next: (result) => {
        if (result && result.statusCode == CodigosRespuesta.OK) {
          this.citas = result.data;
        }
      },
      error: () => {
        this.citas = [];
        this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
      },
      complete: () => {
        this.actualizarTabla();
      },
    });
  }

  public abrirModalAgregarCita() {
    this._dialog
      .open(ModalCrearCitaComponent, {
        panelClass: 'roundedModal',
        disableClose: true,
        width: 'fit-content',
        height: 'fit-content',
      })
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          this.cargarCitas();
        }
      });
  }

  actualizarCita(cita: CitaInterface, activo: boolean) {
    this.modales
      .modalConfirmacion('¿Desea cambiar el estado de esta cita?')
      .subscribe((confirmacion) => {
        if (confirmacion) {
          this.gestionCitasService
            .getActualizarCita({
              idCita: cita.idCita,
              activo: !cita.activo,
            })
            .subscribe({
              next: (actualizar) => {
                if (
                  actualizar &&
                  actualizar.statusCode == CodigosRespuesta.OK
                ) {
                  this.modales.modalExito(
                    'Estado de cita cambiado exitosamente.'
                  );
                }
              },
              error: () => {
                this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
              },
              complete: () => {
                this.cargarCitas();
              },
            });
        }
      });
  }
}
