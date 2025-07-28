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
  
public columns: AuroraTableColumn[] = [
  { 
    name: 'codigoSolicitud', 
    title: 'Código Solicitud',
    width: '120px' // Ancho fijo para códigos
  },
  {
    name: 'fechaSolicitud',
    title: 'Fecha Solicitud',
    width: '120px', // Ancho fijo para fechas
    render: (value: string) => new Date(value).toLocaleDateString()
  },
  { 
    name: 'tipoSolicitud', 
    title: 'Tipo Solicitud',
    width: '150px', // Ancho ajustado para tipos de solicitud
    render: (value: string) => value?.toUpperCase()
  },
  { 
    name: 'estadoSolicitud', 
    title: 'Estado',
    width: '100px', // Ancho para estados
    render: (value: string) => value?.toUpperCase()
  },
  { 
    name: 'esCompetenciaComisaria', 
    title: 'Competencia',
    width: '100px', // Ancho para sí/no
    render: (value: boolean) => value ? 'SÍ' : 'NO'
  },
  { 
    name: 'nombreInvolucradoVictima', // Nombre de la Víctima Principal
    title: 'Nombre Víctima',
    width: '200px', // Buen ancho para nombres completos
    render: (value: string) => value || 'N/A'
  },
  { 
    name: 'tipoDocumentoInvolucradoVictima', // Tipo de Documento de la Víctima Principal
    title: 'Tipo Documento',
    width: '150px', // Ancho para tipos de documento
    render: (value: string) => value || 'N/A'
  },
  { 
    name: 'documentoInvolucradoVictima', // Número de Documento de la Víctima Principal
    title: 'Documento Víctima',
    width: '150px', // Ancho para números de documento
    render: (value: string) => value || 'N/A'
  },
  { 
    name: 'descripcionHechos', 
    title: 'Descripción Hechos',
    width: 'auto', // Permite que tome el espacio restante
    // o un valor como '1fr' si usa CSS Grid o flexbox para distribución
    // o un ancho fijo grande si lo prefieres, ej. '300px'
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