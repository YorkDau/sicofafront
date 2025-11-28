import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup , FormBuilder, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CodigosRespuesta, ImagenesModal, Mensajes } from 'src/app/constants';
import {  SolicitudTrasladoInterface } from 'src/app/interfaces/recepcion-casos.interface';
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
export class ConsultaTrasladoComponent implements OnInit {
@ViewChild(MatPaginator) paginator!: MatPaginator;

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

  public actions: AuroraActionColumn[] = [
  
  ];
      private listaCasos: SolicitudTrasladoInterface[] = [];

    public dataSource = new MatTableDataSource<SolicitudTrasladoInterface>(
      this.listaCasos
    );
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
  ) { }

  ngOnInit(): void {
     this.cargarForm();
  }
    private cargarForm() {
      this.form = this.formBuilder.group({
        codigoSolicitud: '',
        //idComisaria: this.authService.currentUserValue?.idComisaria,
        nomO: [true, Validators.requiredTrue],
      });
    }

  verHistorialCiudadano(row: any) {
    // Lógica para ver el historial del ciudadano
  }
    consultarSolicitudesTraslado() {
      this.mostrarValidaciones = true;
  
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        this.formSubmitted = false;
        //this.limpiarTabla();
        return;
      }
  
      this.formSubmitted = true;
      this.sharedService
        .consultaSolicitudesTraslados(this.form.value)
        .subscribe({
          next: (data: ResponseInterface) => {
            if (data.statusCode === CodigosRespuesta.OK) {
              this.listaCasos = data.data.datosPaginados || [];
              if (this.listaCasos.length === 0) {
                this.mensajeSinReg = 'No se encontraron solicitudes de traslados con los filtros aplicados';
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

}
