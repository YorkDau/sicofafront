import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CodigosRespuesta, ImagenesModal, Mensajes } from 'src/app/constants';
import {
  PostTablaSeguimiento,
  TablaSeguimiento,
} from 'src/app/pages/private/interfaces/seguimiento.interface';
import { Modales } from '../modals';
import { SeguimientoService } from '../../services/seguimiento.service';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import * as validaciones from 'src/app/shared/seguimiento/validator';
import { ModalCrearSeguimientoComponent } from './modal-crear-seguimiento/modal-crear-seguimiento.component';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserInterface } from 'src/app/interfaces/usuario.interface';

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.scss'],
})
export class SeguimientoComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  public myForm!: FormGroup;
  private perfil: string = '';
  public mostrarValidaciones: boolean = false;
  public validacionCampos: string =
    'Los campos de nombre y apellidos son obligatorios';

  public displayedColumns: string[] = [
    'codsolicitud',
    'nombresApellidos',
    'tipoProceso',
    'numeroDocumento',
    'fechaSeguimiento',
    'accion',
  ];

  public dataSourceList: TablaSeguimiento[] = [];
  public dataSource = new MatTableDataSource<TablaSeguimiento>(
    this.dataSourceList
  );

  private user!: UserInterface | undefined;

  constructor(
    private fb: FormBuilder,
    private _dialog: MatDialog,
    private seguimientoService: SeguimientoService,
    private authService: AuthService,
    private datePipe: DatePipe
  ) {

    this.user = this.authService.currentUserValue!;
    this.perfil = this.user.perfil!;
  }

  ngOnInit(): void {
    this.cargarForm();
  }

  ngAfterViewInit() {
    this.cargarDatosTabla();
    this.dataSource.paginator = this.paginator;
  }

  /**
   * @description carga el formulario
   */
  public cargarForm() {
    this.myForm = this.fb.group(
      {
        nombres: '',
        primerApellido: '',
        segundoApellido: '',
        numeroDocumento: '',
        codSolicitud: '',
        fecha: '',
        fechaF: ''
      },
      {
        validators: [
          validaciones.validarNombreCompleto(),
          validaciones.validarPrimerApellido(),
          validaciones.validarSegundoApellido(),
        ],
      }
    );
  }

  /**
   * @description carga la informacion de la tabla
   */
  private cargarDatosTabla() {
    this.seguimientoService.getSeguimientos(this.getDataPost).subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.dataSourceList = data.data.datosPaginados;
          this.dataSource = new MatTableDataSource(this.dataSourceList);
          this.dataSource.paginator = this.paginator;
        } else {
          Modales.modalExito(
            Mensajes.MENSAJE_ERROR_G,
            ImagenesModal.EXCLAMACION,
            this._dialog
          );
        }
      },
      error: () => {
        Modales.modalExito(
          Mensajes.MENSAJE_ERROR_G,
          ImagenesModal.EXCLAMACION,
          this._dialog
        );
      },
    });
  }

  public consultarCasos() {
    this.mostrarValidaciones = false;
    if (this.myForm.invalid) {
      this.mostrarValidaciones = true;
      this.limpiarRegistros();
    } else {
      this.cargarDatosTabla();
    }
  }

  /**
   * @description si esta el campo primer apellido lleno, debe llenar el nombre
   * hace validacion personal en validators.ts
   */
  public isRequiredNombre(): boolean {
    return this.myForm.hasError('requiredNombres');
  }

  /**
   * @description si esta el campo nombre lleno, debe llenar el primer apellido
   * hace validacion personal en validators.ts
   */
  public isRequiredPrimerApellido(): boolean {
    return this.myForm.hasError('requiredPrimerApellido');
  }

  /**
   * @description si esta el campo segundo apellido lleno, debe llenar el nombre y primer apellido
   * hace validacion personal en validators.ts
   */
  public isRequiredSegundoApellido(): boolean {
    return this.myForm.hasError('requiredSegundoApellido');
  }

  /**
   * @description limpia la grilla del formulario
   */
  limpiarRegistros() {
    this.dataSourceList = [];
    this.dataSource = new MatTableDataSource(this.dataSourceList);
  }

  /**
   * @description abre modal para seleccionar la solicitud a hacer seguimiento
   * luego llamar el servicio de crear
   */
  public abrirModalCrearSeguimiento() {
    const dialogRef = this._dialog.open(ModalCrearSeguimientoComponent, {
      panelClass: 'roundedModal',
      disableClose: true,
      width: '700px',
      height: '450px',
    });
    dialogRef.afterClosed().subscribe((resp) => {
      if (resp === true) {
        this.consultarCasos();
      }
    });
  }

  /**
   * @description interface para obtener los datos del formulario
   */
  private get getDataPost(): PostTablaSeguimiento {
    const fecha = this.myForm.get('fecha')?.value;
    this.myForm.controls['fechaF'].setValue(this.datePipe.transform(fecha, 'dd/MM/yyyy HH:mm:ss'))
    return {
      nombres: this.myForm.get('nombres')?.value,
      primerApellido: this.myForm.get('primerApellido')?.value,
      segundoApellido: this.myForm.get('segundoApellido')?.value,
      numeroDocumento: this.myForm.get('numeroDocumento')?.value,
      codSolicitud: this.myForm.get('codSolicitud')?.value,
      fecha: this.myForm.get('fechaF')?.value,
      userID: this.user?.userID!,
      codPerfil: this.perfil,
    };
  }
}
