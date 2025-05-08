import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { SharedService } from 'src/app/services/shared.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CodigosRespuesta, ImagenesModal, Mensajes } from 'src/app/constants';
import { RecepcionCasosInterface } from 'src/app/interfaces/recepcion-casos.interface';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { Modales } from 'src/app/shared/modals';

@Component({
  selector: 'app-modal-presolicitudes',
  templateUrl: './modal-presolicitudes.component.html',
  styleUrls: ['./modal-presolicitudes.component.scss'],
})
export class ModalPresolicitudesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  form!: FormGroup;
  formSubmitted: boolean = false;
  mostrarValidaciones: boolean = false;
  mensajeSinReg: string = 'No se encontraron solicitudes.';
  columnas: string[] = [
    'codigoSolicitud',
    'fechaSolicitud',
    'estadoSolicitud',
    'esVictima',
    'esCompetenciaComisaria',
    'descripcionHechos'
  ];

  dataSource = new MatTableDataSource<RecepcionCasosInterface>([]);
  private listaCasos: RecepcionCasosInterface[] = [];

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private authService: AuthService,
    private matDialogRef: MatDialogRef<ModalPresolicitudesComponent>,
        private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.cargarFormulario();
  }

  cargarFormulario() {
    this.form = this.fb.group({
      numeroDocumento: '',
      fechaSolicitud:[],
      codigoSolicitud: '',
      idComisaria: this.authService.currentUserValue?.idComisaria,
      nomO: [true, Validators.requiredTrue],
    });
  }

  cerrarModal() {
    this.matDialogRef.close(false);
  }

  consultarPresolicitudes() {
    if (this.form.valid) {
      this.formSubmitted = true;
      this.mostrarValidaciones = false;

      this.sharedService.consultaPreSolicitudesGenerales(this.form.value).subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            const datos = data.data.datosPaginados || [];
            if (datos.length > 0) {
              this.listaCasos = datos;
              this.dataSource = new MatTableDataSource(this.listaCasos);
              this.dataSource.paginator = this.paginator;
            } else {
              this.limpiarTabla();
            }
          }
        },
        error: () => {
          Modales.modalInformacion(
            Mensajes.MENSAJE_ERROR_G,
            this.dialog,
            ImagenesModal.EXCLAMACION
          );
        }
      });
    } else {
      this.mostrarValidaciones = true;
      this.formSubmitted = false;
      this.limpiarTabla();
    }
  }

  limpiarTabla() {
    this.listaCasos = [];
    this.dataSource = new MatTableDataSource(this.listaCasos);
  }

  seleccionarSolicitud(solicitud: RecepcionCasosInterface) {
    this.matDialogRef.close(solicitud); // Devuelve la solicitud seleccionada
  }
}
