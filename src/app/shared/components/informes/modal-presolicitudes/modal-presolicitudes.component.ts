import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CodigosRespuesta, ImagenesModal, Mensajes } from 'src/app/constants';
import { RecepcionCasosInterface } from 'src/app/interfaces/recepcion-casos.interface';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { Modales } from 'src/app/shared/modals';
import { AuroraTableColumn, AuroraActionColumn } from 'src/app/shared/table/table.component';

@Component({
  selector: 'app-modal-presolicitudes',
  templateUrl: './modal-presolicitudes.component.html',
  styleUrls: ['./modal-presolicitudes.component.scss'],
})
export class ModalPresolicitudesComponent implements OnInit {
  form!: FormGroup;
  formSubmitted = false;
  mostrarValidaciones = false;
  mensajeSinReg = 'No se encontraron solicitudes.';
  
  // Configuración de Aurora Table
  public columns: AuroraTableColumn[] = [
    { name: 'codigoSolicitud', title: 'Código Solicitud' },
    { 
      name: 'fechaSolicitud', 
      title: 'Fecha Solicitud',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    { 
      name: 'estadoSolicitud', 
      title: 'Estado',
      render: (value: string) => value?.toUpperCase()
    },
    { 
      name: 'esCompetenciaComisaria', 
      title: 'Competencia',
      render: (value: boolean) => value ? 'SÍ' : 'NO'
    },
    { 
      name: 'descripcionHechos', 
      title: 'Descripción Hechos',
      render: (value: string) => value || 'Sin descripción'
    }
  ];

  public actions: AuroraActionColumn[] = [
    {
      imagen: 'assets/images/select.svg',
      tooltip: 'Seleccionar solicitud',
      tooltipPosition: 'right',
      accion: (row) => this.seleccionarSolicitud(row)
    }
  ];

  public listaCasos: RecepcionCasosInterface[] = [];

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

  private cargarFormulario() {
    this.form = this.fb.group(
      {
        numeroDocumento: [''],
        fechaSolicitud: [null],
        fechaSolicitudFinal: [null],
        codigoSolicitud: [''],
        idComisaria: [ this.authService.currentUserValue?.idComisaria ],
        nomO: [true, Validators.requiredTrue],
      },
      {
        validators: this.validarRangoFechas.bind(this)
      }
    );
  }

  validarRangoFechas(group: AbstractControl): ValidationErrors | null {
    const inicio = group.get('fechaSolicitud')?.value;
    const fin = group.get('fechaSolicitudFinal')?.value;

    if (inicio && fin) {
      if (new Date(inicio) > new Date(fin)) {
        return { rangoFechasInvalido: true };
      }
    }
    return null;
  }

  cerrarModal() {
    this.matDialogRef.close(false);
  }

  consultarPresolicitudes() {
    this.mostrarValidaciones = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.formSubmitted = false;
      this.limpiarTabla();
      return;
    }

    this.formSubmitted = true;
    this.sharedService
      .consultaPreSolicitudesGenerales(this.form.value)
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            this.listaCasos = data.data.datosPaginados || [];
            if (this.listaCasos.length === 0) {
              this.mensajeSinReg = 'No se encontraron solicitudes con los filtros aplicados';
            }
          } else {
            this.listaCasos = [];
            this.mensajeSinReg = 'No se encontraron resultados';
          }
        },
        error: () => {
          Modales.modalInformacion(
            Mensajes.MENSAJE_ERROR_G,
            this.dialog,
            ImagenesModal.EXCLAMACION
          );
          this.listaCasos = [];
        }
      });
  }

  limpiarTabla() {
    this.listaCasos = [];
  }

  seleccionarSolicitud(solicitud: RecepcionCasosInterface) {
    this.matDialogRef.close(solicitud);
  }
}