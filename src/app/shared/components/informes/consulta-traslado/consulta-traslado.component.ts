import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup , FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CodigosRespuesta, ImagenesModal, Mensajes } from 'src/app/constants';
import { SolicitudTrasladoInterface } from 'src/app/interfaces/recepcion-casos.interface';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { SharedService } from 'src/app/services/shared.service';
import { Modales } from 'src/app/shared/modals';
import { MatTableDataSource } from '@angular/material/table';
import { AuroraActionColumn, AuroraTableColumn } from 'src/app/shared/table/table.component';

@Component({
  selector: 'app-consulta-traslado',
  templateUrl: './consulta-traslado.component.html',
  styleUrls: ['./consulta-traslado.component.scss']
})
export class ConsultaTrasladoComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public remisionesDiarias: any[] = [];
  private intervalId: any; // <<--- ID del temporizador

  public columns: AuroraTableColumn[] = [
    {
      name: 'codigoSolicitud',
      title: 'Código Solicitud',
      render: (value: string) => value?.toUpperCase()
    },

    {
      name: 'nombreCiudadano',
      title: 'Ciudadano',
      render: (value: string, row: any) =>
        [
          row.nombreCiudadano,
          row.primerApellido,
          row.segundoApellido
        ]
        .filter(Boolean)
        .join(' ')
        .toUpperCase()
    },

    {
      name: 'comisariaActual',
      title: 'Comisaría Actual',
      render: (value: string) => value?.toUpperCase()
    },

    {
      name: 'descripcionDeHechos',
      title: 'Descripción de los Hechos',
      render: (value: string) => value?.toUpperCase()
    },

    {
      name: 'comisariaOrigen',
      title: 'Comisaría Origen',
      render: (value: string) => value?.toUpperCase()
    },

    {
      name: 'entidadExterna',
      title: 'Entidad Externa',
      render: (value: string) => value?.toUpperCase()
    }
  ];

  public actions: AuroraActionColumn[] = [];
  private listaCasos: SolicitudTrasladoInterface[] = [];
  public dataSource = new MatTableDataSource<SolicitudTrasladoInterface>(this.listaCasos);

  public form!: FormGroup;
  formSubmitted = false;
  mostrarValidaciones = false;
  mensajeSinReg = 'No se encontraron solicitudes de traslados.';
  datePipe: any;

  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private authService: AuthService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.cargarForm();
    this.consultarRemisionesDiarias();
    this.iniciarAutoActualizacion();  
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);  
  }

  private cargarForm() {
    this.form = this.formBuilder.group({
      codigoSolicitud: '',
      nomO: [true, Validators.requiredTrue],
    });
  }


  iniciarAutoActualizacion() {
    this.intervalId = setInterval(() => {
      this.consultarRemisionesDiarias();
    }, 5 * 60 * 1000); // 5 minutos
  }

  consultarRemisionesDiarias() {
    this.sharedService.consultarRemisionesPorDia().subscribe({
      next: (response: any) => {
        if (response.statusCode === CodigosRespuesta.OK) {
          this.remisionesDiarias = response.data ?? 0;
          console.log('Remisiones actualizadas:', this.remisionesDiarias);
        }
      },
      error: (err) => {
        console.error('Error obteniendo remisiones diarias:', err);
      }
    });
  }

  consultarSolicitudesTraslado() {
    this.mostrarValidaciones = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.formSubmitted = false;
      return;
    }

    this.formSubmitted = true;
    this.sharedService.consultaSolicitudesTraslados(this.form.value).subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.listaCasos = data.data.datosPaginados || [];
          this.dataSource.data = this.listaCasos;
          if (this.listaCasos.length === 0) {
            this.mensajeSinReg = 'No se encontraron solicitudes de traslados con los filtros aplicados';
          }
        } else {
          this.listaCasos = [];
          this.dataSource.data = [];
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
        this.dataSource.data = [];
      }
    });
  }
}
